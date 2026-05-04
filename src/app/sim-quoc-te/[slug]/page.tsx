import { redirect } from "next/navigation";

export default async function SimQuocTeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/sim-du-lich/quoc-te/${params.slug}`);
}
