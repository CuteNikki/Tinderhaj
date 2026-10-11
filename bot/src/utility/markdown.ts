/** Discord's markdown in a name, shown as typed rather than formatting the message. */
export function escapeMarkdown(text: string) {
  return text.replace(/[\\*_~`|>#[\]]/g, '\\$&');
}

/** A name in inline code, e.g. `🛡️︱mod-chat`. One with a backtick in it is wrapped in two, so it can't end the code early. */
export function code(text: string) {
  return text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``;
}

/** "a", "a and b", "a, b and c". */
export function listOf(items: string[]) {
  return items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : (items[0] ?? '');
}

/** Mentions of everyone in a list, as "@a, @b and @c". */
export function mentionList(ids: string[]) {
  return listOf(ids.map((id) => `<@${id}>`));
}
