import React from 'react';

export const CircleIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 24, 
  color = '#3B82F6' 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle 
      cx="12" 
      cy="12" 
      r="8" 
      fill={color} 
      stroke="#1e40af" 
      strokeWidth="2"
    />
  </svg>
);

export const RectangleIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 24, 
  color = '#EF4444' 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect 
      x="4" 
      y="6" 
      width="16" 
      height="12" 
      rx="2" 
      fill={color} 
      stroke="#dc2626" 
      strokeWidth="2"
    />
  </svg>
);

export const TriangleIcon: React.FC<{ size?: number; color?: string }> = ({ 
  size = 24, 
  color = '#10B981' 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M12 4 4 20 20 20 Z" 
      fill={color} 
      stroke="#059669" 
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const UndoIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M3 7v6h6M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const RedoIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M21 7v6h-6M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const IntersectIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="12" r="6" fill="#F59E0B" opacity="0.6" />
    <circle cx="15" cy="12" r="6" fill="#3B82F6" opacity="0.6" />
  </svg>
);

export const UnionIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M9 6a6 6 0 106 12h0a6 6 0 106-12z" 
      fill="#10B981" 
      opacity="0.8"
    />
  </svg>
);

export const SubtractIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="12" r="6" fill="#8B5CF6" />
    <circle cx="15" cy="12" r="4" fill="#ffffff" />
  </svg>
);

export const DifferenceIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M9 6a6 6 0 016 12M15 18a6 6 0 01-6-12" 
      stroke="#EC4899" 
      strokeWidth="3" 
      fill="none"
    />
  </svg>
);
