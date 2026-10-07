'use client';

import { MotionConfig } from 'motion/react';

/** Drops movement from every animation for people whose system asks for less, keeping fades. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion='user'>{children}</MotionConfig>;
}
