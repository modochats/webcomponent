import {ModoChat} from "#src/app.js";
import {registerListeners} from "../listeners/adders.js";
import {loadTailwindCss} from "./style.js";

const createChatContainer = (modo: ModoChat) => {
  modo.container = document.createElement("div");
  modo.container.textContent = "Start Chat";
  modo.container.classList.add("fixed", "right-8", "bottom-8");
  document.body.appendChild(modo.container);
  let conBody = document.createElement("div");
  modo.container.appendChild(conBody);
  modo.container.innerHTML = `
  <div class="chat-inner relative">
  <div class="chat-body hidden absolute bottom-[60px] right-8" >
    <div class="relative rounded-xl bg-white border w-[250px] h-[400px]">
      <!-- Chat Header -->
      <div class="chat-header bg-blue-500 text-white p-4 rounded-t-xl flex justify-between items-center">
        <h3 class="font-medium">Chat Support</h3>
        <button class="new-conversation-btn hidden text-white hover:text-gray-200 text-xl font-bold w-6 h-6 flex items-center justify-center">
          new
        </button>
      </div>

      <div class="flex flex-col h-[calc(100%-175px)] chat-messages-con p-4 overflow-y-auto">
      </div> 
      <div class="flex flex-col h-[calc(100%-175px)]  p-4 absolute top-12 left-0 w-full starters-con ">
      </div>

      <div class="w-[90%] mx-[5%] absolute bottom-4">
        <input type="text" placeholder="Type your message..." class="chat-input p-3 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border">
        <button class="send-message-btn mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200">
          Send
        </button>
      </div>

      <div class="form-overlay hidden absolute inset-0 bg-white rounded-xl z-10">
        <div class="p-4 h-full flex flex-col">
          <h3 class="text-lg font-medium mb-4">Contact Information</h3>
          <div class="flex-1">
            <input type="tel" placeholder="Phone Number" class="phone-input w-full p-3 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border">
          </div>
          <div class="flex gap-2 mt-4">
            <button class="form-submit-btn flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200">
              Submit
            </button>
            <button class="form-cancel-btn flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-200">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div> 
  </div>
  <button class="toggle-chat-btn">
    Start Chat
  </button>
  </div>
  `;
  loadTailwindCss();
  registerListeners(modo.container);
};
export {createChatContainer};
