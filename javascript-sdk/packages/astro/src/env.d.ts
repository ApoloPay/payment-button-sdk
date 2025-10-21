declare module '*.astro' {
  import type { AstroComponent } from 'astro';
  const component: AstroComponent;
  export default component;
}