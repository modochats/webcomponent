const COLOR = {
  PRIMARY: "#e786ff"
};

// Check environment and set appropriate base URLs
// For browser environment, we'll use a different approach since process.env is not available
const getEnvironment = () => {
  // Check for browser global variable
  if (typeof window !== "undefined" && (window as any).ENVIRONMENT) {
    return (window as any).ENVIRONMENT;
  }

  return null;
};

const isDev = getEnvironment() === "DEV";
const BASE_API_URL = isDev ? "https://dev-api.modochats.com" : "https://api.modochats.com";

const BASE_WEBSOCKET_URL = isDev ? "wss://dev-api.modochats.com/ws" : "wss://api.modochats.com/ws";
const VERSION = "0.1";
export {COLOR, BASE_API_URL, BASE_WEBSOCKET_URL, VERSION};
