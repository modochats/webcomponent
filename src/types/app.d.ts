interface ModoChatUserData {
  key?: string; // unique id
}

interface ModoChatOptions {
  position: "left" | "right";
  theme: "dark" | "light";
  primaryColor: string;
  title: string;
  userData?: ModoChatUserData;
}
export {ModoChatOptions, ModoChatUserData};
