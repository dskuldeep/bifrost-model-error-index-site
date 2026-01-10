import Link from 'next/link';
import { getAllErrors, getAllProviders } from '@/lib/mdx';
import { ArrowRight } from 'lucide-react';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { ErrorList } from '@/components/ErrorList';
import { ProviderList } from '@/components/ProviderList';

export default function Home() {
  const errors = getAllErrors();
  const providers = getAllProviders();

  return (
    <div className="container">
      <header>
        <div className="header-label">[ BIFROST ERROR INDEX ]</div>
        <h1>Bifrost Model Error Index</h1>
        <p>Insights, integration guides, and updates from the Bifrost team.</p>
      </header>

      <ProviderList providers={providers} />

      <ErrorList errors={errors} providers={providers} />
    </div>
  );
}
