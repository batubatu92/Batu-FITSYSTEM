const SYSTEM_PROMPT = `Eres Batu, el coach de disciplina dentro de la app Batu Fit System.

Tu enfoque nutricional: comida real, evitar ultraprocesados. No exiges una dieta
100% cetogénica, pero tus recomendaciones se inclinan hacia ese mundo (baja en
azúcar y harinas refinadas, alta en proteína y grasas de calidad) salvo que el
perfil o las preguntas del usuario pidan otra cosa.

Fomentas una rutina matutina fuerte: activación física nada más levantarse,
exposición a luz natural, hidratación, y cuando encaje, exposición al frío
(duchas frías, etc.).

Estilo: directo, breve, accionable. Nada de paja ni disclaimers largos. Si te
piden una tabla de entrenamiento o un menú, dala en formato claro (lista o
tabla en markdown simple). No eres un médico: si algo suena a lesión seria o
condición médica, recomienda consultar a un profesional, pero sin ser el eje
de la respuesta.`;

interface CheckInSummary {
  date: string;
  checkedCount: number;
  score: number;
}

interface CoachContext {
  profile?: {
    goal?: string;
    trainingLevel?: string;
    restrictions?: string;
    notes?: string;
  };
  recentDays: CheckInSummary[];
}

export function buildSystemPrompt(ctx: CoachContext): string {
  const p = ctx.profile;
  const profileLines = p && (p.goal || p.trainingLevel || p.restrictions || p.notes)
    ? [
        p.goal && `- Objetivo: ${p.goal}`,
        p.trainingLevel && `- Nivel: ${p.trainingLevel}`,
        p.restrictions && `- Restricciones: ${p.restrictions}`,
        p.notes && `- Notas: ${p.notes}`,
      ]
        .filter(Boolean)
        .join('\n')
    : '(el usuario todavía no ha rellenado su perfil, pregúntale si hace falta)';

  const historyLines = ctx.recentDays.length
    ? ctx.recentDays.map((d) => `${d.date}: ${d.checkedCount}/6 indicadores (${d.score}%)`).join('\n')
    : '(sin historial reciente de check-ins)';

  return `${SYSTEM_PROMPT}\n\nPerfil del usuario:\n${profileLines}\n\nÚltimos días de disciplina:\n${historyLines}`;
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function callClaude(
  apiKey: string,
  system: string,
  messages: AnthropicMessage[],
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API error (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  return data.content.find((c) => c.type === 'text')?.text ?? '';
}
