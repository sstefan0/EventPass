import qrCode from "qrcode";

export const generateQRCode = async (text: string) => {
  const qrCodeDataURL = await qrCode.toDataURL(text);
  return qrCodeDataURL;
};
