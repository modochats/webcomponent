class ModoPublicData {
  name: string;
  image: string;
  shortDescription: string;
  starters: string[] = [];
  setting: {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    uniqueId: string;
    allowedHosts: string[];
    chatbot: number;
  };
  constructor(data: Record<string, any>) {
    this.name = data.name;
    this.image = data.image;
    this.shortDescription = data.short_description;
    this.starters = data.starters;
    this.setting = {
      id: data.setting.id,
      createdAt: data.setting.created_at,
      updatedAt: data.setting.updated_at,
      deletedAt: data.setting.deleted_at,
      uniqueId: data.setting.unique_id,
      allowedHosts: data.setting.allow_hosts?.split(","),
      chatbot: data.setting.chatbot
    };
  }
}
export {ModoPublicData};
