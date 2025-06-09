class CurrentDate extends HTMLElement {
  connectedCallback() {
    const now = new Date();

    this.textContent = now.toLocaleDateString();
  }
}

customElements.define("current-date", CurrentDate);
