const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const normalizeSimDuLichCategory = (value: string) => {
  const normalized = normalizeSlug(value);
  const compact = normalized.replace(/^sim-du-lich-/, "");

  if (
    normalized === "quoc-te" ||
    normalized === "international" ||
    compact === "quoc-te" ||
    compact === "international"
  )
    return "quoc-te";
  if (
    normalized === "viet-nam" ||
    normalized === "vietnam" ||
    normalized === "domestic" ||
    compact === "viet-nam" ||
    compact === "vietnam" ||
    compact === "domestic"
  ) {
    return "viet-nam";
  }

  return compact;
};

export const getSimDuLichCategoryHref = (value: string, label: string) =>
  `/sim-du-lich/${
    /^\d+$/.test(normalizeSlug(value))
      ? normalizeSimDuLichCategory(label)
      : normalizeSimDuLichCategory(value || label)
  }`;

export const getSimDuLichDetailHref = (category: string, slug: string) =>
  `/sim-du-lich/${normalizeSimDuLichCategory(category)}/${slug}`;
