# Search System Documentation

## Overview

The search system has been completely rebuilt to provide instant, reliable search suggestions that work in both development and production environments, including static exports.

## Architecture

### Data Sources (Priority Order)

1. **Static JSON Data** (Primary) - Instant suggestions from pre-loaded data
2. **Generated Build Data** (Production) - Optimized data generated at build time
3. **Sanity CMS** (Fallback) - Live data for comprehensive search
4. **API Route** (Static Builds) - Server-side search for static exports

### Key Components

#### 1. `src/lib/searchData.ts`
- **Purpose**: Core search logic with multiple data source fallbacks
- **Features**:
  - Static data cache for instant suggestions
  - Build-time data generation support
  - Sanity CMS fallback
  - API route support for static builds
  - Fuzzy matching and ranking

#### 2. `src/components/SearchWithSuggestions.tsx`
- **Purpose**: Optimized search component
- **Features**:
  - 150ms debounce for optimal performance
  - Keyboard navigation support
  - Real-time suggestions
  - Translation support
  - Error handling and fallbacks

#### 3. `scripts/generateSearchData.ts`
- **Purpose**: Build-time data generation
- **Features**:
  - Fetches data from Sanity CMS
  - Generates optimized search index
  - Creates TypeScript definitions
  - Supports both development and production builds

#### 4. `src/app/api/search/route.ts`
- **Purpose**: API endpoint for static builds
- **Features**:
  - Server-side search functionality
  - CORS support for static exports
  - Error handling and fallbacks

## Data Flow

```
User Types → Debounce (150ms) → Static Cache Check → 
  ↓ (if no results)
Generated Data Check → 
  ↓ (if no results)
Sanity CMS Query → 
  ↓ (if fails)
API Route Fallback → 
  ↓ (if fails)
Static JSON Fallback
```

## Performance Optimizations

### 1. Static Data Loading
- **Development**: Loads from `import/` JSON files
- **Production**: Uses generated data from build process
- **Benefits**: Instant suggestions, no API calls for common searches

### 2. Debouncing
- **Delay**: 150ms (optimized for user experience)
- **Purpose**: Reduces API calls and improves performance
- **Implementation**: `useCallback` with `setTimeout` cleanup

### 3. Caching Strategy
- **Static Cache**: In-memory cache for instant access
- **Build-time Generation**: Pre-optimized data for production
- **Fallback Chain**: Multiple data sources ensure reliability

### 4. Search Ranking
- **Exact Match**: Highest priority
- **Starts With**: Second priority  
- **Contains**: Third priority
- **Alphabetical**: Final sorting

## Build Process

### Development
```bash
npm run dev
```
- Uses static JSON files from `import/` directory
- Sanity CMS available for comprehensive search
- Hot reloading for development

### Production Build
```bash
npm run build
```
1. Generates search data from Sanity CMS
2. Creates optimized search index
3. Builds Next.js application
4. Includes static data in build

### Static Export
```bash
npm run build:static
```
1. Generates search data from Sanity CMS
2. Creates optimized search index
3. Builds static export
4. API routes available for server-side search

## Configuration

### Environment Variables
```env
# Sanity Configuration
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Build Configuration
STATIC_EXPORT=true  # For static builds
```

### Build Scripts
```json
{
  "build": "npm run generate:search-data && next build",
  "build:static": "npm run generate:search-data && STATIC_EXPORT=true next build",
  "generate:search-data": "ts-node scripts/generateSearchData.ts"
}
```

## TypeScript Support

### Core Types
```typescript
interface SearchSuggestion {
  _id: string;
  name: { en: string; vi: string };
  slug: { _type: 'slug'; current: string };
  _type: 'character' | 'weapon';
  displayName: string;
  category: 'character' | 'weapon';
  subtitle: string;
  // Additional fields...
}
```

### Generated Types
- Auto-generated TypeScript definitions
- Build-time type checking
- IntelliSense support

## Error Handling

### Fallback Chain
1. **Static Cache** → Instant, reliable
2. **Generated Data** → Build-time optimized
3. **Sanity CMS** → Live, comprehensive
4. **API Route** → Server-side fallback
5. **Static JSON** → Final fallback

### Error Recovery
- Graceful degradation
- User-friendly error messages
- Console logging for debugging
- Automatic fallback to next data source

## SEO and Performance

### Static Export Compatibility
- ✅ Works with `next export`
- ✅ No client-side API dependencies
- ✅ Server-side rendering support
- ✅ CDN-friendly static assets

### Search Engine Optimization
- ✅ Server-side search capabilities
- ✅ Structured data support
- ✅ Fast initial page loads
- ✅ Progressive enhancement

## Usage Examples

### Basic Usage
```tsx
import SearchWithSuggestions from '@/components/SearchWithSuggestions';

<SearchWithSuggestions
  placeholder="Search characters and weapons..."
  onSearch={(query) => console.log('Search:', query)}
  origin="tier-list"
/>
```

### Advanced Usage
```tsx
import { getSearchSuggestions, initializeSearchData } from '@/lib/searchData';

// Initialize search data
await initializeSearchData();

// Get suggestions programmatically
const suggestions = await getSearchSuggestions('berenica', 5);
```

## Monitoring and Analytics

### Performance Metrics
- Search response times
- Cache hit rates
- Fallback usage
- Error rates

### Debug Information
- Console logging for development
- Performance timing
- Data source identification
- Error tracking

## Troubleshooting

### Common Issues

1. **No Search Results**
   - Check Sanity CMS connection
   - Verify data import
   - Check console for errors

2. **Slow Search Performance**
   - Ensure static data is loaded
   - Check debounce settings
   - Verify cache initialization

3. **Static Build Issues**
   - Run `npm run generate:search-data`
   - Check build process
   - Verify API routes

### Debug Commands
```bash
# Check search data generation
npm run generate:search-data

# Verify Sanity connection
npm run check:characters

# Debug search data
npm run debug:characters
```

## Future Enhancements

### Planned Features
- Search analytics dashboard
- Advanced filtering options
- Search history
- Popular searches
- Search suggestions based on user behavior

### Performance Improvements
- Service worker caching
- IndexedDB for offline search
- Web Workers for heavy processing
- Advanced ranking algorithms
