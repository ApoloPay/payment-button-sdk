# Apolo Pay JavaScript SDK

Monorepo for the Apolo Pay JavaScript SDK and its framework integrations.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@apolopay-sdk/core`](./packages/core) | `0.1.0` | Core logic and TypeScript types. |
| [`@apolopay-sdk/ui`](./packages/ui) | `0.1.0` | Web Component (Lit) for the payment button. |
| [`@apolopay-sdk/react`](./packages/react) | `0.1.0` | React wrapper for the SDK. |
| [`@apolopay-sdk/vue`](./packages/vue) | `0.1.0` | Vue 3 wrapper for the SDK. |
| [`@apolopay-sdk/angular`](./packages/angular) | `0.1.0` | Angular wrapper for the SDK. |
| [`@apolopay-sdk/svelte`](./packages/svelte) | `0.1.0` | Svelte wrapper for the SDK. |
| [`@apolopay-sdk/astro`](./packages/astro) | `0.1.0` | Astro integration for the SDK. |

## Apps

- `playground-vue`: A demo application built with Vue 3 to test the `@apolopay-sdk/vue` package.
- `playground-react`: A demo application built with React to test the `@apolopay-sdk/react` package.

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

## License

MIT

