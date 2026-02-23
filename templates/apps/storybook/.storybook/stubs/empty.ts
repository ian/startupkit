const noop = () => {}

export default {}

export const init = noop
export const captureException = noop
export const captureMessage = noop
export const withScope = (fn: (() => void) | undefined) => fn?.()
export const startSpan = (_: unknown, fn?: (() => unknown) | undefined) => (typeof fn === 'function' ? fn() : { end: noop })
export const setContext = noop
export const setUser = noop
export const setTag = noop
export const setTags = noop
export const addBreadcrumb = noop
export const configureScope = noop
export const getCurrentHub = () => ({ getClient: () => undefined })
export const getClient = () => undefined
export const vercelAIIntegration = noop

export class PostHog {
	constructor(..._args: unknown[]) {}
	capture = noop
	identify = noop
	alias = noop
	shutdown = noop
}

export const sentryIntegration = noop
