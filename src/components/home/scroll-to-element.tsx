'use client';

export function ScrollToElement({ targetId, children, className }: { targetId: string; children: React.ReactNode; className?: string }) {
  function handleClick() {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <button type='button' onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
