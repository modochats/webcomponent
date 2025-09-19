import {ModoChat} from "#src/app.js";

class UserData {
  uniqueId?: string;
  constructor(modo: ModoChat) {
    const savedUniqueId = localStorage.getItem(`modo-chat:${modo.publicKey}-user-unique-id`);
    if (savedUniqueId) {
      this.uniqueId = savedUniqueId;
    }
  }
}
export {UserData};
