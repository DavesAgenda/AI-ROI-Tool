import QRCode from "qrcode";

export async function makeQrDataUri(url = "", size = 256) {
  if (!url) return null;
  try {
    return await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      type: "image/png",
      width: size,
      margin: 1,
    });
  } catch (err) {
    console.warn("QR generation failed", err);
    return null;
  }
}
