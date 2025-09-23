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
  <div dir="rtl" class="chat-inner">
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
        <div class="starter-welcome">
          <img class="starter-logo" src="" alt="لوگو چت بات" style="display: none;">
          <h2 class="starter-title">پشتیبانی چت</h2>
        </div>
        <div class="starter-items">
        </div>
      </div>

      <div class="chat-input-area">
        <input type="text" placeholder="پیام خود را تایپ کنید..." class="chat-input">
        <button class="send-message-btn" data-is-loading="false">
          <svg class="send-icon" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
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
          <p class="form-subtitle">لطفا برای اطلاع رسانی بهتر پیام ها شماره خود را وارد کنید</p>
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

      <!-- Chat Footer -->
      <div class="chat-footer">
        <span class="footer-text">ساخته شده با </span>
        <a href="" class="footer-link" target="_blank" rel="noopener noreferrer">مودوچت</a>
      </div>
    </div> 
  </div>
  <button class="toggle-chat-btn">
    <img class="chat-toggle-image" src="" alt="شروع گفتگو" />
    <svg class="chat-toggle-close" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
    </svg>
  </button>
  </div>
  `;
  registerListeners(modo.container);
};
export {createChatContainer};
