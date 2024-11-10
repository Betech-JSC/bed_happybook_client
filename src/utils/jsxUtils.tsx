import { components } from "react-select";

const convertToUnaccentedLetters = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) return text;

  const sanitizedHighlight = convertToUnaccentedLetters(
    highlight.toLowerCase()
  );
  const sanitizedText = convertToUnaccentedLetters(text.toLowerCase());

  const startIndex = sanitizedText.indexOf(sanitizedHighlight);
  if (startIndex === -1) return text;

  const endIndex = startIndex + sanitizedHighlight.length;

  const before = text.slice(0, startIndex);
  const match = text.slice(startIndex, endIndex);
  const after = text.slice(endIndex);

  return (
    <>
      {before}
      <span
        style={{ color: "#3b82f6" }}
        className="text-blue-500 font-semibold"
      >
        {match}
      </span>
      {after}
    </>
  );
};

const NoOptionsMessage = (props: any) => (
  <components.NoOptionsMessage {...props}>
    <span className="text-gay-600 text-18">Không tìm thấy kết quả phù hợp</span>
  </components.NoOptionsMessage>
);
export { highlightText, NoOptionsMessage, convertToUnaccentedLetters };
