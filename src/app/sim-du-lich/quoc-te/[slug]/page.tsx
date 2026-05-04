import { redirect } from "next/navigation";

export default async function SimDuLichQuocTeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/sim-quoc-te/${params.slug}`);
}
