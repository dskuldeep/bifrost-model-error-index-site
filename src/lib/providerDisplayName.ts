/**
 * Provider display-name mapping (case + spelling).
 *
 * - Key: normalized provider identifier (lowercase)
 * - Value: the exact display string you want shown across the site
 *
 * If a mapping is not present, we fall back to the original input string.
 */
export const PROVIDER_NAME_MAP: Record<string, string> = {
  // AI Model Providers
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  cohere: "Cohere",
  mistral: "Mistral AI",
  "mistral-ai": "Mistral AI",
  palm: "PaLM",
  
  // Cloud & Infrastructure
  azure: "Azure",
  "azure-openai": "Azure",
  aws: "AWS",
  bedrock: "AWS Bedrock",
  vertex: "Vertex AI",
  
  // Platform Providers
  anyscale: "Anyscale",
  together: "Together AI",
  "together-ai": "Together AI",
  fireworks: "Fireworks AI",
  groq: "Groq",
  cerebras: "Cerebras",
  
  // Open Source & Self-Hosted
  ollama: "Ollama",
  huggingface: "Hugging Face",
  litellm: "LiteLLM",
  
  // Specialized Services
  elevenlabs: "ElevenLabs",
  perplexity: "Perplexity",
  openrouter: "OpenRouter",
  twilio: "Twilio",
  vapi: "Vapi",
  xai: "xAI",
};

export function getProviderDisplayName(provider: string | null | undefined): string {
  if (!provider) return '';
  const key = provider.trim().toLowerCase();
  return PROVIDER_NAME_MAP[key] ?? provider;
}

/**
 * Get the logo path for a provider.
 * Maps provider identifiers to their corresponding SVG logo files.
 * Returns a fallback icon if no specific logo exists.
 */
export function getProviderLogoPath(provider: string | null | undefined): string {
  if (!provider) return '/file.svg';
  
  const key = provider.trim().toLowerCase();
  
  // Map provider identifiers to logo filenames
  const logoMap: Record<string, string> = {
    'openai': 'openai',
    'anthropic': 'anthropic',
    'google': 'google',
    'cohere': 'cohere',
    'mistral': 'mistral',
    'mistral-ai': 'mistral',
    'palm': 'google', // PaLM is a Google product
    
    'azure': 'azure',
    'azure-openai': 'azure',
    'aws': 'aws',
    'bedrock': 'bedrock',
    'vertex': 'vertex',
    
    'anyscale': 'openai', // Uses OpenAI models
    'together': 'together',
    'together-ai': 'together',
    'fireworks': 'fireworks',
    'groq': 'groq',
    'cerebras': 'cerebras',
    
    'ollama': 'ollama',
    'huggingface': 'huggingface',
    'litellm': 'litellm',
    
    'elevenlabs': 'elevenlabs',
    'perplexity': 'perplexity',
    'openrouter': 'openrouter',
    'twilio': 'twilio',
    'vapi': 'vapi',
    'xai': 'xai',
  };
  
  const logoFile = logoMap[key];
  return logoFile ? `/logos/${logoFile}.svg` : '/file.svg';
}


