import crypto from "crypto";
function generateZapierToken(length = 240) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

export default generateZapierToken;