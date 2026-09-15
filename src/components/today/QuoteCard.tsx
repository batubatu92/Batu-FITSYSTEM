interface Props {
  quote: string;
}

export function QuoteCard({ quote }: Props) {
  return (
    <blockquote className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center text-sm italic text-slate-200">
      “{quote}”
    </blockquote>
  );
}
