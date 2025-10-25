import { randomBytes } from "crypto";

export const generateRandomLink = (): string => {
  const randomString = randomBytes(12).toString("base64url"); // 12 bytes ≈ 16 characters URL-safe
  return `https://app.positiivplus.com/${randomString}`;
};
