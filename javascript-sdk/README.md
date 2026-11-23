# Nexora SmartPay JavaScript SDK

Monorepo for the Nexora SmartPay JavaScript SDK and its framework integrations.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@nexora-smartpay/core`](./packages/core) | `2.0.0` | Core logic and TypeScript types. |
| [`@nexora-smartpay/ui`](./packages/ui) | `2.0.0` | Web Component (Lit) for the payment button. |
| [`@nexora-smartpay/react`](./packages/react) | `2.0.0` | React wrapper for the SDK. |
| [`@nexora-smartpay/vue`](./packages/vue) | `2.0.0` | Vue 3 wrapper for the SDK. |
| [`@nexora-smartpay/angular`](./packages/angular) | `2.0.0` | Angular wrapper for the SDK. |
| [`@nexora-smartpay/svelte`](./packages/svelte) | `2.0.0` | Svelte wrapper for the SDK. |
| [`@nexora-smartpay/astro`](./packages/astro) | `2.0.0` | Astro integration for the SDK. |

## Apps

- `playground-vue`: A demo application built with Vue 3 to test the `@nexora-smartpay/vue` package.
- `playground-react`: A demo application built with React to test the `@nexora-smartpay/react` package.

## Development

This monorepo uses [Turborepo](https://turbo.build/) and [pnpm](https://pnpm.io/) for workspace management.

### Build all packages

```bash
pnpm build
```

### Run development mode

```bash
pnpm dev
```

### Versioning and Publication

We use [Changesets](https://github.com/changesets/changesets) for versioning and publication to npm.

To create a new changeset:

```bash
npx changeset
```

To release:

```bash
npx changeset version
npx changeset publish
```

## Migrating from `@apolopay-sdk/*`

Version 2.0.0 republishes every package under the `@nexora-smartpay` scope (`@apolopay-sdk/core` → `@nexora-smartpay/core`, and so on for `ui`, `react`, `vue`, `angular`, `svelte`, `astro`). Swap the dependency and import paths; the old public names keep working as deprecated aliases:

- `ApoloPayClient` / `ApoloPayClientOptions` → `SmartPayClient` / `SmartPayClientOptions`
- `<apolopay-button>` → `<smartpay-button>` (the old tag is still registered and logs a one-time deprecation warning)
- `ApoloPayButton` (React, Vue, Svelte, Astro) → `SmartPayButton`; `ApoloPayButtonComponent` / `ApoloPayButtonModule` (Angular) → `SmartPayButtonComponent` / `SmartPayButtonModule`
- UMD global `window.ApoloPaySDK` → `window.NexoraSmartPay` (both point to the same object)

The aliases will be removed in a future major version.

## License

MIT

