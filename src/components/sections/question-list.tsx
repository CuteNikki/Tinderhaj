'use client';

import { useId, useState } from 'react';

import { PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Stagger } from '@/components/common/stagger';

/**
 * Questions opening to their answers, one at a time, each sliding open and
 * shut. Slid by growing a grid row from nothing to its content's height,
 * which every browser can do, Safari too, unlike animating to `height: auto`.
 * Closed answers stay in the page, just folded away.
 */
export function QuestionList({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Stagger
      className='max-w-3xl border-t border-border'
      gap={0.06}
      delay={0.15}
    >
      {questions.map(({ question, answer }, index) => (
        <Question
          key={question}
          question={question}
          answer={answer}
          open={open === index}
          onToggle={() => setOpen(open === index ? null : index)}
        />
      ))}
    </Stagger>
  );
}

function Question({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();

  return (
    <div className='border-b border-border'>
      <button
        type='button'
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className='flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-bold transition-colors hover:text-primary'
      >
        {question}
        <PlusIcon
          className={cn(
            'size-5 shrink-0 text-primary transition-transform duration-300 ease-bounce',
            open && 'rotate-45'
          )}
          aria-hidden='true'
        />
      </button>
      <div
        id={id}
        role='region'
        aria-label={question}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-590 ease-(--spring-soft)',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className='min-h-0 overflow-hidden'>
          <p className='max-w-2xl pb-5 text-sm leading-relaxed text-muted-foreground'>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
