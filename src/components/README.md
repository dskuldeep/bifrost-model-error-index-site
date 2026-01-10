# MDXContent Component

A portable, self-contained MDX rendering component for Next.js that handles all static assets locally.

## Features

- ✅ **Static Assets**: All images and diagrams are stored locally in the `public` directory
- ✅ **Optimized Images**: Uses Next.js `Image` component for automatic optimization
- ✅ **Custom Components**: Pre-styled components for headings, links, code blocks, tables, and more
- ✅ **External Link Handling**: Automatically adds external link indicators
- ✅ **Type-Safe**: Full TypeScript support

## Usage

```tsx
import { MDXContent } from '@/components/MDXContent';

export default function MyPage() {
  const mdxSource = `# Hello World
  
This is MDX content with a [link](https://example.com).

![Diagram](/diagrams/my-diagram.png)
`;

  return <MDXContent source={mdxSource} />;
}
```

## Static Assets

All static assets should be stored in the `public` directory and referenced with absolute paths:

- **Diagrams**: `/diagrams/{filename}.png`
- **Logos**: `/logos/{provider}.png`
- **Other Images**: `/images/{filename}.{ext}`

## Custom Components

You can override or extend the default components:

```tsx
<MDXContent 
  source={mdxSource}
  components={{
    h1: (props) => <h1 className="custom-h1" {...props} />,
    // ... other custom components
  }}
/>
```

## Default Components

The component includes pre-styled components for:

- Headings (h1-h4)
- Paragraphs
- Lists (ul, ol, li)
- Links (with external link indicators)
- Images (optimized with Next.js Image)
- Code blocks (with syntax highlighting support)
- Blockquotes
- Tables
- Horizontal rules

## File Structure

```
public/
  ├── diagrams/          # Mermaid diagrams as PNG files
  ├── logos/             # Provider logos
  └── images/            # Other static images

src/
  ├── components/
  │   └── MDXContent.tsx # Portable MDX component
  └── content/           # MDX source files
```

