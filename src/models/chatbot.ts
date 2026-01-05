class Chatbot {
  name: string;
  image: string;
  shortDescription: string;
  starters: string[] = [];
  voiceChat: boolean;
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
    this.voiceChat = data.voice_agent;
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
    const widget = window.getMWidget?.();
    const tooltip = widget?.container?.querySelector(".mw-toggle-tooltip");
    const tooltipText = widget?.container?.querySelector(".mw-toggle-tooltip-text");
    const hasSeen = localStorage.getItem(`modochats:${widget?.publicKey}-has-seen-greeting-message`) === "true";

    if (tooltip && tooltipText && this.greetingMessage && !hasSeen) {
      // Show the tooltip
      tooltip.classList.remove("mc-hidden");

      // Update tooltip text with greeting message
      tooltipText.textContent = this.greetingMessage;

      // Auto-hide after 5 seconds
      // setTimeout(() => {
      //   tooltip.classList.add("mc-hidden");
      // }, 5000);
    }
  }
  hideTooltip() {
    const widget = window.getMWidget?.();
    const tooltip = widget?.container?.querySelector(".mw-toggle-tooltip");
    if (tooltip) {
      tooltip.classList.add("mc-hidden");
    }
  }
}
export {Chatbot};
