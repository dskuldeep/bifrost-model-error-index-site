import { getErrorBySlug, getErrorSlugs, getAllProviders } from '@/lib/mdx';
import { MDXContent } from '@/components/MDXContent';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { TableOfContents } from '@/components/TableOfContents';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getProviderDisplayName } from '@/lib/providerDisplayName';

export async function generateStaticParams() {
  const slugs = getErrorSlugs();
  const allErrors = slugs.map(slug => {
    const realSlug = slug.replace(/\.mdx$/, '');
    try {
      const { frontmatter } = getErrorBySlug(realSlug);
      return {
        provider: frontmatter.provider?.toLowerCase() || '',
        slug: realSlug,
      };
    } catch {
      return null;
    }
  }).filter(Boolean) as Array<{ provider: string; slug: string }>;

  return allErrors;
}

export default async function IssuePage({ 
  params 
}: { 
  params: Promise<{ provider: string; slug: string }> 
}) {
  const { provider, slug } = await params;
  
  try {
    const { frontmatter, content } = getErrorBySlug(slug);
    
    // Verify the provider matches
    if (frontmatter.provider?.toLowerCase() !== provider.toLowerCase()) {
      notFound();
    }

    // Truncate long titles in breadcrumbs for better UX
    const truncatedTitle = frontmatter.title.length > 50 
      ? frontmatter.title.substring(0, 50) + '...' 
      : frontmatter.title;

    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: getProviderDisplayName(frontmatter.provider), href: `/provider/${provider}` },
      { label: truncatedTitle, href: `/provider/${provider}/issue/${slug}` },
    ];

    return (
      <div className="container">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="blog-post-layout">
          <div className="blog-post-content">
            {/* <Link href={`/provider/${provider}`} className="back-to-provider">
              <ArrowLeft size={16} />
              <span>Back to {getProviderDisplayName(frontmatter.provider)}</span>
            </Link> */}
            
            <header className="blog-post-header">
              <div className="provider-badge">
                {frontmatter.provider_icon && (
                  <img src={frontmatter.provider_icon} alt={getProviderDisplayName(frontmatter.provider)} className="provider-icon-large" />
                )}
                <span className="provider-name">{getProviderDisplayName(frontmatter.provider)}</span>
              </div>
              <h1 className="blog-post-title">{frontmatter.title}</h1>
            </header>

            <article className="blog-post-article">
              <MDXContent source={content} />
            </article>
          </div>
          
          <aside className="blog-post-sidebar">
            <TableOfContents />
          </aside>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}

