/**
 * Provider display-name mapping (case + spelling).
 *
 * - Key: normalized provider identifier (lowercase)
 * - Value: the exact display string you want shown across the site
 *
 * If a mapping is not present, we fall back to the original input string.
 */
export const PROVIDER_NAME_MAP: Record<string, string> = {
  // Example:
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
};

export function getProviderDisplayName(provider: string | null | undefined): string {
  if (!provider) return '';
  const key = provider.trim().toLowerCase();
  return PROVIDER_NAME_MAP[key] ?? provider;
}


