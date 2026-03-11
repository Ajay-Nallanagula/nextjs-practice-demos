# Route & Page Rendering in Next.js

## Table of Contents
1. [Parallel Routes](#parallel-routes)
2. [Use Cases](#use-cases)
3. [Examples](#examples)
4. [Key Concepts](#key-concepts)

---

## Parallel Routes

### What are Parallel Routes?

Parallel routes allow you to **simultaneously render multiple pages within the same route**. This is done using **route segments (slots)** with the `@` symbol.

**Syntax:**
```
app/
  dashboard/
    @metrics/
      page.js
    @revenue/
      page.js
    @notifications/
      page.js
    layout.js
```

### How It Works

- Use **@slotName** folder naming convention
- Multiple slots render at the same layout level
- Each slot is **independent** and can have its own loading/error states
- Slots are passed as **props** to the layout component

### Basic Example

**File Structure:**
```
app/
  dashboard/
    @metrics/
      page.js        # Renders metrics section
    @revenue/
      page.js        # Renders revenue section
    @notifications/
      page.js        # Renders notifications section
    layout.js        # Main layout component
```

**Layout Component (dashboard/layout.js):**
```jsx
export default function DashboardLayout({
  children,
  metrics,
  revenue,
  notifications
}) {
  return (
    <div className="dashboard">
      <header>Dashboard</header>
      <main className="grid gap-4">
        <section>{metrics}</section>
        <section>{revenue}</section>
        <section>{notifications}</section>
      </main>
    </div>
  );
}
```

### Key Features

| Feature | Description |
|---------|-------------|
| **Independent Loading** | Each slot can have its own loading.js |
| **Error Boundaries** | Each slot can handle errors separately |
| **Lazy Loading** | Slots render independently, no blocking |
| **Dynamic Routes** | Slots support dynamic segments [id] |
| **Conditional Rendering** | Slots can be conditionally rendered |

---

## Use Cases

### 1. **Dashboard with Multiple Panels** ✅
- Render metrics, charts, and stats simultaneously
- Each panel loads independently
- One slow panel doesn't block others

**When to Use:**
- Admin dashboards
- Analytics pages
- Real-time monitoring screens

---

### 2. **Sidebar Navigation + Main Content** ✅
- Left sidebar in one slot
- Main content in another slot
- Both render at the same time

**When to Use:**
- Blog with categories sidebar
- Documentation with navigation
- Settings page with menu

---

### 3. **Modal/Overlay Dialogs** ✅
- Keep modal in separate slot from background
- Modal independently manages its state
- Background continues to interact independently

**When to Use:**
- Photo galleries with lightbox
- Confirmation dialogs
- Forms over existing content

---

### 4. **Tabs/Accordion Sections** ✅
- Each tab content in separate parallel route
- Switch between them without remounting layout
- Preserve state across tab switches

**When to Use:**
- Product pages with specifications/reviews tabs
- Settings with multiple tabs
- User profiles with multiple sections

---

### 5. **News Feed with Sidebar** ✅
- Main feed in one slot
- Trending sidebar in another
- Ads/recommendations in third slot

**When to Use:**
- Social media feeds
- News websites
- Content discovery platforms

---

## Examples

### Example 1: Analytics Dashboard

**File Structure:**
```
app/analytics/
  @overview/
    page.js
    loading.js
  @revenue/
    page.js
    loading.js
  @conversion/
    page.js
    loading.js
  layout.js
  error.js
```

**Layout:**
```jsx
// app/analytics/layout.js
export default function AnalyticsLayout({
  overview,
  revenue,
  conversion
}) {
  return (
    <div className="analytics-dashboard">
      <h1>Analytics</h1>
      <div className="metrics-grid">
        <div className="card">{overview}</div>
        <div className="card">{revenue}</div>
        <div className="card">{conversion}</div>
      </div>
    </div>
  );
}
```

**Overview Slot:**
```jsx
// app/analytics/@overview/page.js
export default function OverviewPage() {
  return (
    <div>
      <h2>Overview</h2>
      <p>Total Users: 10,234</p>
      <p>Active Sessions: 1,456</p>
    </div>
  );
}
```

**Loading State:**
```jsx
// app/analytics/@overview/loading.js
export default function OverviewLoading() {
  return <div>Loading Overview...</div>;
}
```

---

### Example 2: Product Page with Tabs

**File Structure:**
```
app/products/[id]/
  @details/
    page.js
  @reviews/
    page.js
  @related/
    page.js
  layout.js
```

**Layout:**
```jsx
// app/products/[id]/layout.js
'use client';
import { useState } from 'react';

export default function ProductLayout({
  details,
  reviews,
  related,
  params
}) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="product-page">
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('details')}
          className={activeTab === 'details' ? 'active' : ''}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={activeTab === 'reviews' ? 'active' : ''}
        >
          Reviews
        </button>
        <button 
          onClick={() => setActiveTab('related')}
          className={activeTab === 'related' ? 'active' : ''}
        >
          Related Products
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'details' && details}
        {activeTab === 'reviews' && reviews}
        {activeTab === 'related' && related}
      </div>
    </div>
  );
}
```

---

### Example 3: News Page with Sidebar

**File Structure:**
```
app/news/
  @feed/
    page.js
  @trending/
    page.js
  layout.js
```

**Layout:**
```jsx
// app/news/layout.js
export default function NewsLayout({ feed, trending }) {
  return (
    <div className="news-container">
      <div className="main-content">
        {feed}
      </div>
      <aside className="sidebar">
        {trending}
      </aside>
    </div>
  );
}
```

---

## Key Concepts

### 1. Slot Props
Each slot is available as a prop in the layout:
```jsx
export default function Layout({ 
  children,          // Default slot
  metrics,           // @metrics slot
  notifications      // @notifications slot
}) {
  // Each prop contains the rendered content from that slot
}
```

### 2. Default Routes
Use `default.js` when slot has no matching route:
```
@sidebar/
  default.js   // Shows when no specific route matches
  page.js      // Shows for specific routes
```

### 3. Error Handling
Each slot can have its own error boundary:
```
@metrics/
  error.js     # Only catches errors in @metrics slot
  page.js
```

### 4. Unmatched Routes
If a slot has no matching route for current URL, show `default.js`:
```
app/archive/
  @archive/[year]/page.js      # Matches /archive/2024
  @archive/default.js          # Shows for /archive (no year)
  @latest/page.js              # Always shows
  layout.js
```

---

## Quick Reference

### When to Use Parallel Routes:
✅ Multiple independent components loading simultaneously  
✅ Need separate error/loading states per section  
✅ Modal dialogs over persistent content  
✅ Dashboard with multiple widgets  
✅ News feed with sidebar  

### When NOT to Use:
❌ Simple sequential layouts  
❌ Pages that depend on each other  
❌ When one section blocks others  

---

## Common Patterns

### Pattern 1: Skeleton Screens
```jsx
// Each slot can show skeleton while loading
// @metrics/loading.js
export default function MetricsLoading() {
  return <div className="skeleton metric-skeleton" />;
}
```

### Pattern 2: Conditional Slots
```jsx
// Show slot only if condition met
export default function Layout({ metrics, notifications }) {
  const showMetrics = true;  // Based on user role, etc
  
  return (
    <div>
      {showMetrics && metrics}
      {notifications}
    </div>
  );
}
```

### Pattern 3: Responsive Layout
```jsx
// Hide/show slots based on screen size
export default function Layout({ mainContent, sidebar }) {
  return (
    <div className="responsive-layout">
      <div className="main">{mainContent}</div>
      <div className="sidebar hidden-mobile">{sidebar}</div>
    </div>
  );
}
```

---

## Summary

**Parallel Routes** = Multiple route segments rendering simultaneously at same layout level

**Key Benefits:**
- 🚀 Faster perceived performance
- 🎯 Independent state management
- 🔄 Simultaneous data fetching
- 🛡️ Isolated error handling
- ✨ Better UX with concurrent rendering

**Best For:** Dashboards, multi-section pages, modals, tabs, sidebars
