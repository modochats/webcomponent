const getEnvironment = () => {
  // Check for browser global variable
  if (typeof window !== "undefined" && (window as any).ENVIRONMENT) {
    return (window as any).ENVIRONMENT;
  }

  // Check for NODE_ENV in build process
  if (typeof process !== "undefined" && process.env?.NODE_ENV) {
    return process.env.NODE_ENV.toUpperCase();
  }

  return "PROD"; // Default to production
};
const isDev = getEnvironment() === "DEV";
const isProd = getEnvironment() === "PROD";
const BASE_API_URL = isDev ? "https://dev-api.modochats.com" : "https://api.modochats.com";
const BASE_WEBSOCKET_URL = isDev ? "wss://dev-api.modochats.com/ws" : "wss://api.modochats.com/ws";
const VERSION = "0.1";

export {BASE_API_URL, BASE_WEBSOCKET_URL, VERSION, isDev, isProd, getEnvironment};
