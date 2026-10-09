import { Fragment } from 'react';

const WEB_ADDRESS = /(https?:\/\/\S+)/;

/**
 * Text someone wrote, with its web addresses as links that open in a new tab.
 * Only http and https: anything else, HTML included, stays text.
 */
export function LinkedText({ text }: { text: string }) {
  // Splitting on a group keeps the addresses, at every odd index.
  return text.split(WEB_ADDRESS).map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;

    // Punctuation right after an address usually ends the sentence, not the address.
    const [, address, after] = part.match(/^(.*?)([.,!?;:)\]]*)$/) ?? [part, part, ''];
    if (!URL.canParse(address)) return <Fragment key={index}>{part}</Fragment>;

    return (
      <Fragment key={index}>
        <a href={address} target='_blank' rel='noopener noreferrer nofollow ugc' className='text-foreground font-medium break-all underline'>
          {address}
        </a>
        {after}
      </Fragment>
    );
  });
}
