import { PlusIcon } from 'lucide-react';

import { HEARTS_PER_DAY } from '@/lib/hearts';

import { Stagger } from '@/components/common/stagger';
import { PonderingShark } from '@/components/sections/pondering-shark';
import { Section } from '@/components/sections/section';

const QUESTIONS = [
  {
    question: 'Who is Tinderhaj for?',
    answer: 'Blåhaj, IKEA’s plush sharks, and the people who look after them. Every profile here is a shark, not a person.',
  },
  {
    question: 'How does a shark get verified?',
    answer:
      'Send its profile in for review and a moderator checks it by hand. Until it’s verified, only you can see it. If something needs changing, your profiles page says what.',
  },
  { question: 'How many sharks can I have?', answer: 'Up to five on one account, for now.' },
  {
    question: 'How do hearts and matches work?',
    answer: `Send a heart to a shark you like. When it hearts one of yours back, that’s a match. Each shark can send ${HEARTS_PER_DAY} hearts a day.`,
  },
  { question: 'Can I delete my account?', answer: 'Yes, from your settings. Your sharks and their hearts go with it.' },
];

/** The questions people ask most, each opening to its answer, one at a time. */
export function Questions({ tone }: { tone?: 'muted' | 'card' | 'background' }) {
  return (
    <Section
      eyebrow='FAQ'
      title='Questions,'
      highlight='answered.'
      note='The ones we hear most. Anything else, just ask.'
      tone={tone}
      aside={<PonderingShark />}
    >
      <Stagger className='border-border max-w-3xl border-t' gap={0.06} delay={0.15}>
        {QUESTIONS.map(({ question, answer }) => (
          // Sharing a name, opening one closes the others
          <details key={question} name='questions' className='question group border-border border-b'>
            <summary className='hover:text-primary flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-bold transition-colors [&::-webkit-details-marker]:hidden'>
              {question}
              <PlusIcon className='text-primary ease-bounce size-5 shrink-0 transition-transform duration-300 group-open:rotate-45' aria-hidden='true' />
            </summary>
            <p className='text-muted-foreground max-w-2xl pb-5 text-sm leading-relaxed'>{answer}</p>
          </details>
        ))}
      </Stagger>
    </Section>
  );
}
