const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "";

export const getCdnUrl = (path: string): string => {
  const fullUrl = path.startsWith("/")
    ? `${cdnUrl}${path}`
    : `${cdnUrl}/${path}`;
  return fullUrl;
};
