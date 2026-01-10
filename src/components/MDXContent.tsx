import React from 'react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';

// Helper function to extract text content from React children
const getTextContent = (children: React.ReactNode): string => {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (React.isValidElement(children) && children.props.children) {
    return getTextContent(children.props.children);
  }
  return '';
};

// Helper function to generate ID from text
const generateId = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
};

// Custom components for MDX rendering
const components = {
  // Headings - add IDs for table of contents
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getTextContent(props.children);
    const id = generateId(text);
    return <h1 className="mdx-h1" id={id} {...props} />;
  },
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getTextContent(props.children);
    const id = generateId(text);
    return <h2 className="mdx-h2" id={id} {...props} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getTextContent(props.children);
    const id = generateId(text);
    return <h3 className="mdx-h3" id={id} {...props} />;
  },
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getTextContent(props.children);
    const id = generateId(text);
    return <h4 className="mdx-h4" id={id} {...props} />;
  },
  
  // Paragraphs - handle images that might be wrapped in paragraphs
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    // Check if paragraph only contains an image (common MDX behavior)
    // This handles both direct img tags and our custom image wrapper spans
    const childArray = React.Children.toArray(children);
    const firstChild = childArray[0];
    
    const hasOnlyImage = childArray.length === 1 && 
      React.isValidElement(firstChild) && 
      (firstChild.type === 'img' || 
       (firstChild.props && 
        typeof firstChild.props === 'object' &&
        'className' in firstChild.props && 
        (firstChild.props.className === 'mdx-image-wrapper' ||
         (firstChild.type === 'span' && firstChild.props.className === 'mdx-image-wrapper'))));
    
    if (hasOnlyImage) {
      // Return the image directly without paragraph wrapper to avoid hydration error
      return <>{children}</>;
    }
    
    return <p className="mdx-p" {...props}>{children}</p>;
  },
  
  // Lists
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mdx-ul" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mdx-ol" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="mdx-li" {...props} />
  ),
  
  // Links
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http');
    if (isExternal) {
      return (
        <Link 
          href={href || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mdx-link mdx-link-external"
          {...props}
        >
          {children}
        </Link>
      );
    }
    return (
      <Link href={href || '#'} className="mdx-link" {...props}>
        {children}
      </Link>
    );
  },
  
  // Images - optimized with Next.js Image component
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== 'string') return null;
    
    // Check if it's a local static asset
    const isLocal = src.startsWith('/');
    
    if (isLocal) {
      return (
        <span className="mdx-image-wrapper">
          <Image
            src={src}
            alt={alt || ''}
            width={600 as number}
            height={450 as number}
            className="mdx-image"
            style={{ maxWidth: '100%', height: 'auto' }}
            {...(props as any)}
          />
        </span>
      );
    }
    
    // Fallback for external images
    return (
      <span className="mdx-image-wrapper">
        <img src={src} alt={alt} className="mdx-image" {...props} />
      </span>
    );
  },
  
  // Code blocks
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="mdx-pre" {...props} />
  ),
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className?.includes('language-');
    if (isInline) {
      return <code className="mdx-code-inline" {...props}>{children}</code>;
    }
    return <code className={className} {...props}>{children}</code>;
  },
  
  // Blockquotes
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mdx-blockquote" {...props} />
  ),
  
  // Horizontal rule
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="mdx-hr" {...props} />
  ),
  
  // Tables
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mdx-table-wrapper">
      <table className="mdx-table" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="mdx-thead" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="mdx-tbody" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="mdx-tr" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="mdx-th" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="mdx-td" {...props} />
  ),
};

export interface MDXContentProps {
  source: string;
  components?: MDXRemoteProps['components'];
}

/**
 * Portable MDX Content Component
 * 
 * Renders MDX content with optimized components for Next.js.
 * All static assets (images, diagrams) should be stored in the public directory
 * and referenced with absolute paths starting with '/'.
 * 
 * @example
 * ```tsx
 * <MDXContent source={mdxContent} />
 * ```
 */
export function MDXContent({ source, components: customComponents }: MDXContentProps) {
  return (
    <div className="mdx-content">
      <MDXRemote 
        source={source} 
        components={{ ...components, ...customComponents }}
      />
    </div>
  );
}

