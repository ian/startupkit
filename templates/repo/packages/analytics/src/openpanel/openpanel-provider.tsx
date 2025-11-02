/**
 * OpenPanel React Provider
 *
 * A React context provider for OpenPanel analytics that provides a clean,
 * idiomatic way to use OpenPanel in React/Next.js applications.
 *
 * This is temporary until OpenPanel publishes an official React/Next.js package.
 *
 * @see https://openpanel.dev
 */

'use client';

import { OpenPanel } from '@openpanel/web';
import { type ReactNode, createContext, useContext, useRef } from 'react';

/**
 * Configuration options for the OpenPanel provider
 */
interface OpenPanelProviderProps {
  /** React children to render */
  children: ReactNode;
  /** OpenPanel client ID. Falls back to environment variables if not provided */
  clientId?: string;
  /** Whether to automatically track screen views */
  trackScreenViews?: boolean;
  /** Whether to track clicks on outgoing links */
  trackOutgoingLinks?: boolean;
  /** Whether to track element attributes in events */
  trackAttributes?: boolean;
}

const OpenPanelContext = createContext<OpenPanel | null>(null);

/**
 * Hook to access the OpenPanel client instance
 *
 * @throws {Error} If used outside of OpenPanelProvider
 * @returns OpenPanel client instance or null if not initialized
 *
 * @example
 * ```tsx
 * const openpanel = useOpenPanel();
 * openpanel?.track('button_clicked', { label: 'Subscribe' });
 * ```
 */
export function useOpenPanel() {
  const context = useContext(OpenPanelContext);
  if (context === undefined) {
    throw new Error('useOpenPanel must be used within OpenPanelProvider');
  }
  return context;
}

/**
 * Provider component that initializes and provides OpenPanel to child components
 *
 * Automatically reads from environment variables:
 * - NEXT_PUBLIC_OPENPANEL_CLIENT_ID
 * - OPENPANEL_CLIENT_ID
 *
 * @param children - React children to render
 * @param clientId - OpenPanel client ID. Falls back to environment variables if not provided
 * @param trackScreenViews - Whether to automatically track screen views (default: false)
 * @param trackOutgoingLinks - Whether to track clicks on outgoing links (default: true)
 * @param trackAttributes - Whether to track element attributes in events (default: true)
 *
 * @example
 * ```tsx
 * <OpenPanelProvider clientId="your-client-id">
 *   <App />
 * </OpenPanelProvider>
 * ```
 */
export function OpenPanelProvider({
  children,
  clientId,
  trackScreenViews = false,
  trackOutgoingLinks = true,
  trackAttributes = true,
}: OpenPanelProviderProps) {
  const openpanelRef = useRef<OpenPanel | null>(null);

  if (!openpanelRef.current && typeof window !== 'undefined') {
    const id =
      clientId ||
      process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID ||
      process.env.OPENPANEL_CLIENT_ID ||
      '';

    if (id) {
      openpanelRef.current = new OpenPanel({
        clientId: id,
        trackScreenViews,
        trackOutgoingLinks,
        trackAttributes,
      });
    }
  }

  return (
    <OpenPanelContext.Provider value={openpanelRef.current}>
      {children}
    </OpenPanelContext.Provider>
  );
}

