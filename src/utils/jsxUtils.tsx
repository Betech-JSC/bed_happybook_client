import { components } from "react-select";

const highlightText = (text: string, highlight: string) => {
  const sanitizedHighlight = highlight.trim();
  if (!sanitizedHighlight) return text;

  const parts = text.split(new RegExp(`(${sanitizedHighlight})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === sanitizedHighlight.toLowerCase() ? (
      <span key={index} className="text-blue-500 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
};
const NoOptionsMessage = (props: any) => (
  <components.NoOptionsMessage {...props}>
    <span className="text-gay-600 text-18">Không tìm thấy kết quả phù hợp</span>
  </components.NoOptionsMessage>
);
export { highlightText, NoOptionsMessage };
