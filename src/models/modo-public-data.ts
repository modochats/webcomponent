class ModoPublicData {
  name: string;
  image: string;
  shortDescription: string;
  starters: string[] = [];
  voiceAgent: boolean;

  setting: {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    uuid: string;
    allowedHosts: string[];
    chatbot: number;
  };
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
    this.setting = {
      createdAt: data.setting.created_at,
      updatedAt: data.setting.updated_at,
      deletedAt: data.setting.deleted_at,
      uuid: data.setting.unique_id,
      allowedHosts: data.setting.allow_hosts?.split(",") ?? [],
      chatbot: data.setting.chatbot
    };
    this.setting.allowedHosts.push("modochats.com");
    this.uiConfig = {
      primaryColor: data.primary_color,
      foregroundColor: data.foreground_color,
      theme: data.theme
    };
  }
}
export {ModoPublicData};
