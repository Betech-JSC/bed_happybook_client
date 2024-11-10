import { components } from "react-select";

const convertToUnaccentedLetters = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const highlightTextSearchAirport = (text: string, highlight: string) => {
  const sanitizedHighlight = highlight.trim()
    ? convertToUnaccentedLetters(highlight.toLowerCase())
    : "";
  const sanitizedText = convertToUnaccentedLetters(text.toLowerCase());

  const startIndex = sanitizedHighlight
    ? sanitizedText.indexOf(sanitizedHighlight)
    : -1;

  if (startIndex === -1) {
    const airportCodeMatch = text.match(/\(([^)]+)\)$/);
    const mainText = airportCodeMatch
      ? text.replace(airportCodeMatch[0], "")
      : text;
    const airportCode = airportCodeMatch ? airportCodeMatch[0] : "";

    return (
      <>
        {mainText}
        {airportCode && <span style={{ opacity: "60%" }}>{airportCode}</span>}
      </>
    );
  }

  const endIndex = startIndex + sanitizedHighlight.length;
  const before = text.slice(0, startIndex);
  const match = text.slice(startIndex, endIndex);
  const after = text.slice(endIndex);

  const airportCodeMatch = after.match(/\(([^)]+)\)$/);
  const afterText = airportCodeMatch
    ? after.replace(airportCodeMatch[0], "")
    : after;
  const airportCode = airportCodeMatch ? airportCodeMatch[0] : "";

  return (
    <>
      {before}
      <span
        style={{ color: "#3b82f6" }}
        className="text-blue-500 font-semibold"
      >
        {match}
      </span>
      {afterText}
      {airportCode && <span style={{ opacity: "60%" }}>{airportCode}</span>}
    </>
  );
};

const NoOptionsMessage = (props: any) => (
  <components.NoOptionsMessage {...props}>
    <span className="text-gay-600 text-18">Không tìm thấy kết quả phù hợp</span>
  </components.NoOptionsMessage>
);
export {
  highlightTextSearchAirport,
  NoOptionsMessage,
  convertToUnaccentedLetters,
};
