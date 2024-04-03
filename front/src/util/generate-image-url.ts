export const generateImageUrl = (url: string) => {
  const imageId = url.split("/")[5];

  return "https://drive.google.com/thumbnail?id=" + imageId;
};
