class ModoChatbot {
  name: string;
  image: string;
  shortDescription: string;
  starters: string[] = [];
  voiceAgent: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  uuid: string;
  allowedHosts: string[] = [];
  id: number;

  uiConfig: {
    primaryColor: string;
    foregroundColor: string;
    theme: "dark" | "light";
  };
  constructor(data: Record<string, any>) {
    this.name = data.name;
    this.image = data.image;
    this.shortDescription = data.short_description;
    this.starters = data.starters;
    this.voiceAgent = data.voice_agent;
    this.createdAt = data.setting.created_at;
    this.updatedAt = data.setting.updated_at;
    this.deletedAt = data.setting.deleted_at;
    this.uuid = data.setting.unique_id;
    this.allowedHosts = data.setting.allow_hosts?.split(",") ?? [];
    this.id = data.setting.chatbot;
    this.allowedHosts.push("modochats.com");
    this.uiConfig = {
      primaryColor: data.primary_color,
      foregroundColor: data.foreground_color,
      theme: data.theme
    };
  }
}
export {ModoChatbot};
