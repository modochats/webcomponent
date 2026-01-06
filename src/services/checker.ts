import {Widget} from "#src/app.js";
import {parse} from "tldts";

const checkIfHostIsAllowed = (widget: Widget) => {
  const currentHost = parse(window.location.origin).hostname;
  const allowedHosts = widget.chatbot?.allowedHosts || [];
  if (currentHost) return allowedHosts.includes(currentHost);
};

export {checkIfHostIsAllowed};
