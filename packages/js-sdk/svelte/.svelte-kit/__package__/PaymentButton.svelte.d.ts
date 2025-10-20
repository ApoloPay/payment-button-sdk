import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        apiKey: string;
        amount: number;
        currency: string;
    };
    events: {
        success: CustomEvent<any>;
        error: CustomEvent<any>;
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
