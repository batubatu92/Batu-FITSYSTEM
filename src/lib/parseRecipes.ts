export interface Recipe {
  title: string;
  kcal?: number;
  minutes?: number;
  satiety?: 'baja' | 'moderada' | 'alta';
  ingredients: string[];
  steps: string[];
}

export type MessagePart = { type: 'text'; text: string } | { type: 'recipe'; recipe: Recipe };

const RECIPE_BLOCK = /```recipe\s*([\s\S]*?)```/g;

function isRecipe(value: unknown): value is Recipe {
  const v = value as Partial<Recipe> | null;
  return (
    !!v &&
    typeof v.title === 'string' &&
    Array.isArray(v.ingredients) &&
    Array.isArray(v.steps)
  );
}

export function parseMessageParts(content: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(RECIPE_BLOCK)) {
    const [full, jsonText] = match;
    const index = match.index ?? 0;

    const before = content.slice(lastIndex, index).trim();
    if (before) parts.push({ type: 'text', text: before });

    try {
      const parsed = JSON.parse(jsonText);
      if (isRecipe(parsed)) {
        parts.push({ type: 'recipe', recipe: parsed });
      } else {
        parts.push({ type: 'text', text: full });
      }
    } catch {
      parts.push({ type: 'text', text: full });
    }

    lastIndex = index + full.length;
  }

  const rest = content.slice(lastIndex).trim();
  if (rest) parts.push({ type: 'text', text: rest });

  return parts.length ? parts : [{ type: 'text', text: content }];
}
