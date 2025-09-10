import { siteUrl } from "@/constants";
import Script from "next/script";
import { FAQPage, WithContext } from "schema-dts";

type FAQSchemaProps = {
  data: Array<{
    question: string;
    answer: string;
  }>;
  children: React.ReactNode;
};

const jsonLd = (data: FAQSchemaProps["data"]): WithContext<FAQPage> => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: data.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
  author: {
    "@type": "Person",
    name: "Happy Book",
    url: siteUrl,
  },
});

export default function FAQSchema({ data, children }: FAQSchemaProps) {
  if (data?.length < 1) return children;
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd(data)),
        }}
      />
      {children}
    </>
  );
}
