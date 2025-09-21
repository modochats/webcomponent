import {ModoChat} from "#src/app.js";
import {registerListeners} from "../listeners/adders.js";

const createChatContainer = (modo: ModoChat) => {
  modo.container = document.createElement("div");
  modo.container.textContent = "Start Chat";
  modo.container.classList.add("modo-chat-widget");
  document.body.appendChild(modo.container);
  let conBody = document.createElement("div");
  modo.container.appendChild(conBody);
  modo.container.innerHTML = `
  <div class="chat-inner">
  <div class="chat-body hidden">
    <div class="chat-container">
      <!-- Chat Header -->
      <div class="chat-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h3 class="chat-title">پشتیبانی چت</h3>
          <div class="connection-status disconnected"></div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="new-conversation-btn hidden">
            +
          </button>
        </div>
      </div>

      <div class="chat-messages-con">
      </div> 
      <div class="starters-con">
      </div>

      <div class="chat-input-area">
        <input type="text" placeholder="پیام خود را تایپ کنید..." class="chat-input">
        <button class="send-message-btn" data-is-loading="false">
        <span class="btn-text">
        ارسال
        </span>
       <span class="btn-loading">
        <svg class="loading-spinner" viewBox="0 0 24 24">
        <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
       </span>
        </button>
      </div>

      <div class="form-overlay hidden">
        <div class="form-content">
          <h3 class="form-title">اطلاعات تماس</h3>
          <div class="form-input-area">
            <input type="tel" placeholder="شماره تلفن" class="phone-input">
          </div>
          <div class="form-buttons">
            <button class="form-submit-btn">
              ارسال
            </button>
            <button class="form-cancel-btn">
              لغو
            </button>
          </div>
        </div>
      </div>
    </div> 
  </div>
  <button class="toggle-chat-btn">
    <img class="chat-toggle-image" src="" alt="شروع گفتگو" />
  </button>
  </div>
  `;
  registerListeners(modo.container);
};
export {createChatContainer};
