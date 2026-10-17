export function refuseAppWorker(production: boolean, hostname: string, framed: boolean, search: string) {
  return !production || framed || new URLSearchParams(search).get("sw") === "off" ||
    hostname.startsWith("id-preview--") || hostname.startsWith("preview--") ||
    ["lovableproject.com", "lovableproject-dev.com", "beta.lovable.dev"].some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
}