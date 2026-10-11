/** When the `index`th of an auth form's fields and buttons comes in: one after another, each rising (see Enter). */
export function fieldDelay(index: number) {
  return 0.05 + index * 0.06;
}
