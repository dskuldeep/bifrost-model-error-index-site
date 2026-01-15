import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getProviderDisplayName, getProviderLogoPath } from './providerDisplayName';

const contentDirectory = path.join(process.cwd(), 'src/content');

export interface ErrorFrontmatter {
    title: string;
    provider: string;
    provider_icon?: string;
    solved: boolean;
    slug: string;
    [key: string]: any; // Allow additional properties
}

export interface Error {
    slug: string;
    frontmatter: ErrorFrontmatter;
    content: string;
}

export function getErrorSlugs() {
    return fs.readdirSync(contentDirectory).filter(file => file.endsWith('.mdx'));
}

export function getErrorBySlug(slug: string): Error {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as ErrorFrontmatter;

    if (frontmatter.provider) {
        // Always derive the provider icon from the canonical mapping.
        frontmatter.provider_icon = getProviderLogoPath(frontmatter.provider);
    }

    return { 
        slug: realSlug, 
        frontmatter, 
        content 
    };
}

export function getAllErrors(): Error[] {
    const slugs = getErrorSlugs();
    const errors = slugs.map(slug => getErrorBySlug(slug));
    return errors;
}

export function getErrorsByProvider(provider: string) {
    const allErrors = getAllErrors();
    return allErrors.filter(error => 
        error.frontmatter.provider?.toLowerCase() === provider.toLowerCase()
    );
}

export function getAllProviders() {
    const allErrors = getAllErrors();
    const providerMap = new Map<string, { name: string; count: number; icon?: string }>();
    
    allErrors.forEach(error => {
        const provider = error.frontmatter.provider;
        if (provider) {
            const providerLower = provider.toLowerCase();
            if (providerMap.has(providerLower)) {
                providerMap.get(providerLower)!.count++;
            } else {
                providerMap.set(providerLower, {
                    name: providerLower, // Store the original identifier for URL routing
                    count: 1,
                    icon: getProviderLogoPath(provider) // Use the logo mapping function
                });
            }
        }
    });
    
    return Array.from(providerMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}
