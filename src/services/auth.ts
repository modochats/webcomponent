import {ModoChat} from "#src/app.js";
import {parse} from "tldts";

const checkIfHostIsAllowed = (modo: ModoChat) => {
  const currentHost = parse(window.location.origin).hostname;
  const allowedHosts = modo.publicData?.setting.allowedHosts || [];
  if (currentHost) return allowedHosts.includes(currentHost);
};
export {checkIfHostIsAllowed};
