import {ModochatWidget} from "../app.js";

declare global {
  interface Window {
    ModoChat: typeof ModochatWidget;
    ModochatWidget: typeof ModochatWidget;
    getMWidget?: () => ModochatWidget;
  }
}

// This is needed to make this file a module
export {};
