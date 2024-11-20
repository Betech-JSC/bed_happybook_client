import React from "react";

interface DynamicTagProps {
  typeElement?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

const DynamicTag: React.FC<DynamicTagProps> = ({
  typeElement = "h3",
  className,
  children,
}) => {
  const Tag = typeElement;

  return <Tag className={className}>{children}</Tag>;
};

export default DynamicTag;
