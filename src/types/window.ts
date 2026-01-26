import {Widget} from "../app.js";

declare global {
  interface Window {
    ModoChat: typeof Widget;
    ModoWidget: typeof Widget;
    getMWidget?: () => Widget;
  }
}

// This is needed to make this file a module
export {};
