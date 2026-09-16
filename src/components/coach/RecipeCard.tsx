import type { Recipe } from '../../lib/parseRecipes';

const SATIETY_LABEL: Record<string, string> = {
  baja: 'Saciedad baja',
  moderada: 'Saciedad moderada',
  alta: 'Saciedad alta',
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="max-w-[92%] rounded-xl border border-base-border bg-base-surface p-4 shadow-lg shadow-black/30">
      <p className="text-xs uppercase tracking-wide text-slate-400">Receta</p>
      <h3 className="mt-1 text-lg font-bold text-slate-50">{recipe.title}</h3>

      <div className="mt-2 flex flex-wrap gap-2">
        {recipe.kcal != null && (
          <span className="rounded-full border border-base-border px-2 py-1 text-xs text-slate-300">
            {recipe.kcal} kcal
          </span>
        )}
        {recipe.minutes != null && (
          <span className="rounded-full border border-base-border px-2 py-1 text-xs text-slate-300">
            {recipe.minutes} min
          </span>
        )}
        {recipe.satiety && (
          <span className="rounded-full border border-accent/40 px-2 py-1 text-xs text-accent">
            {SATIETY_LABEL[recipe.satiety] ?? recipe.satiety}
          </span>
        )}
      </div>

      <h4 className="mt-4 font-semibold text-slate-200">Ingredientes</h4>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h4 className="mt-4 font-semibold text-slate-200">Preparación</h4>
      <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-300">
        {recipe.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
