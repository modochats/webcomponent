interface ModoChatUserData {
  key?: string; // unique id
}

interface ModoChatOptions {
  position: "left" | "right";
  theme: "dark" | "light";
  primaryColor: string;
  title: string;
  foregroundColor: string;
  userData?: ModoChatUserData;
  autoInit?: boolean;
}
export {ModoChatOptions, ModoChatUserData};
