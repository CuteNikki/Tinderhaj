'use client';

/** A button scrolling to `targetId`. */
export function ScrollToElement({ targetId, ...props }: { targetId: string } & Omit<React.ComponentProps<'button'>, 'type' | 'onClick'>) {
  function handleClick() {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return <button type='button' onClick={handleClick} {...props} />;
}
