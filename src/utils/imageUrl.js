export function getImageUrl(value) {
  if (!value) return value

  const fileId = value.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)?.[1]
    || value.match(/drive\.google\.com\/(?:open|uc|thumbnail)[^?#]*[?&]id=([^&#]+)/)?.[1]

  return fileId
    ? `https://lh3.googleusercontent.com/d/${fileId}=w2000`
    : value
}
