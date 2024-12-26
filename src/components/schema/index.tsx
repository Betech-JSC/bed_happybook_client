import { PostType } from "@/types/post";
import {
  BreadscrumbListSchema,
  BreadscrumbListSchemaProps,
} from "./BreadscrumbListSchema";
import { WebsiteSchema, WebsiteSchemaProps } from "./WebsiteSchema";
import { NewsArticleSchema } from "./NewsArticleSchema";

type SchemaProps = {
  breadscrumbItems: BreadscrumbListSchemaProps["items"];
  article?: PostType;
  children: React.ReactNode;
} & WebsiteSchemaProps;

export default function SeoSchema({
  children,
  breadscrumbItems,
  article,
  ...props
}: SchemaProps) {
  return (
    <>
      {article ? (
        <NewsArticleSchema {...article} />
      ) : (
        <WebsiteSchema {...props} />
      )}

      <BreadscrumbListSchema items={breadscrumbItems} />
      {children}
    </>
  );
}
