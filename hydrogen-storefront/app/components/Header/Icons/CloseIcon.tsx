import {memo} from 'react';

interface CloseIconProps {
  className?: string;
}

export const CloseIcon = memo(function CloseIcon({
  className = 'w-6 h-6',
}: CloseIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
});

