import { redirect } from "next/navigation";

export default async function SimDuLichVietNamDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/sim-viet-nam/${params.slug}`);
}
