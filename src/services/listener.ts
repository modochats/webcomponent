const registerListeners = (element: HTMLElement) => {
  let chatBody = element.querySelector(".chat-body");
  let isBodyOpen = false;

  element.addEventListener(
    "click",
    () => {
      isBodyOpen = !isBodyOpen;

      chatBody?.classList.toggle("hidden");
    },
    {capture: false}
  );
  chatBody?.addEventListener(
    "click",
    e => {
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    {capture: true}
  );
};
export {registerListeners};
