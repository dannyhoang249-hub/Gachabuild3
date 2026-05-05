'use client';

import { useState } from 'react';

interface Notice {
  id: string;
  type: 'info' | 'warning' | 'update';
  title: string;
  message: string;
  date: string;
}

const notices: Notice[] = [
  {
    id: '1',
    type: 'update',
    title: 'Tier List Updated',
    message: 'Tier list has been updated based on the latest balance patch and community feedback.',
    date: '2026-03-30'
  },
  {
    id: '2',
    type: 'info',
    title: 'How to Use',
    message: 'Select a game mode to view optimized tier rankings. Use filters to find specific characters by element, role, or weapon type.',
    date: '2026-03-30'
  }
];

export default function NoticesPanel() {
  const [isExpanded, setIsExpanded] = useState(true);

  const getNoticeIcon = (type: Notice['type']) => {
    switch (type) {
      case 'update':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getNoticeColor = (type: Notice['type']) => {
    switch (type) {
      case 'update':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900">Notices & Updates</h2>
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {notices.length}
          </span>
        </div>
        
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Notices List */}
      {isExpanded && (
        <div className="px-6 pb-4 space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-4 rounded-lg border-2 ${getNoticeColor(notice.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNoticeIcon(notice.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm">{notice.title}</h3>
                    <time className="text-xs opacity-75 flex-shrink-0 ml-2">
                      {new Date(notice.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </time>
                  </div>
                  <p className="text-sm opacity-90">{notice.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

