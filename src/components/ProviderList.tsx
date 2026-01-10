import Link from 'next/link';
import { getProviderDisplayName } from '@/lib/providerDisplayName';

interface Provider {
  name: string;
  count: number;
  icon?: string;
}

interface ProviderListProps {
  providers: Provider[];
}

export function ProviderList({ providers }: ProviderListProps) {
  return (
    <div className="provider-list-section">
      <h2 className="provider-list-heading">
        Browse by Provider
      </h2>
      {/* <p className="provider-list-description">
        View all errors from a specific provider
      </p> */}
      <div className="provider-list-tags">
        {providers.map((provider) => (
          <Link
            key={provider.name}
            href={`/provider/${provider.name.toLowerCase()}`}
            className="provider-tag"
          >
            {provider.icon && (
              <img
                src={provider.icon}
                alt={getProviderDisplayName(provider.name)}
                className="provider-tag-icon"
              />
            )}
            {getProviderDisplayName(provider.name)}
          </Link>
        ))}
      </div>
    </div>
  );
}

