const onSocketConnectionUpdate = (connected: boolean) => {
  const widget = window.getMWidget?.();
  const connectionIndicator = widget?.container?.querySelector(".mw-connection-status");

  if (connectionIndicator) {
    connectionIndicator.className = `mw-connection-status ${connected ? "mw-connected" : "mw-disconnected"}`;
  }
};
export {onSocketConnectionUpdate};
