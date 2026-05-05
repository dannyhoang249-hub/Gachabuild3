# 📊 Google Analytics - Usage Examples

After setting up Google Analytics, here are examples of how to track custom events in your application.

---

## Basic Usage

Google Analytics is automatically tracking:
- ✅ All page views
- ✅ User sessions
- ✅ Traffic sources
- ✅ Device types

No additional code needed for these!

---

## Custom Event Tracking

### Import the Analytics Helper
```tsx
import { analytics } from '@/components/GoogleAnalytics';
```

### Example 1: Track Character Views
In your character detail page (`src/app/characters/[slug]/page.tsx`):

```tsx
'use client';

import { useEffect } from 'react';
import { analytics } from '@/components/GoogleAnalytics';

export default function CharacterPage({ character }) {
  useEffect(() => {
    // Track when someone views a character
    analytics.viewCharacter(character.name.en, character.slug.current);
  }, [character]);

  return (
    // Your character page JSX
  );
}
```

### Example 2: Track Search Usage
In your search component (`src/components/SearchWithSuggestions.tsx`):

```tsx
import { analytics } from '@/components/GoogleAnalytics';

// Inside your search handler
const handleSearch = (query: string, results: any[]) => {
  // Track search queries
  analytics.search(query, results.length);
};
```

### Example 3: Track Filter Usage
In your filter components:

```tsx
import { analytics } from '@/components/GoogleAnalytics';

const handleFilterChange = (filterType: string, value: string) => {
  // Track which filters users are using
  analytics.useFilter(filterType, value);
  
  // Your existing filter logic
  setFilter(value);
};

// Example usage:
// analytics.useFilter('role', 'Vanguard');
// analytics.useFilter('element', 'Fire');
// analytics.useFilter('weapon', 'Sword');
```

### Example 4: Track Navigation Clicks
In your navigation components:

```tsx
import { analytics } from '@/components/GoogleAnalytics';
import Link from 'next/link';

const NavLink = ({ href, children, origin }) => {
  const handleClick = () => {
    analytics.clickNavigation(href, origin);
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
};
```

### Example 5: Track Tier List Views
In your tier list page:

```tsx
import { useEffect } from 'react';
import { analytics } from '@/components/GoogleAnalytics';

export default function TierListPage() {
  useEffect(() => {
    // Track tier list page views
    analytics.viewTierList();
  }, []);

  return (
    // Your tier list JSX
  );
}
```

### Example 6: Track External Links
For links to external sites:

```tsx
import { analytics } from '@/components/GoogleAnalytics';

const ExternalLink = ({ href, children }) => {
  const handleClick = () => {
    analytics.clickExternalLink(href, children);
  };

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
```

---

## Custom Events

For events not covered by the predefined helpers:

```tsx
import { trackEvent } from '@/components/GoogleAnalytics';

// Track any custom event
trackEvent('button_click', {
  button_name: 'subscribe',
  location: 'header',
  user_action: 'engagement'
});

// Track scroll depth
trackEvent('scroll_depth', {
  depth: '75%',
  page: '/tier-list'
});

// Track video plays
trackEvent('video_play', {
  video_title: 'character_showcase',
  character: 'Berenica'
});

// Track downloads
trackEvent('file_download', {
  file_name: 'character_guide.pdf',
  file_type: 'pdf'
});
```

---

## Available Analytics Functions

All available in `analytics` object:

| Function | Parameters | Description |
|----------|-----------|-------------|
| `viewCharacter()` | `name, slug` | Track character page views |
| `search()` | `query, resultsCount` | Track search usage |
| `useFilter()` | `filterType, filterValue` | Track filter usage |
| `clickNavigation()` | `destination, origin` | Track navigation clicks |
| `viewTierList()` | none | Track tier list views |
| `clickExternalLink()` | `url, linkText` | Track external link clicks |

---

## Where to Add Tracking

### High Priority (Recommended):
1. ✅ Character detail pages → `analytics.viewCharacter()`
2. ✅ Search functionality → `analytics.search()`
3. ✅ Filter usage → `analytics.useFilter()`
4. ✅ Tier list views → `analytics.viewTierList()`

### Medium Priority:
5. Navigation clicks → `analytics.clickNavigation()`
6. External links → `analytics.clickExternalLink()`

### Optional:
7. Button clicks → `trackEvent('button_click', {...})`
8. Form submissions → `trackEvent('form_submit', {...})`
9. Error tracking → `trackEvent('error', {...})`

---

## Testing Your Events

### Method 1: Browser Console (Development)
In development mode, all events are logged to console:
```
[GA] Event tracked: view_character { character_name: 'Berenica', character_slug: 'berenica' }
```

### Method 2: GA4 Real-Time Report
1. Go to Google Analytics
2. Click **Reports** → **Real-time** → **Events**
3. Perform actions on your site
4. Events should appear within 30 seconds

### Method 3: GA4 DebugView
1. Install Chrome extension: **Google Analytics Debugger**
2. Enable the extension
3. Visit your site
4. Go to GA4 → **Admin** → **DebugView**
5. See events in real-time with full details

---

## Example: Complete Integration

Here's a complete example for a character card component:

```tsx
'use client';

import { analytics } from '@/components/GoogleAnalytics';
import Link from 'next/link';
import Image from 'next/image';

interface CharacterCardProps {
  character: {
    name: { en: string; vi: string };
    slug: { current: string };
    role: string;
    element: string;
    image: string;
  };
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const handleClick = () => {
    // Track when user clicks on a character card
    analytics.viewCharacter(character.name.en, character.slug.current);
  };

  return (
    <Link 
      href={`/characters/${character.slug.current}`}
      onClick={handleClick}
      className="character-card"
    >
      <Image 
        src={character.image} 
        alt={character.name.en}
        width={200}
        height={200}
      />
      <h3>{character.name.en}</h3>
      <p>{character.role} • {character.element}</p>
    </Link>
  );
}
```

---

## Privacy Considerations

### IP Anonymization
Google Analytics 4 automatically anonymizes IP addresses.

### Cookie Consent
If you need GDPR compliance, consider adding a cookie consent banner:

```tsx
// Example: Conditional GA loading based on consent
import GoogleAnalytics from '@/components/GoogleAnalytics';

export default function Layout({ children }) {
  const [hasConsent, setHasConsent] = useState(false);

  return (
    <>
      {hasConsent && <GoogleAnalytics />}
      {/* Your cookie banner here */}
      {children}
    </>
  );
}
```

---

## Troubleshooting

### Events Not Showing in GA4
- ✅ Check console for "[GA] Event tracked" messages
- ✅ Verify GA_MEASUREMENT_ID is set correctly
- ✅ Wait up to 30 seconds for real-time reports
- ✅ Check that ad blockers are disabled
- ✅ Verify the event name doesn't contain spaces or special characters

### Development Mode
- Events are logged to console for debugging
- All tracking works on localhost
- To disable localhost tracking, modify GoogleAnalytics.tsx

---

## Next Steps

1. Set up Google Analytics (follow GOOGLE_ANALYTICS_SETUP.md)
2. Deploy the code to production
3. Start seeing automatic page view tracking
4. Add custom event tracking as needed
5. Monitor your data in GA4 dashboard

---

**Need Help?** Check the main setup guide: `GOOGLE_ANALYTICS_SETUP.md`

