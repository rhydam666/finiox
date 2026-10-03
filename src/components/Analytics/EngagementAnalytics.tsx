import React, { useState, useEffect } from 'react';
import { ShortVideo } from '../../types';
import { RETENTION_CURVE_DATA } from '../../data/mockData';
import { 
  Activity, 
  Eye, 
  TrendingUp, 
  Users, 
  Clock, 
  Share2, 
  Heart, 
  Flame, 
  Radio,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface EngagementAnalyticsProps {
  videos: ShortVideo[];
}

export const EngagementAnalytics: React.FC<EngagementAnalyticsProps> = ({ videos }) => {
  const [liveViewers, setLiveViewers] = useState(2418);
  const [timeRange, setTimeRange] = useState<'realtime' | '24h' | '7d' | '30d'>('realtime');

  // Simulated live pulse activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const delta = Math.floor(Math.random() * 25) - 12;
        return Math.max(1800, prev + delta);
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const totalViews = videos.reduce((acc, v) => acc + v.metrics.views, 0);
  const avgCompletion = (videos.reduce((acc, v) => acc + v.metrics.completionRate, 0) / videos.length).toFixed(1);
  const avgWatchSeconds = (videos.reduce((acc, v) => acc + v.metrics.avgWatchSeconds, 0) / videos.length).toFixed(1);

  // SVG retention curve points
  const points = RETENTION_CURVE_DATA;
  const width = 600;
  const height = 180;
  const padX = 40;
  const padY = 20;

  const maxSec = 38;
  const getX = (sec: number) => padX + (sec / maxSec) * (width - padX * 2);
  const getY = (pct: number) => height - padY - ((pct - 50) / 50) * (height - padY * 2);

  const pathD = points.reduce((acc, pt, i) => {
    const x = getX(pt.second);
    const y = getY(pt.percent);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${getX(points[points.length - 1].second)} ${height - padY} L ${getX(0)} ${height - padY} Z`;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Real-Time Engagement & Audience Retention
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Live Pulse
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Algorithmic shorts performance, second-by-second drop-off curves, and audience conversion.
          </p>
        </div>

        {/* Time Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setTimeRange('realtime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'realtime' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Live (Real-Time)
          </button>
          <button
            onClick={() => setTimeRange('24h')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '24h' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Last 24 Hours
          </button>
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '7d' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '30d' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Real-Time Live Activity Ribbon */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-neutral-900 to-neutral-900 border border-rose-500/20 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Active Viewers Right Now</span>
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {liveViewers.toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Across 4 vertical shorts in feed
          </p>
        </div>

        <div>
          <div className="text-xs font-medium text-neutral-400 mb-1">Avg Completion Rate</div>
          <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
            {avgCompletion}%
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Platform benchmark: 68.2%
          </p>
        </div>

        <div>
          <div className="text-xs font-medium text-neutral-400 mb-1">Avg Watch Time</div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {avgWatchSeconds}s
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            On 38s average video duration
          </p>
        </div>

        <div>
          <div className="text-xs font-medium text-neutral-400 mb-1">Follower Conversion</div>
          <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
            4.8%
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Viewers who subscribe after watch
          </p>
        </div>
      </div>

      {/* Retention Curve & Traffic Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Retention Curve Graph */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Shorts Audience Retention Curve
              </h3>
              <p className="text-xs text-neutral-400">
                Percentage of viewers remaining at each second mark of the vertical short.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 font-mono">
                94.2% Hook Rate (3s)
              </span>
            </div>
          </div>

          {/* SVG Line & Area Graph */}
          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 sm:h-52 overflow-visible">
              <defs>
                <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padX} y1={getY(100)} x2={width - padX} y2={getY(100)} stroke="#262626" strokeDasharray="3 3" />
              <line x1={padX} y1={getY(80)} x2={width - padX} y2={getY(80)} stroke="#262626" strokeDasharray="3 3" />
              <line x1={padX} y1={getY(60)} x2={width - padX} y2={getY(60)} stroke="#262626" strokeDasharray="3 3" />

              {/* Y Axis Labels */}
              <text x={padX - 8} y={getY(100) + 4} fill="#737373" fontSize="10" textAnchor="end" className="font-mono">100%</text>
              <text x={padX - 8} y={getY(80) + 4} fill="#737373" fontSize="10" textAnchor="end" className="font-mono">80%</text>
              <text x={padX - 8} y={getY(60) + 4} fill="#737373" fontSize="10" textAnchor="end" className="font-mono">60%</text>

              {/* Area Fill */}
              <path d={areaD} fill="url(#retentionGrad)" />

              {/* Main Line */}
              <path d={pathD} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />

              {/* Data Point Circles */}
              {points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={getX(pt.second)}
                    cy={getY(pt.percent)}
                    r="4"
                    fill="#f43f5e"
                    stroke="#0a0a0a"
                    strokeWidth="2"
                  />
                  <text
                    x={getX(pt.second)}
                    y={height - 4}
                    fill="#737373"
                    fontSize="10"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="pt-2 border-t border-neutral-800 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 font-medium">Hook Retention (0-3s)</span>
              <p className="font-bold text-white font-mono mt-0.5">94.2%</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-medium">Mid-Clip Plateau (15s)</span>
              <p className="font-bold text-white font-mono mt-0.5">87.1%</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-medium">Full Completion (38s)</span>
              <p className="font-bold text-emerald-400 font-mono mt-0.5">76.9%</p>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-sky-400" />
            Traffic Distribution
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Algorithmic "For You" Feed</span>
                <span className="text-white font-bold font-mono">68.4%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '68.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Subscriber Notifications</span>
                <span className="text-white font-bold font-mono">18.2%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '18.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Creator Profile Visits</span>
                <span className="text-white font-bold font-mono">8.4%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: '8.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">External Link Shares</span>
                <span className="text-white font-bold font-mono">5.0%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '5.0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video-by-Video Leaderboard Performance Matrix */}
      <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          Shorts Performance Benchmark
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-950/40">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4 text-right">Views</th>
                <th className="py-3 px-4 text-right">Completion Rate</th>
                <th className="py-3 px-4 text-right">Avg Watch Time</th>
                <th className="py-3 px-4 text-right">Likes</th>
                <th className="py-3 px-4 text-right">SuperTips</th>
                <th className="py-3 px-4 text-right">Est. RPM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {videos.map((v) => {
                const rpm = ((v.metrics.earnings / v.metrics.views) * 1000).toFixed(2);
                return (
                  <tr key={v.id} className="hover:bg-neutral-850/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">
                      {v.title}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-200">
                      {(v.metrics.views / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                      {v.metrics.completionRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-200">
                      {v.metrics.avgWatchSeconds}s
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-200">
                      {(v.likesCount / 1000).toFixed(1)}k
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-400 font-semibold">
                      ${v.tipsTotal}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-bold">
                      ${rpm}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
