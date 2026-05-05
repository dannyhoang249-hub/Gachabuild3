'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Character } from '@/lib/data';
import SkillCard from './SkillCard';

interface SkillsSectionProps {
  character: Character;
}

export default function SkillsSection({ character }: SkillsSectionProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'active' | 'ultimate' | 'passive'>('active');

  if (!character.skills || character.skills.length === 0) {
    return (
      <section id="skills" className="scroll-mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'vi' ? 'Kỹ năng' : 'Skills'}
          </h2>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              {language === 'vi' ? 'Thông tin kỹ năng sẽ có sớm.' : 'Skills information will be available soon.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Group skills by type - separate active, ultimate, and passive
  const activeSkills = character.skills.filter(skill => skill.type === 'active');
  const ultimateSkills = character.skills.filter(skill => skill.type === 'ultimate');
  const passiveSkills = character.skills.filter(skill => skill.type === 'passive');

  return (
    <section id="skills" className="scroll-mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'vi' ? 'Kỹ năng' : 'Skills'}
          </h2>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'active'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'vi' ? 'Chủ động' : 'Active'}
              {activeSkills.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-bold">
                  {activeSkills.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('ultimate')}
              className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'ultimate'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'vi' ? 'Tuyệt kỹ' : 'Ultimate'}
              {ultimateSkills.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 font-bold">
                  {ultimateSkills.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('passive')}
              className={`flex-1 px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'passive'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {language === 'vi' ? 'Bị động' : 'Passive'}
              {passiveSkills.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-bold">
                  {passiveSkills.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'active' && (
            <div className="space-y-8">
              {activeSkills.length > 0 ? (
                activeSkills.map((skill, index) => (
                  <SkillCard key={index} skill={skill} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">
                    {language === 'vi' ? 'Không có kỹ năng chủ động.' : 'No active skills available.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ultimate' && (
            <div className="space-y-8">
              {ultimateSkills.length > 0 ? (
                ultimateSkills.map((skill, index) => (
                  <SkillCard key={index} skill={skill} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">
                    {language === 'vi' ? 'Không có kỹ năng tuyệt kỹ.' : 'No ultimate skills available.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'passive' && (
            <div className="space-y-8">
              {passiveSkills.length > 0 ? (
                passiveSkills.map((skill, index) => (
                  <SkillCard key={index} skill={skill} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">
                    {language === 'vi' ? 'Không có kỹ năng bị động.' : 'No passive skills available.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
