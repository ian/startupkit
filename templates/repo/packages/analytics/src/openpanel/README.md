# OpenPanel React Provider

A React context provider for [OpenPanel](https://openpanel.dev) analytics built on `@openpanel/sdk`.

This follows the same architecture as the official React Native SDK and is designed to be contributed back to the OpenPanel project.

## Installation

```bash
npm install @openpanel/sdk
```

## Usage

### Basic Setup

Wrap your app with the `OpenPanelProvider`:

```tsx
import { OpenPanelProvider } from './openpanel-provider';

export default function App({ children }) {
  return (
    <OpenPanelProvider clientId="your-client-id">
      {children}
    </OpenPanelProvider>
  );
}
```

### Using Environment Variables

The provider automatically reads from environment variables if no `clientId` is provided:

```tsx
<OpenPanelProvider>
  {children}
</OpenPanelProvider>
```

It will check for:
- `NEXT_PUBLIC_OPENPANEL_CLIENT_ID` (Next.js)
- `OPENPANEL_CLIENT_ID`

### Configuration Options

The provider accepts all options from `OpenPanelOptions`:

```tsx
<OpenPanelProvider
  clientId="your-client-id"
  trackScreenViews={false}
  trackOutgoingLinks={true}
  trackAttributes={true}
  apiUrl="https://api.openpanel.dev"
  // ... any other OpenPanelOptions
>
  {children}
</OpenPanelProvider>
```

### Using the Hook

Access the OpenPanel client in any component:

```tsx
import { useOpenPanel } from './openpanel-provider';

function MyComponent() {
  const openpanel = useOpenPanel();

  const handleClick = () => {
    openpanel?.track('button_clicked', {
      button_name: 'subscribe'
    });
  };

  return <button onClick={handleClick}>Subscribe</button>;
}
```

### API Methods

The hook returns the OpenPanel client with these methods:

```tsx
// Identify a user
openpanel?.identify({
  profileId: 'user-123',
  email: 'user@example.com',
  name: 'John Doe'
});

// Track an event
openpanel?.track('purchase', {
  product_id: 'prod-123',
  amount: 99.99
});

// Clear/reset the user
openpanel?.clear();
```

## Server-Side Rendering

The provider is client-side only (`'use client'`) and safely handles SSR environments. The OpenPanel client is only initialized in the browser.

## License

MIT

