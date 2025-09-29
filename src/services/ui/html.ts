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
  <div dir="rtl" class="mc-chat-inner">
  <div class="mc-chat-body mc-hidden">
    <div class="mc-chat-container">
      <!-- Chat Header -->
      <div class="mc-chat-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h3 class="mc-chat-title">پشتیبانی چت</h3>
          <div class="mc-connection-status mc-disconnected"></div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="mc-new-conversation-btn mc-hidden">
            +
          </button>
        </div>
      </div>

      <div class="mc-chat-messages-con">
      </div> 
      <div class="mc-starters-con">
        <div class="mc-starter-welcome">
          <img class="mc-starter-logo" src="" alt="لوگو چت بات" style="display: none;">
          <h2 class="mc-starter-title">پشتیبانی چت</h2>
        </div>
        <div class="mc-starter-items">
        </div>
      </div>

      <div class="mc-chat-input-area">
        <input type="text" placeholder="پیام خود را تایپ کنید..." class="mc-chat-input">
        <button class="mc-send-message-btn" data-is-loading="false">
          <svg class="mc-send-icon" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          <span class="mc-btn-loading">
            <svg class="mc-loading-spinner" viewBox="0 0 24 24">
              <circle class="mc-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="mc-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        </button>
      </div>

      <div class="mc-form-overlay mc-hidden">
        <div class="mc-form-content">
          <h3 class="mc-form-title">اطلاعات تماس</h3>
          <p class="mc-form-subtitle">لطفا برای اطلاع رسانی بهتر پیام ها شماره خود را وارد کنید</p>
          <div class="mc-form-input-area">
            <input type="tel" placeholder="شماره تلفن" class="mc-phone-input">
          </div>
          <div class="mc-form-buttons">
            <button class="mc-form-submit-btn">
              ارسال
            </button>
            <button class="mc-form-cancel-btn">
              لغو
            </button>
          </div>
        </div>
      </div>

      <!-- Chat Footer -->
      <div class="mc-chat-footer">
        <span class="mc-footer-text">ساخته شده با </span>
        <a href="" class="mc-footer-link" target="_blank" rel="noopener noreferrer">مودوچت</a>
      </div>
    </div> 
  </div>
  <button class="mc-toggle-chat-btn">
    <img class="mc-chat-toggle-image" src="" alt="شروع گفتگو" />
    <svg class="mc-chat-toggle-close" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
    </svg>
  </button>
  </div>
  `;
  registerListeners(modo.container);
};
export {createChatContainer};
