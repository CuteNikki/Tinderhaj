import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className='flex min-h-80 items-center justify-center py-16'>
      <div className='mx-auto flex max-w-xl flex-col items-center text-center'>
        <div className='bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full'>
          <Icon className='h-7 w-7' />
        </div>
        <h2 className='mt-6 text-3xl font-black tracking-tight sm:text-4xl'>{title}</h2>
        <p className='text-muted-foreground mt-4 text-sm leading-relaxed text-pretty'>{description}</p>
      </div>
    </div>
  );
}
