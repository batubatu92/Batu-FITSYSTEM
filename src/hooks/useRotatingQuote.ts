import { useState } from 'react';
import { getRandomQuote } from '../lib/quotes';

const LAST_INDEX_KEY = 'batu:lastQuoteIndex';

export function useRotatingQuote(): string {
  const [quote] = useState(() => {
    const stored = Number(localStorage.getItem(LAST_INDEX_KEY));
    const { quote, index } = getRandomQuote(Number.isFinite(stored) ? stored : undefined);
    localStorage.setItem(LAST_INDEX_KEY, String(index));
    return quote;
  });

  return quote;
}
