// 1. Exporta el componente Svelte (el wrapper)
export { default as ApoloPayButton } from './ApoloPayButton.svelte';

// 2. Re-exporta todos los tipos desde @ui (que ya incluye los de @core)
export * from '@apolopay-sdk/ui';