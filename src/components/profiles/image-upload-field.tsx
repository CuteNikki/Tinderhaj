'use client';

import { ImageUpIcon, Loader2Icon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { UploadButton } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';

export function ImageUploadField({
  label,
  endpoint,
  value,
  onChange,
  shape,
}: {
  label: string;
  endpoint: keyof OurFileRouter;
  value: string | null;
  onChange: (url: string | null) => void;
  shape: 'circle' | 'banner';
}) {
  const [progress, setProgress] = useState<number | null>(null);

  return (
    <div className='space-y-2'>
      <p className='text-sm leading-none font-medium'>{label}</p>
      <div className={cn('group relative', shape === 'circle' ? 'h-20 w-20' : 'aspect-5/2 w-full')}>
        <div className={cn('bg-muted border-input absolute inset-0 overflow-hidden border', shape === 'circle' ? 'rounded-full' : 'rounded-md')}>
          {value && <Image unoptimized src={value} alt={label} fill className='object-cover' />}

          {progress !== null && (
            <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-black/60 text-white'>
              <Loader2Icon className='h-4 w-4 animate-spin' />
              <span className='text-xs font-semibold tabular-nums'>{Math.round(progress)}%</span>
            </div>
          )}

          <UploadButton<typeof endpoint>
            endpoint={endpoint}
            appearance={{
              container: cn(
                'absolute inset-0 flex items-center justify-center',
                value && 'opacity-0 bg-black/50 transition-opacity group-hover:opacity-100',
                progress !== null && 'pointer-events-none opacity-0',
              ),
              button: 'h-full w-full rounded-none bg-transparent shadow-none ring-0 text-muted-foreground gap-1 text-xs font-medium after:hidden',
              allowedContent: 'hidden',
            }}
            content={{
              button: (
                <>
                  <ImageUpIcon className={cn('shrink-0', value ? 'text-white' : '', shape === 'circle' ? 'h-4 w-4' : 'h-5 w-5')} />
                  {shape === 'banner' && <span className={value ? 'text-white' : ''}>{value ? 'Change banner' : 'Upload banner'}</span>}
                </>
              ),
            }}
            onUploadBegin={() => setProgress(0)}
            onUploadProgress={(p) => setProgress(p)}
            onClientUploadComplete={(res) => {
              setProgress(null);
              const url = res[0]?.url;
              if (url) onChange(url);
            }}
            onUploadError={(error) => {
              setProgress(null);
              toast.error(error.message, { duration: 5000, position: 'top-center' });
            }}
          />
        </div>

        {value && progress === null && (
          <button
            type='button'
            onClick={() => onChange(null)}
            className='bg-background text-foreground ring-foreground/10 hover:bg-destructive hover:text-destructive-foreground absolute -top-1.5 -right-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-full shadow-md ring-1 transition-colors'
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <XIcon className='h-3.5 w-3.5' />
          </button>
        )}
      </div>
    </div>
  );
}
