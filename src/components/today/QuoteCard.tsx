interface Props {
  quote: string;
}

export function QuoteCard({ quote }: Props) {
  return (
    <blockquote className="rounded-xl border border-accent/30 bg-gradient-to-br from-flame-from/10 to-flame-to/10 p-4 text-center text-sm italic text-slate-200 shadow-lg shadow-black/20">
      “{quote}”
    </blockquote>
  );
}
