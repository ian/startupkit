/**
 * Utility functions for analytics
 */

/**
 * Removes empty/undefined/null values from an object
 * Useful for cleaning analytics properties before sending
 */
export function pruneEmpty<T extends Record<string, unknown>>(
    obj?: T
): Partial<T> {
    if (!obj) return {} as Partial<T>;

    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            acc[key as keyof T] = value as T[keyof T];
        }
        return acc;
    }, {} as Partial<T>);
}

/**
 * Safely stringify values in an object for analytics
 * Converts dates, booleans, etc. to strings
 */
export function stringifyValues<T extends Record<string, unknown>>(
    obj?: T
): Record<string, string> {
    if (!obj) return {};

    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value instanceof Date) {
            acc[key] = value.toISOString();
        } else if (typeof value === "boolean" || typeof value === "number") {
            acc[key] = String(value);
        } else if (typeof value === "string") {
            acc[key] = value;
        } else if (value !== null && value !== undefined) {
            acc[key] = JSON.stringify(value);
        }
        return acc;
    }, {} as Record<string, string>);
}

/**
 * Debounce function for analytics events
 */
export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

