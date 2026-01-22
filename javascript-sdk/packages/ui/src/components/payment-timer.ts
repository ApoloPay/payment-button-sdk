import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('payment-timer')
export class PaymentTimer extends LitElement {
  @property({ type: Number }) expiresAt: number = 0;

  @state() private timerString: string = '-- : --';
  private _interval: number | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.startTimer();
  }

  override disconnectedCallback() {
    this.stopTimer();
    super.disconnectedCallback();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('expiresAt')) {
      this.startTimer();
    }
  }

  private startTimer() {
    this.stopTimer();

    if (!this.expiresAt || isNaN(this.expiresAt)) return;

    const tick = () => {
      const now = Date.now();
      const distance = this.expiresAt - now;

      if (distance <= 0) {
        this.stopTimer();
        this.timerString = "00 min : 00 seg";
        this.dispatchEvent(new CustomEvent('expired'));
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');

      this.timerString = `${m} min : ${s} seg`;
    };

    tick();
    this._interval = window.setInterval(tick, 1000);
  }

  private stopTimer() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  static override styles = css`
    :host {
      display: block;
      color: var(--apolo-accent, #ea580c);
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
  `;

  render() {
    return html`${this.timerString}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'payment-timer': PaymentTimer;
  }
}
