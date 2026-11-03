import React, { useState } from 'react';
import { Video, Film, Info, Sparkles, ExternalLink } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  tag: string;
  category: 'showcase' | 'audit';
  src: string;
  youtubeId?: string;
  isShort?: boolean;
  poster?: string;
  quality?: string;
}

export const MediaView: React.FC = () => {
  const [filter, setFilter] = useState<'showcase' | 'all' | 'audit'>('showcase');

  const allVideos: VideoItem[] = [
    {
      id: 'video-short',
      title: 'EcoWoman UGC — Creator Experience & Unboxing',
      subtitle: 'User-Generated Content (UGC) social acquisition & customer testimonial',
      description:
        'Authentic short-form creator demonstration detailing packaging unboxing, product features, and direct endorsement tailored for high-conversion social acquisition across TikTok and Instagram Reels.',
      duration: '0:37',
      tag: 'YouTube Short',
      category: 'showcase',
      src: 'https://youtube.com/shorts/SEeZRMehmus',
      youtubeId: 'SEeZRMehmus',
      isShort: true,
      quality: '9:16 Vertical · HD',
    },
    {
      id: 'video-regular',
      title: 'EcoGirls 3D Brand Campaign — Creative Storytelling',
      subtitle: 'High-fidelity 3D animated visual assets & demographic narrative engagement',
      description:
        'Creative 3D animated character walkthrough illustrating morning routines and period underwear comfort, designed to build strong brand resonance and conversion among younger teen demographics.',
      duration: '1:11',
      tag: 'YouTube Video',
      category: 'showcase',
      src: 'https://youtu.be/vEpKcu32bGY',
      youtubeId: 'vEpKcu32bGY',
      isShort: false,
      quality: '1080p · 60fps',
    },
    {
      id: 'video-1',
      title: 'Server-Side Tracking & Conversions Audit Walkthrough',
      subtitle: 'Architecture review, attribution discrepancy diagnosis, and CAPI mitigation',
      description:
        'A comprehensive 15-minute technical walkthrough analyzing how iOS 14.5+ privacy protections degrade client-side Meta/Google tracking, and demonstrating server-side GTM tagging on AWS ECS.',
      duration: '14:28',
      tag: 'Technical Walkthrough',
      category: 'audit',
      src: '/videos/serverside-audit.mp4',
      isShort: false,
      quality: '1080p · 60fps',
    },
    {
      id: 'video-2',
      title: 'AI Share of Voice & Omnichannel Performance Deep-Dive',
      subtitle: 'Generative engine optimization (GEO), LLM brand citations, and margin pace',
      description:
        'Detailed breakdown of LLM response evaluations (Perplexity, ChatGPT, Claude) across competitor swimwear brands, analyzing query fan-outs, citation graphs, and Shopify ledger attribution.',
      duration: '18:45',
      tag: 'Executive Overview',
      category: 'audit',
      src: '/videos/ai-sov-deepdive.mp4',
      isShort: false,
      quality: '1080p · 60fps',
    },
  ];

  const displayedVideos = allVideos.filter((v) => {
    if (filter === 'all') return true;
    return v.category === filter;
  });

  return (
    <div className="bg-white border border-[#E8DCCA] rounded-2xl p-6 sm:p-8 space-y-8 text-[#462B14] shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DCCA]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C4A26] uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>Media Showcase // Video Archives</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#462B14] mt-1">
            Case Study Video Walkthroughs
          </h3>
          <p className="text-xs sm:text-sm text-[#7A5C4B] mt-1 max-w-2xl leading-relaxed">
            Recorded demonstrations, creative campaigns, and technical architecture explanations
            detailing methodologies, brand storytelling, and business impact.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF7F2] border border-[#E8DCCA] rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setFilter('showcase')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'showcase'
                  ? 'bg-white text-[#462B14] shadow-2xs font-semibold'
                  : 'text-[#7A5C4B] hover:text-[#462B14]'
              }`}
            >
              Active Media (2)
            </button>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-[#462B14] shadow-2xs font-semibold'
                  : 'text-[#7A5C4B] hover:text-[#462B14]'
              }`}
            >
              All (4)
            </button>
            <button
              type="button"
              onClick={() => setFilter('audit')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'audit'
                  ? 'bg-white text-[#462B14] shadow-2xs font-semibold'
                  : 'text-[#7A5C4B] hover:text-[#462B14]'
              }`}
            >
              Technical Mocks (2)
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF7F2] px-3.5 py-1.5 rounded-lg border border-[#E8DCCA] text-xs font-medium text-[#462B14] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#108474] animate-pulse" />
            <span>{displayedVideos.length} Videos Available</span>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {displayedVideos.map((vid, idx) => (
          <div
            key={vid.id}
            className="flex flex-col bg-[#FAF7F2] border border-[#E8DCCA] rounded-xl overflow-hidden hover:border-[#DCD0BD] transition-all shadow-2xs group"
          >
            {/* Slot & Tag Top Bar */}
            <div className="px-4 py-2.5 bg-white border-b border-[#E8DCCA] flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2 text-[#462B14]">
                <Video className="w-3.5 h-3.5 text-[#8C4A26]" />
                <span>
                  Slot #{idx + 1} · {vid.duration}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#FAF2EA] text-[#8C4A26] border border-[#E8DCCA] text-[10px] font-semibold">
                {vid.tag}
              </span>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video bg-[#1F130B] flex items-center justify-center overflow-hidden">
              {vid.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${vid.youtubeId}?rel=0`}
                  title={vid.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover"
                  poster={vid.poster}
                >
                  <source src={vid.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Video Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-base text-[#462B14] group-hover:text-[#8C4A26] transition-colors">
                  {vid.title}
                </h4>
                <div className="text-xs text-[#8C4A26] font-medium mt-0.5">{vid.subtitle}</div>
                <p className="text-xs text-[#7A5C4B] leading-relaxed mt-2.5">{vid.description}</p>
              </div>

              {/* Source Link & Quality */}
              <div className="pt-3 border-t border-[#E8DCCA] flex items-center justify-between text-[11px] font-medium text-[#7A5C4B]">
                <span className="flex items-center gap-1.5 min-w-0 pr-2">
                  <Info className="w-3.5 h-3.5 text-[#8C4A26] shrink-0" />
                  <span className="truncate">
                    Source:{' '}
                    {vid.youtubeId ? (
                      <a
                        href={vid.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8C4A26] hover:underline bg-white px-1.5 py-0.5 rounded border border-[#E8DCCA] inline-flex items-center gap-1 font-mono transition-colors"
                      >
                        <span className="truncate max-w-[160px] sm:max-w-[210px]">{vid.src}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <code className="text-[#462B14] bg-white px-1 py-0.5 rounded border border-[#E8DCCA]">
                        {vid.src}
                      </code>
                    )}
                  </span>
                </span>
                <span className="text-[#108474] font-semibold shrink-0">
                  {vid.quality || '1080p · 60fps'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Helpful instruction banner */}
      <div className="p-4 bg-[#FAF7F2] border border-[#E8DCCA] rounded-xl flex items-start gap-3 text-xs text-[#7A5C4B]">
        <Sparkles className="w-4 h-4 text-[#8C4A26] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-[#462B14]">Media Showcase Integration:</div>
          <div className="text-[11px] text-[#7A5C4B] leading-normal">
            Featuring active YouTube streams:{' '}
            <span className="font-semibold text-[#462B14]">YouTube Short</span> (vertical 9:16
            format) and <span className="font-semibold text-[#462B14]">YouTube Video</span> (1080p
            widescreen). Both streams are embedded with full playback controls and direct external
            link access.
          </div>
        </div>
      </div>
    </div>
  );
};
