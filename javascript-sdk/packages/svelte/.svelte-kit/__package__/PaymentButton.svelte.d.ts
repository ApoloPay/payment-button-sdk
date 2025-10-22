import { SvelteComponentTyped } from "svelte";
import '@payment-button-sdk/ui';
declare const __propDef: {
    props: {
        apiKey: string;
        amount: number;
    };
    events: {
        success: Event | UIEvent | AnimationEvent | PointerEvent | MouseEvent | InputEvent | ToggleEvent | FocusEvent | CompositionEvent | ClipboardEvent | DragEvent | ErrorEvent | FormDataEvent | KeyboardEvent | ProgressEvent<EventTarget> | SecurityPolicyViolationEvent | SubmitEvent | TouchEvent | TransitionEvent | WheelEvent;
        error: ErrorEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type PaymentButtonProps = typeof __propDef.props;
export type PaymentButtonEvents = typeof __propDef.events;
export type PaymentButtonSlots = typeof __propDef.slots;
export default class PaymentButton extends SvelteComponentTyped<PaymentButtonProps, PaymentButtonEvents, PaymentButtonSlots> {
}
export {};
