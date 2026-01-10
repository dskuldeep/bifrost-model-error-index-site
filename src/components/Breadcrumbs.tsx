import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index}>
              {isLast ? (
                <span className="breadcrumb-current">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link 
                    href={item.href || '#'} 
                    className="breadcrumb-link"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight size={16} className="breadcrumb-separator" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

