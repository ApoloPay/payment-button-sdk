// 1. Exporta el componente Svelte (el wrapper)
export { default as PaymentButton } from './PaymentButton.svelte';
// 2. Re-exporta todos los tipos desde @ui (que ya incluye los de @core)
export * from '@payment-button-sdk/ui';
