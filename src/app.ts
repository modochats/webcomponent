import {ModoChatOptions} from "./types/app.js";
import {ModoPublicData} from "./models/modo-public-data.js";
import {fetchModoPublicData} from "./utils/fetch.js";
import {checkIfHostIsAllowed, checkIfUserHasConversation} from "./services/checker.js";
import {createChatContainer} from "./services/ui/html.js";
import {UserData} from "./models/user-data.js";
import {Conversation} from "./models/conversation.js";
import {Socket} from "./services/socket/socket.js";
import {loadStarters, updateChatToggleImage, updateChatTitle, applyModoOptions, loadCss} from "./services/ui/fn.js";
import {VERSION} from "./constants/index.js";

class ModoChat {
  container?: HTMLDivElement;
  publicKey: string;
  publicData?: ModoPublicData;
  userData: UserData;
  conversation?: Conversation;
  socket?: Socket;
  options: ModoChatOptions;
  openedCount: number = 0;
  version: string;
  constructor(publicKey: string, options?: Partial<ModoChatOptions>) {
    this.publicKey = publicKey;
    this.userData = new UserData(this, options?.userData);
    this.version = VERSION;
    this.options = {
      position: options?.position || "right",
      theme: options?.theme || "dark",
      primaryColor: options?.primaryColor || "#667eea",
      title: options?.title || "",
      userData: options?.userData
    };
    this.init();
  }
  async init() {
    try {
      const publicDataRes = await fetchModoPublicData(this.publicKey);
      this.publicData = new ModoPublicData(publicDataRes);
      if (checkIfHostIsAllowed(this)) {
        await loadCss();
        createChatContainer(this);
        window.modoChatInstance = () => this;
        applyModoOptions();
        loadStarters();
        updateChatToggleImage();
        updateChatTitle();
      } else {
        console.error("Domain not allowed");
      }
    } catch (err) {
      console.error("Failed to initialize ModoChat", err);
    }
  }
  async onOpen() {
    this.openedCount++;
    if (this.openedCount === 1) checkIfUserHasConversation(this);
  }

  /**
   * Update the unique ID
   * @param newUniqueId - The new unique ID to set (optional, will generate UUID if not provided)
   */
  updateUniqueId(newUniqueId?: string): void {
    this.userData.updateUniqueId(newUniqueId);
  }

  /**
   * Get the current unique ID
   */
  getUniqueId(): string {
    return this.userData.uniqueId;
  }

  /**
   * Update the phone number
   * @param newPhoneNumber - The new phone number to set (optional)
   */
  updatePhoneNumber(newPhoneNumber?: string): void {
    this.userData.updatePhoneNumber(newPhoneNumber);
  }

  /**
   * Check if user has submitted a phone number
   */
  hasPhoneNumber(): boolean {
    return this.userData.hasPhoneNumber();
  }

  /**
   * Check if user has submitted the phone number form (whether empty or with phone number)
   */
  hasSubmittedPhoneForm(): boolean {
    return this.userData.hasSubmittedPhoneForm();
  }
}

window.ModoChat = ModoChat;

export type {ModoChat};
