import React from 'react';

interface IAQGaugeProps {
  score: number; // e.g. 96
  size?: number; // e.g. 56
  strokeWidth?: number;
}

export const IAQGauge: React.FC<IAQGaugeProps> = ({
  score,
  size = 56,
  strokeWidth = 4,
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let strokeColor = '#10B981'; // Green for Good (>80)
  if (score < 50) strokeColor = '#EF4444'; // Red for Poor (<50)
  else if (score < 80) strokeColor = '#F59E0B'; // Amber for Moderate (50-80)

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute font-extrabold text-slate-800 tracking-tight text-sm tabular-nums">
        {score}
      </span>
    </div>
  );
};
