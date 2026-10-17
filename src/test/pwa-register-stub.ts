// Unit tests have no generated service worker or browser registration.
export function registerSW() { return () => Promise.resolve(); }