# Next.js Comprehensive Guide

## Table of Contents
1. [What is Next.js](#what-is-nextjs)
2. [Next.js vs React](#nextjs-vs-react)
3. [Server-Side Rendering vs Client-Side Rendering](#server-side-rendering-vs-client-side-rendering)
4. [Rendering Strategies](#rendering-strategies)
5. [Routing in Next.js](#routing-in-nextjs)
6. [File Structure & Reserved Files](#file-structure--reserved-files)
7. [Client vs Server Components](#client-vs-server-components)
8. [CSS Implementation](#css-implementation)
9. [Dynamic Routes](#dynamic-routes)
10. [Forms in Next.js](#forms-in-nextjs)
11. [Caching & Revalidation](#caching--revalidation)
12. [Metadata Handling](#metadata-handling)
13. [Error Handling](#error-handling)
14. [File Notations Reference](#file-notations-reference)

---

## What is Next.js

### Definition
Next.js is a **React framework** for building modern web applications with:
- Built-in server-side rendering (SSR)
- Static site generation (SSG)
- Client-side rendering (CSR)
- API routes
- Automatic code splitting
- File-based routing

### Key Features
- 🚀 **Fast Performance** - Automatic optimization
- 📱 **Full-Stack** - Frontend + Backend in one framework
- 🔄 **Flexible Rendering** - SSR, SSG, CSR, ISR
- 🎯 **SEO Friendly** - Server rendering by default
- 🛣️ **File-Based Routing** - No need for route configuration
- 🧩 **Components** - React components out of the box

### Official Documentation
📚 https://nextjs.org/docs

---

## Next.js vs React

| Aspect | React | Next.js |
|--------|-------|---------|
| **Type** | UI Library | Full Framework |
| **Routing** | Manual (React Router) | Built-in (File-based) |
| **Server Rendering** | Not built-in | Built-in (SSR/SSG) |
| **Backend** | Not included | API routes included |
| **Optimization** | Manual | Automatic |
| **Learning Curve** | Easier for beginners | More features to learn |
| **Setup** | Create-react-app | `npx create-next-app` |
| **Performance** | Good | Optimized by default |
| **SEO** | Manual setup required | Built-in support |

### When to Use React?
- Simple UI components
- SPA (Single Page Application)
- Real-time apps (chat, dashboards)
- Maximum flexibility needed

### When to Use Next.js?
- Full-stack applications
- SEO is important
- Need for SSR/SSG
- Want faster time to market
- Content-heavy websites

---

## Server-Side Rendering vs Client-Side Rendering

### Server-Side Rendering (SSR)

**How it works:**
```
1. Client requests URL
2. Server renders React components
3. HTML is generated on server
4. Sends complete HTML to client
5. Browser displays content immediately
6. React hydrates for interactivity
```

**Advantages:**
✅ Faster initial page load  
✅ Better SEO (HTML content available)  
✅ Better for users with slow devices  
✅ Content available without JavaScript  
✅ More secure (sensitive data stays on server)  

**Disadvantages:**
❌ Higher server load  
❌ Slower Time to First Byte (TTFB)  
❌ Not good for real-time updates  
❌ Full page refresh on navigation  

**Example:**
```jsx
// app/page.js (Server Component by default)
export default async function Home() {
  const data = await fetch('https://api.example.com/data', {
    // This fetch only runs on server
  });
  const result = await data.json();
  
  return <div>{result.title}</div>;
}
```

---

### Client-Side Rendering (CSR)

**How it works:**
```
1. Client requests URL
2. Server sends minimal HTML + JavaScript
3. Browser downloads JavaScript
4. React renders components in browser
5. Content appears after JS execution
6. Subsequent navigation is fast (SPA)
```

**Advantages:**
✅ Faster subsequent navigations  
✅ Real-time interactivity  
✅ Lower server load  
✅ Great for dynamic content  
✅ Works offline  

**Disadvantages:**
❌ Slow initial page load  
❌ Poor SEO (no content in HTML)  
❌ Blank page until JS loads  
❌ Requires JavaScript  

**Example:**
```jsx
// app/page.js
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // This runs in browser
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);

  return <div>{data?.title}</div>;
}
```

---

## Rendering Strategies

### 1. Static Generation (SSG)
**When:** Build time (npm run build)  
**Best for:** Content that doesn't change frequently  

```jsx
// app/blog/[slug]/page.js
export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}

// Generate static pages at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

**Use Case:** Blog posts, product pages, documentation

---

### 2. Server-Side Rendering (SSR)
**When:** Every request  
**Best for:** Dynamic content that changes per user/request  

```jsx
// app/dashboard/page.js (no 'use client')
export const revalidate = 0; // Don't cache

export default async function Dashboard() {
  const userData = await getCurrentUserData();
  return <div>Welcome {userData.name}</div>;
}
```

**Use Case:** User dashboards, personalized content, real-time data

---

### 3. Incremental Static Regeneration (ISR)
**When:** Build time + periodic updates  
**Best for:** Content that updates occasionally  

```jsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <div>{product.name} - ${product.price}</div>;
}
```

**Use Case:** E-commerce products, news, social media feeds

---

### 4. Client-Side Rendering (CSR)
**When:** In browser  
**Best for:** Interactive, real-time features  

```jsx
'use client';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**Use Case:** Real-time chats, dashboards, interactive tools

---

## Routing in Next.js

### File-Based Routing

**URL Structure:**
```
app/
  page.js              → /
  about/
    page.js            → /about
  blog/
    [slug]/
      page.js          → /blog/learn-nextjs
  products/
    [id]/
      reviews/
        page.js        → /products/123/reviews
```

### Basic Routes

```
app/
  page.js                    Route: /
  about/page.js              Route: /about
  contact/page.js            Route: /contact
  products/page.js           Route: /products
```

---

### Dynamic Routes (Slugs)

**Using [slug]:**
```jsx
// app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const { slug } = params;
  
  return (
    <article>
      <h1>Post: {slug}</h1>
      {/* params.slug = "learn-nextjs" for URL /blog/learn-nextjs */}
    </article>
  );
}
```

**Generate metadata for dynamic routes:**
```jsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.description,
  };
}
```

---

### Page-Based Routing vs App-Based Routing

### Pages Router (Old - pages/ directory)
```
pages/
  index.js             → /
  about.js             → /about
  blog/
    index.js           → /blog
    [slug].js          → /blog/[slug]
  api/
    users.js           → /api/users
```

**Example:**
```jsx
// pages/blog/[slug].js
import { useRouter } from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  
  return <h1>Post: {slug}</h1>;
}

export async function getStaticProps({ params }) {
  return {
    props: {
      post: await getPost(params.slug),
    },
  };
}
```

---

### App Router (New - app/ directory) ⭐ Recommended
```
app/
  page.js              → /
  about/page.js        → /about
  blog/
    page.js            → /blog
    [slug]/
      page.js          → /blog/[slug]
  api/
    users/route.js     → /api/users
```

**Example:**
```jsx
// app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const { slug } = params;
  
  return <h1>Post: {slug}</h1>;
}

export async function generateStaticParams() {
  return (await getAllPosts()).map(p => ({ slug: p.slug }));
}
```

### Differences

| Feature | Pages Router | App Router |
|---------|--------------|-----------|
| **Directory** | pages/ | app/ |
| **Server Components** | Opt-in | Default |
| **Data Fetching** | getStaticProps, getServerSideProps | async/await in components |
| **API Routes** | pages/api/ | app/api/ |
| **Layouts** | Per-page | Shared across routes |
| **Status** | Legacy | Recommended ✅ |

---

## File Structure & Reserved Files

### Core Reserved Files

#### `page.js` - Page Component
```jsx
// Renders the page UI
export default function Page() {
  return <div>Page content</div>;
}
```
**Creates a route:**
```
app/blog/page.js → Route /blog
```

---

#### `layout.js` - Layout Wrapper
```jsx
// Wraps all child pages
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```
**Applies to:**
```
app/layout.js       → All pages
app/blog/layout.js  → Pages under /blog
```

---

#### `error.js` - Error Boundary
```jsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```
**Catches:**
```
Errors in child pages and layouts
```

---

#### `not-found.js` - 404 Page
```jsx
export default function NotFound() {
  return <h1>404 - Page not found</h1>;
}
```
**Created from:**
```jsx
// In page.js
import { notFound } from 'next/navigation';

export default function Page({ params }) {
  if (!post) {
    notFound(); // Shows not-found.js
  }
}
```

---

#### `loading.js` - Suspense Fallback
```jsx
export default function Loading() {
  return <div>Loading...</div>;
}
```
**Shows while:**
```
Page is rendering (streaming)
Wrapped in <Suspense>
```

---

#### `route.js` - API Route
```jsx
export async function GET(request) {
  return Response.json({ hello: 'world' });
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ received: body });
}
```
**Creates API endpoint:**
```
app/api/hello/route.js → /api/hello
```

---

#### `template.js` - Route Template
```jsx
// Like layout but re-mounts on navigation
export default function Template({ children }) {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {children}
    </div>
  );
}
```
**Difference from layout:**
```
layout.js   - Persists across navigations
template.js - Re-mounts on each navigation
```

---

#### `middleware.js` - Request Handler
```jsx
// At root of project or in src/
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Add CORS headers, authentication, etc
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
```

---

#### `instrumentation.ts` - Lifecycle
```jsx
// Runs when server starts
export async function register() {
  console.log('Server initialized');
}
```

---

#### `global-error.js` - Root Error
```jsx
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>Error occurred</body>
    </html>
  );
}
```

---

### Parallel Routes (Advanced)

```
app/
  dashboard/
    @metrics/page.js      → ${metrics}
    @notifications/page.js → ${notifications}
    @sidebar/page.js      → ${sidebar}
    layout.js
```

**Usage in layout:**
```jsx
export default function Layout({
  children,
  metrics,
  notifications,
  sidebar
}) {
  return (
    <div>
      {metrics}
      {notifications}
      {sidebar}
    </div>
  );
}
```

---

## Client vs Server Components

### Server Components (Default)

**What they are:**
```jsx
// app/page.js - Server Component by default
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const result = await data.json();
  
  return <div>{result.title}</div>;
}
```

**Characteristics:**
- ✅ Can access databases directly
- ✅ Keep sensitive data secure
- ✅ Reduce client bundle size
- ✅ Can use async/await
- ❌ Cannot use browser APIs (window, localStorage)
- ❌ Cannot use event listeners (onClick, onChange)
- ❌ Cannot use hooks (useState, useEffect)

**Use When:**
- Fetching data
- Accessing secure data
- Large dependencies needed
- Need database queries

---

### Client Components

**How to mark:**
```jsx
'use client';  // Always at top

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**Characteristics:**
- ✅ Can use hooks (useState, useEffect)
- ✅ Can use browser APIs
- ✅ Can use event listeners
- ❌ Cannot access databases directly
- ❌ Cannot use sensitive data
- ❌ Increases client bundle

**Use When:**
- Need interactivity
- Need hooks
- Need browser APIs
- User input handling

---

### Mixing Server and Client

**Best Practice:**
```jsx
// app/page.js (Server Component)
import ClientCard from './card';

export default async function Page() {
  const data = await fetchData(); // Server-only
  
  return (
    <div>
      <ServerInfo data={data} />
      <ClientCard onClick={handleClick} />
    </div>
  );
}

// Pass data to client component as props
function ServerInfo({ data }) {
  return <p>{data.title}</p>;
}
```

**Client Component:**
```jsx
// app/card.js
'use client';

import { useState } from 'react';

export default function ClientCard({ onClick }) {
  const [selected, setSelected] = useState(false);
  
  return (
    <div onClick={() => {
      setSelected(!selected);
      onClick?.();
    }}>
      {selected ? 'Selected' : 'Click me'}
    </div>
  );
}
```

---

### useClient vs useServer

#### useClient
```jsx
// Explicit Client Component
'use client';

import { useState } from 'react';

export default function Component() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

#### useServer (Not needed - default)
```jsx
// No directive = Server Component by default
export default async function Page() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}
```

---

## CSS Implementation

### 1. CSS Modules (Recommended)

**Create CSS Module:**
```css
/* app/page.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2rem;
  color: #333;
}
```

**Use in Component:**
```jsx
// app/page.js
import styles from './page.module.css';

export default function Page() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome</h1>
    </div>
  );
}
```

**Benefits:**
- ✅ Scoped to component
- ✅ No class name conflicts
- ✅ Better for maintenance

---

### 2. Global CSS

**Create CSS:**
```css
/* app/globals.css */
* {
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}
```

**Import in root layout:**
```jsx
// app/layout.js
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

### 3. Tailwind CSS (Popular)

**Install:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure (tailwind.config.js):**
```js
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Use:**
```jsx
export default function Page() {
  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
    </div>
  );
}
```

---

### 4. Styled Components (CSS-in-JS)

**Install:**
```bash
npm install styled-components
```

**Use:**
```jsx
'use client';

import styled from 'styled-components';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const StyledTitle = styled.h1`
  font-size: 2rem;
  color: #333;
`;

export default function Page() {
  return (
    <StyledContainer>
      <StyledTitle>Welcome</StyledTitle>
    </StyledContainer>
  );
}
```

---

## Dynamic Routes

### Basic Dynamic Routes

**File Structure:**
```
app/
  posts/
    [slug]/
      page.js
```

**Access param:**
```jsx
// app/posts/[slug]/page.js
export default function Post({ params }) {
  const { slug } = params;
  
  return <h1>Post: {slug}</h1>;
}
```

**URL Examples:**
```
/posts/hello-world      → params.slug = "hello-world"
/posts/learn-nextjs     → params.slug = "learn-nextjs"
```

---

### Multiple Dynamic Segments

**File Structure:**
```
app/
  blog/
    [year]/
      [month]/
        [day]/
          page.js
```

**Access params:**
```jsx
export default function Post({ params }) {
  const { year, month, day } = params;
  
  return <h1>{year}/{month}/{day}</h1>;
}
```

**URL:**
```
/blog/2024/03/11
params = { year: "2024", month: "03", day: "11" }
```

---

### Catch-All Routes

**File Structure:**
```
app/
  docs/
    [...slug]/
      page.js
```

**Access param:**
```jsx
export default function Docs({ params }) {
  const { slug } = params; // Array
  
  return <h1>Path: {slug.join('/')}</h1>;
}
```

**URLs:**
```
/docs/getting-started           → slug = ["getting-started"]
/docs/api/reference/get-user    → slug = ["api", "reference", "get-user"]
```

---

### Optional Catch-All

**File Structure:**
```
app/
  docs/
    [[...slug]]/
      page.js
```

**URLs:**
```
/docs                           → slug = undefined
/docs/api/reference             → slug = ["api", "reference"]
```

---

### generateStaticParams

```jsx
// app/posts/[slug]/page.js

export async function generateStaticParams() {
  // Fetch all posts at build time
  const posts = await getAllPosts();
  
  return posts.map(post => ({
    slug: post.slug
  }));
}

export default function Post({ params }) {
  return <div>Post: {params.slug}</div>;
}
```

---

## Forms in Next.js

### Server Actions (Recommended)

**Define Server Action:**
```jsx
// app/actions.js
'use server';

export async function submitForm(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  
  // Save to database
  await saveUser({ name, email });
  
  return { success: true, message: 'Saved!' };
}
```

**Use in Form:**
```jsx
// app/page.js
import { submitForm } from './actions';

export default function Page() {
  return (
    <form action={submitForm}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### useFormStatus Hook

```jsx
'use client';

import { useFormStatus } from 'react-dom';
import { submitForm } from './actions';

export default function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

---

### useFormState Hook

```jsx
'use client';

import { useFormState } from 'react-dom';
import { submitForm } from './actions';

export default function Form() {
  const [state, formAction] = useFormState(submitForm, null);
  
  return (
    <form action={formAction}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <button type="submit">Submit</button>
      
      {state?.message && <p>{state.message}</p>}
      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
    </form>
  );
}
```

---

### useTransition Hook (Client-Side)

```jsx
'use client';

import { useTransition, useState } from 'react';

export default function Form() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  
  function handleSubmit(e) {
    e.preventDefault();
    
    startTransition(async () => {
      const result = await submitData(input);
      if (result.success) {
        setInput('');
      }
    });
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button disabled={isPending}>
        {isPending ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

### React Form Hooks

**Install react-hook-form:**
```bash
npm install react-hook-form
```

**Use:**
```jsx
'use client';

import { useForm } from 'react-hook-form';

export default function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  async function onSubmit(data) {
    const result = await submitForm(data);
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', { required: 'Name is required' })}
      />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email'
          }
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Documentation:** https://react-hook-form.com/

---

## Caching & Revalidation

### Request Memoization

```jsx
// Same fetch called multiple times = executed once
export default async function Page() {
  const data1 = await fetch('https://api.example.com/user');
  const data2 = await fetch('https://api.example.com/user');
  // Only one request made (automatically memoized)
}
```

---

### Data Cache

```jsx
// Cached by default in production
const data = await fetch('https://api.example.com/posts');
```

**Opt-out of caching:**
```jsx
const data = await fetch('https://api.example.com/posts', {
  cache: 'no-store' // Fetch every time
});
```

**Set cache duration:**
```jsx
export const revalidate = 60; // Cache for 60 seconds

export default async function Page() {
  const data = await fetch('https://api.example.com/posts');
  return <div>{/* ... */}</div>;
}
```

---

### Incremental Static Regeneration (ISR)

```jsx
// Revalidate every 3600 seconds (1 hour)
export const revalidate = 3600;

export default async function Post({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}
```

---

### On-Demand Revalidation

**Revalidate specific path:**
```jsx
// app/api/revalidate/route.js
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const path = await request.json();
  
  revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

**Revalidate tag:**
```jsx
// app/page.js
const data = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
});

// app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';

export async function POST() {
  revalidateTag('posts');
  return Response.json({ revalidated: true });
}
```

---

## Metadata Handling

### Static Metadata

```jsx
// app/layout.js
export const metadata = {
  title: 'My App',
  description: 'Welcome to my app',
  keywords: ['nextjs', 'react'],
  openGraph: {
    title: 'My App',
    description: 'Welcome',
    url: 'https://myapp.com',
    images: [{ url: 'https://myapp.com/og.png' }]
  }
};

export default function Layout({ children }) {
  return <html><body>{children}</body></html>;
}
```

---

### Dynamic Metadata

```jsx
// app/posts/[slug]/page.js

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image]
    }
  };
}

export default function Post({ params }) {
  return <article>{/* content */}</article>;
}
```

---

### Robots & Sitemap

**robots.js:**
```jsx
// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin'
      }
    ],
    sitemap: 'https://myapp.com/sitemap.xml'
  };
}
```

**sitemap.js:**
```jsx
// app/sitemap.js
export default function sitemap() {
  return [
    {
      url: 'https://myapp.com',
      lastModified: new Date()
    },
    {
      url: 'https://myapp.com/about',
      lastModified: new Date()
    }
  ];
}
```

---

## Error Handling

### error.js - Error Boundary

```jsx
// app/error.js
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

---

### not-found.js - 404 Page

```jsx
// app/not-found.js
export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
    </div>
  );
}
```

**Trigger from page:**
```jsx
// app/posts/[slug]/page.js
import { notFound } from 'next/navigation';

export default async function Post({ params }) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound(); // Shows not-found.js
  }
  
  return <article>{post.content}</article>;
}
```

---

### redirect - Navigate User

```jsx
// Redirect to another page
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login'); // Redirect to login
  }
  
  return <div>User: {user.name}</div>;
}
```

---

### Try-Catch Error Handling

```jsx
export default async function Page() {
  try {
    const data = await fetch('https://api.example.com/data');
    
    if (!data.ok) {
      throw new Error(`API error: ${data.status}`);
    }
    
    const result = await data.json();
    return <div>{result.title}</div>;
  } catch (error) {
    return <div>Error: {error.message}</div>;
  }
}
```

---

## File Notations Reference

### File & Folder Naming

| Pattern | Meaning | Example |
|---------|---------|---------|
| `page.js` | **Route page** - creates a route | `app/blog/page.js` → `/blog` |
| `layout.js` | **Layout wrapper** - wraps children | `app/layout.js` wraps all |
| `error.js` | **Error boundary** - catches errors | Error fallback UI |
| `not-found.js` | **404 page** - missing routes | Show 404 UI |
| `loading.js` | **Suspense fallback** - during render | Loading skeleton |
| `route.js` | **API route** - handle requests | `app/api/users/route.js` |
| `template.js` | **Route template** - re-mounts on nav | Like layout but resets |
| `middleware.js` | **Request handler** - intercepts requests | Auth, CORS, etc |
| `instrumentation.ts` | **Lifecycle hook** - server startup | Initialize services |
| `global-error.js` | **Root error** - catches root errors | Global error boundary |

---

### Dynamic Segments

| Pattern | Meaning | URL Match |
|---------|---------|-----------|
| `[id]` | **Single dynamic segment** | `/posts/123` |
| `[id]/[name]` | **Multiple segments** | `/posts/123/hello` |
| `[...slug]` | **Catch-all route** | `/docs/a/b/c` |
| `[[...slug]]` | **Optional catch-all** | `/docs` or `/docs/a/b` |

---

### Parallel Routes

| Pattern | Meaning | Usage |
|---------|---------|-------|
| `@slot` | **Named slot** | `@metrics`, `@sidebar` |
| `@slot/page.js` | **Slot page** | Route for specific slot |
| `@slot/default.js` | **Slot default** | Shows when no match |

---

### Advanced Patterns

| Pattern | Meaning |
|---------|---------|
| `(group)` | **Route group** - organize without changing URL |
| `(auth)` | Example: `/auth/login` becomes `/login` |
| `_folder` | **Private folder** - excluded from routing |
| `.hidden` | **Dot files** - completely ignored |

---

## Quick Reference Links

📚 **Official Documentation:**
- Next.js Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app
- Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Client Components: https://nextjs.org/docs/app/building-your-application/rendering/client-components
- Data Fetching: https://nextjs.org/docs/app/building-your-application/data-fetching
- Caching: https://nextjs.org/docs/app/building-your-application/caching

🎓 **Learning Resources:**
- Next.js Learn: https://nextjs.org/learn
- Next.js Examples: https://github.com/vercel/next.js/tree/canary/examples

🛠️ **Tools & Libraries:**
- React Hook Form: https://react-hook-form.com/
- Tailwind CSS: https://tailwindcss.com/
- Styled Components: https://styled-components.com/

---

## Summary

**Next.js** is a powerful React framework that provides:
- 🚀 Multiple rendering strategies (SSR, SSG, CSR, ISR)
- 🛣️ File-based routing with dynamic segments
- 📦 Server Components by default
- 🎯 Built-in SEO optimization
- 🔄 Automatic caching & revalidation
- 📝 Metadata and error handling
- 🎨 Multiple CSS options
- 📋 Form handling with Server Actions

**Best Practices:**
1. Use Server Components by default
2. Only use 'use client' when needed
3. Implement proper error handling
4. Set appropriate cache strategies
5. Handle loading states with loading.js
6. Generate static params for dynamic routes
7. Add metadata for SEO
8. Use Server Actions for forms

---

**Last Updated:** March 11, 2026  
**Next.js Version:** Latest (App Router)
