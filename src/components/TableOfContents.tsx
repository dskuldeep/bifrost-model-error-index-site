'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Extract headings from the page
    const headingElements = document.querySelectorAll('.mdx-h2, .mdx-h3');
    const headingData: Heading[] = [];

    headingElements.forEach((element) => {
      const id = element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
      if (id && !element.id) {
        element.id = id;
      }
      headingData.push({
        id,
        text: element.textContent || '',
        level: element.classList.contains('mdx-h2') ? 2 : 3,
      });
    });

    setHeadings(headingData);

    // Helper to get scroll offset
    const getScrollOffset = () => {
      const topBanner = document.querySelector('.top-banner');
      const navbar = document.querySelector('.main-navbar');
      const bannerHeight = topBanner ? topBanner.getBoundingClientRect().height : 40;
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 64;
      return bannerHeight + navbarHeight + 24; // Total offset
    };

    // Set up intersection observer for active heading (matching Bifrost blog behavior)
    const observer = new IntersectionObserver(
      (entries) => {
        const offset = getScrollOffset();
        const scrollThreshold = window.scrollY + offset;

        // Get all headings with their positions
        const headingData = Array.from(headingElements).map((el) => {
          const entry = entries.find(e => e.target === el);
          const rect = el.getBoundingClientRect();
          const absoluteTop = window.scrollY + rect.top;
          return {
            element: el,
            absoluteTop,
            viewportTop: rect.top,
            isIntersecting: entry?.isIntersecting || false,
            distance: Math.abs(absoluteTop - scrollThreshold),
          };
        });

        // Find the active heading: prefer intersecting ones near the threshold
        let activeHeading = null;
        let minDistance = Infinity;

        // First, try to find intersecting headings near the scroll threshold
        headingData.forEach(({ element, viewportTop, isIntersecting, distance }) => {
          if (isIntersecting && viewportTop <= offset + 50 && viewportTop >= offset - 150) {
            if (distance < minDistance) {
              minDistance = distance;
              activeHeading = element;
            }
          }
        });

        // If no intersecting heading found, use the one closest to scroll position
        if (!activeHeading) {
          headingData.forEach(({ element, absoluteTop, distance }) => {
            if (absoluteTop <= scrollThreshold + 100 && distance < minDistance) {
              minDistance = distance;
              activeHeading = element;
            }
          });
        }

        if (activeHeading) {
          setActiveId(activeHeading.id);
        }
      },
      {
        rootMargin: '-128px 0% -66% 0%', // Offset for banner (40px) + navbar (64px) + padding (24px)
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    // Handle max-height adjustment when footer is in view (matching Bifrost blog behavior)
    // TOC stays sticky and only scrolls internally when footer approaches
    const handleScroll = () => {
      if (!tocRef.current) return;
      
      const toc = tocRef.current;
      const footer = document.querySelector('footer') || document.querySelector('.main-footer');
      
      // Get the sticky top position (6rem = 96px)
      const stickyTop = 96;
      const defaultMaxHeight = 'calc(100vh - 8rem)';
      
      if (!footer) {
        // No footer found, use default max-height
        toc.style.maxHeight = defaultMaxHeight;
        return;
      }
      
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const footerTop = footerRect.top;
      
      // Check if footer is approaching the sticky TOC position
      // When footer top is less than viewport height, it means footer is visible
      // We want to shrink TOC max-height so it doesn't overlap with footer
      if (footerTop < viewportHeight && footerTop > stickyTop) {
        // Footer is in view and below the sticky top position
        // Calculate available space: from sticky top to footer top, minus a gap
        const gap = 24; // Gap between TOC bottom and footer top
        const availableHeight = footerTop - stickyTop - gap;
        const minHeight = 150; // Minimum height to keep TOC usable
        
        // Set max-height so TOC scrolls internally instead of overlapping footer
        toc.style.maxHeight = `${Math.max(minHeight, availableHeight)}px`;
      } else if (footerTop <= stickyTop) {
        // Footer has passed the sticky position, keep minimum height
        toc.style.maxHeight = '150px';
      } else {
        // Footer is not in view yet, use default max-height
        toc.style.maxHeight = defaultMaxHeight;
      }
    };

    // Use requestAnimationFrame for smoother scrolling
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial check

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  // Handle smooth scroll to section (matching Bifrost blog behavior)
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, headingId: string) => {
    e.preventDefault();
    
    const element = document.getElementById(headingId);
    if (!element) return;

    // Calculate offset: top banner (40px) + navbar (64px) + padding (24px) = 128px
    const topBanner = document.querySelector('.top-banner');
    const navbar = document.querySelector('.main-navbar');
    const bannerHeight = topBanner ? topBanner.getBoundingClientRect().height : 40;
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 64;
    const offset = bannerHeight + navbarHeight + 24;

    // Get element position relative to document
    const elementRect = element.getBoundingClientRect();
    const elementTop = elementRect.top + window.pageYOffset;
    
    // Calculate final scroll position with offset
    const scrollTo = Math.max(0, elementTop - offset);

    // Single smooth scroll (matching Bifrost blog's native behavior)
    window.scrollTo({
      top: scrollTo,
      behavior: 'smooth',
    });

    // Update URL hash after scroll starts
    requestAnimationFrame(() => {
      window.history.pushState(null, '', `#${headingId}`);
    });
  };

  return (
    <aside className="table-of-contents-wrapper">
      <div ref={tocRef} className="table-of-contents">
        <nav>
          <h4 className="toc-header">In this article</h4>
          <ul className="toc-list">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={`toc-item ${activeId === heading.id ? 'toc-item-active' : ''}`}
                style={{ paddingLeft: heading.level === 3 ? '12px' : '0px' }}
              >
                <Link 
                  href={`#${heading.id}`} 
                  className="toc-link"
                  onClick={(e) => handleLinkClick(e, heading.id)}
                >
                  {heading.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
