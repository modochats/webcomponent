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
  greetingMessage?: string;
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
    this.greetingMessage = data.greeting_message;
  }
  showTooltip() {
    const modoInstance = window.modoChatInstance?.();
    const tooltip = modoInstance?.container?.querySelector(".mc-toggle-tooltip");
    const tooltipText = modoInstance?.container?.querySelector(".mc-toggle-tooltip-text");
    console.log(tooltip, tooltipText, modoInstance);
    if (tooltip && tooltipText && this.greetingMessage) {
      // Show the tooltip
      tooltip.classList.remove("mc-hidden");

      // Update tooltip text with greeting message
      tooltipText.textContent = this.greetingMessage;

      // Auto-hide after 5 seconds
      setTimeout(() => {
        tooltip.classList.add("mc-hidden");
      }, 5000);
    }
  }
  hideTooltip() {
    const modoInstance = window.modoChatInstance?.();
    const tooltip = modoInstance?.container?.querySelector(".mc-toggle-tooltip");
    if (tooltip) {
      tooltip.classList.add("mc-hidden");
    }
  }
}
export {ModoChatbot};
