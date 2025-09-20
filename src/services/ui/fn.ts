function switchToConversationLayout() {
  const modoInstance = window.modoChatInstance?.();
  modoInstance?.container?.querySelector(".new-conversation-btn")?.classList.remove("hidden");
  modoInstance?.container?.querySelector(".starters-con")?.classList.add("hidden");
}
function switchToStarterLayout() {
  const modoInstance = window.modoChatInstance?.();
  modoInstance?.container?.querySelector(".new-conversation-btn")?.classList.add("hidden");
}

function loadStarters() {
  const modoInstance = window.modoChatInstance?.();
  modoInstance?.container?.querySelector(".starters-con")?.classList.remove("hidden");
  for (const starter of modoInstance?.publicData?.starters || []) {
    const starterElement = document.createElement("div");
    starterElement.textContent = starter;
    starterElement.addEventListener("click", async () => {
      const {sendMessage} = await import("../listeners/fn.js");
      sendMessage(starter);
    });
    modoInstance?.container?.querySelector(".starters-con")?.appendChild(starterElement);
  }
}
export {switchToConversationLayout, switchToStarterLayout, loadStarters};
