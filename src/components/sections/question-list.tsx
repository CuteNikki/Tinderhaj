'use client';

import { PlusIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';

import { spring } from '@/lib/motion';

import { Stagger } from '@/components/common/stagger';
import { cn } from '@/lib/utils';

/**
 * Questions opening to their answers, one at a time, each sliding open and
 * shut. Slid by Motion rather than CSS, so it slides in every browser, Safari
 * too. Closed answers stay in the page, just folded away.
 */
export function QuestionList({ questions }: { questions: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Stagger className='border-border max-w-3xl border-t' gap={0.06} delay={0.15}>
      {questions.map(({ question, answer }, index) => (
        <Question key={question} question={question} answer={answer} open={open === index} onToggle={() => setOpen(open === index ? null : index)} />
      ))}
    </Stagger>
  );
}

function Question({ question, answer, open, onToggle }: { question: string; answer: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  // Height isn't movement Motion leaves out for those who ask for less, so it's left out here
  const reduceMotion = useReducedMotion();

  return (
    <div className='border-border border-b'>
      <button
        type='button'
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className='hover:text-primary flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-bold transition-colors'
      >
        {question}
        <PlusIcon className={cn('text-primary ease-bounce size-5 shrink-0 transition-transform duration-300', open && 'rotate-45')} aria-hidden='true' />
      </button>
      <motion.div
        id={id}
        role='region'
        aria-label={question}
        inert={!open}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0 } : spring.soft}
        className='overflow-hidden'
      >
        <p className='text-muted-foreground max-w-2xl pb-5 text-sm leading-relaxed'>{answer}</p>
      </motion.div>
    </div>
  );
}
