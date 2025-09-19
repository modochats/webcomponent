import {ModoChat} from "../app.js";

declare global {
  interface Window {
    ModoChat: typeof ModoChat;
    modoChatInstance?: () => ModoChat;
  }
}

// This is needed to make this file a module
export {};
