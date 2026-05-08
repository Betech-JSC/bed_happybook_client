import { findCheapestVariant, getEsimVariantMoney, getSelectableEsimVariants, type EsimFilterOption, type EsimPackageView } from "./esim";
import { getSimDuLichDetailHref } from "./routes";

type DestinationSelection = Pick<EsimFilterOption, "value" | "label"> | null | undefined;

const normalizeExact = (value: string) => value.trim().toLowerCase();

const normalizeLoose = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const resolveRouteCategoryFromDestination = (destination: DestinationSelection) => {
  const sourceValue = typeof destination === "string" ? destination : destination?.value ?? "";
  const sourceLabel = typeof destination === "string" ? destination : destination?.label ?? "";
  const normalized = normalizeLoose([sourceValue, sourceLabel].filter(Boolean).join(" "));

  if (normalized.includes("viet nam") || normalized.includes("vietnam") || normalized.includes("domestic")) {
    return "viet-nam";
  }

  return "quoc-te";
};

const collectIdentityKeys = (pkg: EsimPackageView) =>
  [pkg.destinationId, pkg.regionId]
    .filter(Boolean)
    .map((value) => `${value}`.trim())
    .filter(Boolean);

const collectSearchKeys = (pkg: EsimPackageView) =>
  [pkg.destination, pkg.title, pkg.subtitle, pkg.coverage, pkg.regionLabel, pkg.operator, pkg.network]
    .filter(Boolean)
    .map((value) => `${value}`.trim())
    .filter(Boolean);

const pickPreferredPackage = (items: EsimPackageView[], locale: string) =>
  [...items].sort((a, b) => {
    const featuredDelta = Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
    if (featuredDelta !== 0) return featuredDelta;

    const cheapestA = findCheapestVariant(a, locale);
    const cheapestB = findCheapestVariant(b, locale);
    const priceA = cheapestA ? getEsimVariantMoney(cheapestA, locale).price : Number.POSITIVE_INFINITY;
    const priceB = cheapestB ? getEsimVariantMoney(cheapestB, locale).price : Number.POSITIVE_INFINITY;
    if (priceA !== priceB) return priceA - priceB;

    return a.slug.localeCompare(b.slug);
  })[0] ?? null;

const findPackageForDestination = (
  destination: DestinationSelection,
  packages: EsimPackageView[],
  locale: string
) => {
  const sourceValue = typeof destination === "string" ? destination : destination?.value ?? "";
  const sourceLabel = typeof destination === "string" ? destination : destination?.label ?? "";
  const exactTokens = [sourceValue, sourceLabel].map(normalizeExact).filter(Boolean);
  const looseTokens = [sourceValue, sourceLabel].map(normalizeLoose).filter(Boolean);

  const exactMatches = packages.filter((pkg) => {
    const keys = collectIdentityKeys(pkg).map(normalizeExact);
    return exactTokens.some((token) => keys.includes(token));
  });

  if (exactMatches.length > 0) {
    return pickPreferredPackage(exactMatches.filter((pkg) => getSelectableEsimVariants(pkg, locale).length > 0), locale);
  }

  const looseMatches = packages.filter((pkg) => {
    const keys = collectSearchKeys(pkg).map(normalizeLoose);
    return looseTokens.some((token) => keys.some((key) => key === token || key.includes(token) || token.includes(key)));
  });

  return pickPreferredPackage(looseMatches.filter((pkg) => getSelectableEsimVariants(pkg, locale).length > 0), locale);
};

export const resolveDefaultSimDuLichPackageHref = (
  destination: DestinationSelection,
  packages: EsimPackageView[] = [],
  locale: string = "vi"
): string | null => {
  const pkg = findPackageForDestination(destination, packages, locale);
  if (!pkg) return null;

  const category = resolveRouteCategoryFromDestination(destination);
  return getSimDuLichDetailHref(category, pkg.slug);
};
