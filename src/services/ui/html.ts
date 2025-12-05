import {ModoChat} from "#src/app.js";
import {registerListeners} from "../listeners/adders.js";

const createChatContainer = (modo: ModoChat) => {
  modo.container = document.createElement("div");
  modo.container.textContent = "Start Chat";
  modo.container.classList.add("modo-chat-widget");

  // Add fullscreen class if fullscreen mode is enabled
  if (modo.options.fullScreen) {
    modo.container.classList.add("mc-fullscreen");
  }

  document.body.appendChild(modo.container);
  let conBody = document.createElement("div");
  modo.container.appendChild(conBody);
  modo.container.innerHTML = `
  <div dir="rtl" class="mc-chat-inner">
  <div class="mc-chat-body ${modo.options.fullScreen ? "mc-active" : "mc-hidden"}">
    <div class="mc-chat-container">
      <!-- Chat Header -->
      <div class="mc-chat-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h3 class="mc-chat-title">پشتیبانی چت</h3>
          <div class="mc-conversation-status-icon mc-hidden">
            <!-- Clean AI/Bot icon -->
            <svg class="mc-ai-chat-icon" style="width: 14px; height: 14px;" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --><path fill="currentColor" d="M22 14h-1c0-3.87-3.13-7-7-7h-1V5.73A2 2 0 1 0 10 4c0 .74.4 1.39 1 1.73V7h-1c-3.87 0-7 3.13-7 7H2c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h1v1a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1m-1 3h-2v3H5v-3H3v-1h2v-2c0-2.76 2.24-5 5-5h4c2.76 0 5 2.24 5 5v2h2zM8.5 13.5l2.36 2.36l-1.18 1.18l-1.18-1.18l-1.18 1.18l-1.18-1.18zm7 0l2.36 2.36l-1.18 1.18l-1.18-1.18l-1.18 1.18l-1.18-1.18z"/></svg>
            <!-- Clean Human/Person icon -->
            <svg class="mc-human-chat-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M12 4C13.66 4 15 5.34 15 7C15 8.66 13.66 10 12 10C10.34 10 9 8.66 9 7C9 5.34 10.34 4 12 4ZM12 12C15.31 12 18 13.34 18 15V18H6V15C6 13.34 8.69 12 12 12Z"/>
            </svg>
            <div class="mc-tooltip">
              <span class="mc-tooltip-text-ai">چت بات هوشمند</span>
              <span class="mc-tooltip-text-human">پشتیبان انسانی</span>
            </div>
          </div>
          <div class="mc-connection-status mc-disconnected"></div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="mc-new-conversation-btn mc-hidden">
            +
          </button>
          <button class="mc-voice-call-btn mc-hidden" title="تماس صوتی">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE --><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/></svg>
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
        <button class="mc-file-upload-btn" title="آپلود فایل">
          <input type="file" class="mc-file-input" hidden />
          <svg class="mc-file-upload-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M16.346 11.385V6.769h1v4.616zm-5.538 5.457q-.452-.269-.726-.734q-.274-.466-.274-1.031V6.769h1zM11.96 21q-2.271 0-3.846-1.595t-1.575-3.867v-8.73q0-1.587 1.09-2.697Q8.722 3 10.309 3t2.678 1.11t1.091 2.698V14h-1V6.789q-.006-1.166-.802-1.977T10.308 4q-1.163 0-1.966.821q-.804.821-.804 1.987v8.73q-.005 1.853 1.283 3.157Q10.11 20 11.961 20q.556 0 1.056-.124t.945-.372v1.11q-.468.2-.972.293q-.505.093-1.03.093m4.386-1v-2.616h-2.615v-1h2.615V13.77h1v2.615h2.616v1h-2.616V20z"/></svg>
          <svg class="mc-file-remove-icon mc-hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols Light by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M11.962 21q-2.273 0-3.848-1.594t-1.575-3.867V7.954L2.091 3.508L2.8 2.8l18.4 18.4l-.708.708l-3.805-3.806q-.664 1.298-1.913 2.098t-2.812.8M7.539 8.954v6.584q-.006 1.852 1.282 3.157T11.961 20q1.356 0 2.413-.727t1.574-1.91l-1.98-1.98q-.087.742-.656 1.295q-.568.553-1.35.553q-.881 0-1.518-.627q-.636-.627-.636-1.527v-3.854zm3.269 3.269v2.854q0 .479.328.816q.328.338.806.338q.474 0 .801-.335t.334-.808v-.596zm5.538 1.33V6.77h1v7.804zm-3.269-3.307V6.79q-.006-1.166-.805-1.977T10.308 4q-.708 0-1.281.32q-.573.319-.961.857l-.714-.713q.529-.68 1.285-1.072T10.307 3q1.587 0 2.679 1.11t1.091 2.698v4.458zm-2.27-3.477v1.189l-1-1.02V6.77z"/></svg>
        </button>
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
          <p class="mc-form-subtitle">لطفا برای اطلاع رسانی بهتر پیام ها شماره خود را وارد کنید (اختیاری)</p>
          <div class="mc-form-input-area">
            <input type="tel" placeholder="شماره تلفن (اختیاری)" class="mc-phone-input">
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
        <a href="" class="mc-footer-link" target="_blank" rel="noopener noreferrer" title="">مودوچت</a>
      </div>

      <!-- Voice Agent Overlay -->
      <div class="mc-voice-agent-overlay mc-hidden">
        <div class="mc-voice-agent-content">
          <button class="mc-voice-close-btn">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
          
          <div class="mc-voice-agent-center">
            <img class="mc-voice-agent-logo" src="" alt="چت بات" />
            <h2 class="mc-voice-agent-title">تماس صوتی</h2>
            <p class="mc-voice-agent-status">درحال اتصال...</p>
          </div>

          <div class="mc-voice-agent-controls">
            <button class="mc-voice-disconnect-btn" title="قطع تماس">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path fill="currentColor" d="M231.59 90.13C175.44 34 80.56 34 24.41 90.13c-20 20-21.92 49.49-4.69 71.71A16 16 0 0 0 32.35 168a15.8 15.8 0 0 0 5.75-1.08l49-17.37l.29-.11a16 16 0 0 0 9.75-11.73l5.9-29.52a76.52 76.52 0 0 1 49.68-.11l6.21 29.75a16 16 0 0 0 9.72 11.59l.29.11l49 17.39a16 16 0 0 0 18.38-5.06c17.19-22.24 15.26-51.73-4.73-71.73M223.67 152l-.3-.12l-48.82-17.33l-6.21-29.74A16 16 0 0 0 158 93a92.56 92.56 0 0 0-60.34.13a16 16 0 0 0-10.32 12l-5.9 29.51l-48.81 17.22c-.1 0-.17.13-.27.17c-12.33-15.91-11-36.23 3.36-50.58c25-25 58.65-37.53 92.28-37.53s67.27 12.51 92.28 37.53c14.33 14.35 15.72 34.67 3.39 50.55m.32 48a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div> 
  </div>
  ${
    !modo.options.fullScreen
      ? `
  <button class="mc-toggle-chat-btn">
    <img class="mc-chat-toggle-image" src="" alt="شروع گفتگو" />
    <svg class="mc-chat-toggle-close" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
    </svg>
    <!-- Badge for unread messages -->
    <div class="mc-badge mc-hidden">
      <span class="mc-badge-text">0</span>
    </div>
    <!-- Tooltip for toggle button -->
    <div class="mc-toggle-tooltip mc-hidden">
      <span class="mc-toggle-tooltip-text">شروع گفتگو</span>
    </div>
  </button>
  `
      : ""
  }
  </div>
  `;
  registerListeners(modo.container);
};
export {createChatContainer};
