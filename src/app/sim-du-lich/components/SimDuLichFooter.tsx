import FAQ from "@/components/content-page/FAQ";
import WhyChooseHappyBook from "@/components/content-page/whyChooseHappyBook";

export default function SimDuLichFooter() {
  return (
    <div className="mt-16 sm:mt-24">
      <div className="mb-8 p-1 sm:p-8 bg-gray-50 rounded-3xl">
        <WhyChooseHappyBook />
      </div>
      <div className="bg-gray-50 rounded-3xl">
        <FAQ />
      </div>
    </div>
  );
}
