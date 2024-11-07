function generateRandomAlphanumeric(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const randomVaue = generateRandomAlphanumeric(10);
// export const BASE_URL = "http://127.0.0.1:8000";
export const BASE_URL = "https://ecomweb-mjmu.onrender.com";
