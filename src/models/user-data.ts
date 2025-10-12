import {ModoChat} from "#src/app.js";
import {ModoChatUserData} from "#src/types/app.js";
import {generateUUID} from "#src/utils/uuid.js";

class UserData {
  private _uniqueId?: string;
  private _phoneNumber?: string;
  private _phoneFormSubmitted: boolean = false;
  private modo: ModoChat;

  constructor(modo: ModoChat, userDataOptions?: ModoChatUserData) {
    this.modo = modo;
    console.log("userDataOptions", userDataOptions);
    this.initializeUniqueId(userDataOptions?.key);
    this.initializePhoneNumber();
    this.initializePhoneFormStatus();
  }

  /**
   * Initialize unique ID from localStorage, provided key, or generate a new one
   */
  private initializeUniqueId(providedKey?: string): void {
    const savedUniqueId = localStorage.getItem(`modo-chat:${this.modo.publicKey}-user-unique-id`);

    if (providedKey) {
      // Use provided key if available
      this._uniqueId = providedKey;
      this.saveUniqueIdToLocalStorage();
    } else if (savedUniqueId) {
      this._uniqueId = savedUniqueId;
    } else {
      // Generate a new UUID if no saved unique ID or provided key exists
      this._uniqueId = generateUUID();
      this.saveUniqueIdToLocalStorage();
    }
  }

  /**
   * Initialize phone number from localStorage
   */
  private initializePhoneNumber(): void {
    const savedPhoneNumber = localStorage.getItem(`modo-chat:${this.modo.publicKey}-user-phone-number`);
    if (savedPhoneNumber) {
      this._phoneNumber = savedPhoneNumber;
    }
  }

  /**
   * Initialize phone form submission status from localStorage
   */
  private initializePhoneFormStatus(): void {
    const savedFormStatus = localStorage.getItem(`modo-chat:${this.modo.publicKey}-phone-form-submitted`);
    this._phoneFormSubmitted = savedFormStatus === "true";
  }

  /**
   * Get the current unique ID
   */
  get uniqueId(): string {
    return this._uniqueId!;
  }

  /**
   * Get the current phone number
   */
  get phoneNumber(): string | undefined {
    return this._phoneNumber;
  }

  /**
   * Check if user has submitted a phone number
   */
  hasPhoneNumber(): boolean {
    return !!this._phoneNumber;
  }

  /**
   * Check if user has submitted the phone number form (whether empty or with phone number)
   */
  hasSubmittedPhoneForm(): boolean {
    return this._phoneFormSubmitted;
  }

  /**
   * Update the phone number and mark form as submitted
   * @param newPhoneNumber - The new phone number to set (optional)
   */
  updatePhoneNumber(newPhoneNumber?: string): void {
    if (newPhoneNumber && newPhoneNumber.trim() !== "") {
      this._phoneNumber = newPhoneNumber.trim();
      this.savePhoneNumberToLocalStorage();
    } else {
      this._phoneNumber = undefined;
      this.clearPhoneNumberFromLocalStorage();
    }

    // Mark form as submitted regardless of whether phone number is provided
    this._phoneFormSubmitted = true;
    this.savePhoneFormStatusToLocalStorage();
  }

  /**
   * Update the unique ID with a new value
   * @param newUniqueId - The new unique ID to set (optional, will generate UUID if not provided)
   */
  updateUniqueId(newUniqueId?: string): void {
    if (newUniqueId && newUniqueId.trim() !== "") {
      this._uniqueId = newUniqueId.trim();
    } else {
      this._uniqueId = generateUUID();
    }
    this.saveUniqueIdToLocalStorage();
  }

  /**
   * Clear the unique ID and generate a new one
   */
  clearAndGenerateNew(): void {
    this._uniqueId = generateUUID();
    this.saveUniqueIdToLocalStorage();
  }

  /**
   * Save the current unique ID to localStorage
   */
  private saveUniqueIdToLocalStorage(): void {
    localStorage.setItem(`modo-chat:${this.modo.publicKey}-user-unique-id`, this._uniqueId!);
  }

  /**
   * Save the current phone number to localStorage
   */
  private savePhoneNumberToLocalStorage(): void {
    if (this._phoneNumber) {
      localStorage.setItem(`modo-chat:${this.modo.publicKey}-user-phone-number`, this._phoneNumber);
    }
  }

  /**
   * Remove the unique ID from localStorage
   */
  clearFromLocalStorage(): void {
    localStorage.removeItem(`modo-chat:${this.modo.publicKey}-user-unique-id`);
  }

  /**
   * Save the phone form submission status to localStorage
   */
  private savePhoneFormStatusToLocalStorage(): void {
    localStorage.setItem(`modo-chat:${this.modo.publicKey}-phone-form-submitted`, "true");
  }

  /**
   * Remove the phone number from localStorage
   */
  private clearPhoneNumberFromLocalStorage(): void {
    localStorage.removeItem(`modo-chat:${this.modo.publicKey}-user-phone-number`);
  }
}
export {UserData};
