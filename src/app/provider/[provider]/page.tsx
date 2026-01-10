import { getErrorsByProvider, getAllProviders } from '@/lib/mdx';
import { ErrorList } from '@/components/ErrorList';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { notFound } from 'next/navigation';
import { getProviderDisplayName } from '@/lib/providerDisplayName';

export async function generateStaticParams() {
  const providers = getAllProviders();
  return providers.map((provider) => ({
    provider: provider.name.toLowerCase(),
  }));
}

export default async function ProviderPage({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const errors = getErrorsByProvider(provider);
  const allProviders = getAllProviders();
  const providerInfo = allProviders.find(p => p.name.toLowerCase() === provider.toLowerCase());

  if (!providerInfo || errors.length === 0) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: getProviderDisplayName(providerInfo.name), href: `/provider/${provider}` },
  ];

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbs} />
      
      <header className="provider-page-header">
        <div className="provider-header-content">
          {providerInfo.icon && (
            <img
              src={providerInfo.icon}
              alt={getProviderDisplayName(providerInfo.name)}
              className="provider-header-icon"
            />
          )}
          <h1 className="provider-page-title">
            {getProviderDisplayName(providerInfo.name)} Errors
          </h1>
        </div>
      </header>

      <ErrorList errors={errors} providers={allProviders} initialProvider={provider} />
    </div>
  );
}

