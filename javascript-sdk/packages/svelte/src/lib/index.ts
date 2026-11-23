// 1. Exporta el componente Svelte (el wrapper)
export { default as SmartPayButton } from './SmartPayButton.svelte';
/** @deprecated Use `SmartPayButton` instead. Pre-2.0 name, kept for backwards compatibility. */
export { default as ApoloPayButton } from './SmartPayButton.svelte';

// 2. Re-exporta todos los tipos desde @ui (que ya incluye los de @core)
export * from '@nexora-smartpay/ui';
