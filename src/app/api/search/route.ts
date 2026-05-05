import { NextRequest, NextResponse } from 'next/server';
import { getSearchSuggestions } from '@/lib/simpleSearchData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    // Get search suggestions with static data first
    const suggestions = await getSearchSuggestions(query, limit, true);
    
    return NextResponse.json({ 
      suggestions,
      query,
      count: suggestions.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Search failed', suggestions: [] },
      { status: 500 }
    );
  }
}

// Handle CORS for static exports
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
