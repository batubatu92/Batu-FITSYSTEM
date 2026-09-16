import { useEffect, useState } from 'react';
import type { UserProfile } from '../../types';

interface Props {
  profile: UserProfile;
  onSave: (next: Omit<UserProfile, 'updatedAt'>) => Promise<void>;
}

const GOALS = ['Perder grasa', 'Ganar músculo', 'Rendimiento deportivo', 'Salud general'];
const LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

export function ProfileForm({ profile, onSave }: Props) {
  const [goal, setGoal] = useState(profile.goal ?? '');
  const [trainingLevel, setTrainingLevel] = useState(profile.trainingLevel ?? '');
  const [restrictions, setRestrictions] = useState(profile.restrictions ?? '');
  const [notes, setNotes] = useState(profile.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGoal(profile.goal ?? '');
    setTrainingLevel(profile.trainingLevel ?? '');
    setRestrictions(profile.restrictions ?? '');
    setNotes(profile.notes ?? '');
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave({ goal, trainingLevel, restrictions, notes });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-base-border bg-base-surface p-4 shadow-lg shadow-black/30">
      <span className="font-semibold text-slate-200">Tu perfil</span>
      <p className="text-xs text-slate-500">
        Esto lo usa Batu AI Coach para personalizar sus recomendaciones.
      </p>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Objetivo
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="rounded-lg border border-base-border bg-base-bg p-2 text-slate-100"
        >
          <option value="">Sin especificar</option>
          {GOALS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Nivel de entrenamiento
        <select
          value={trainingLevel}
          onChange={(e) => setTrainingLevel(e.target.value)}
          className="rounded-lg border border-base-border bg-base-bg p-2 text-slate-100"
        >
          <option value="">Sin especificar</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Restricciones (alergias, lesiones, alimentos que evitas...)
        <textarea
          value={restrictions}
          onChange={(e) => setRestrictions(e.target.value)}
          rows={2}
          className="rounded-lg border border-base-border bg-base-bg p-2 text-slate-100"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Notas para Batu AI Coach
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="rounded-lg border border-base-border bg-base-bg p-2 text-slate-100"
        />
      </label>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-lg bg-gradient-to-r from-flame-from to-flame-to py-2 text-sm font-semibold text-base-bg shadow-md shadow-black/30 disabled:opacity-60"
      >
        {saving ? 'Guardando…' : saved ? 'Guardado ✓' : 'Guardar perfil'}
      </button>
    </section>
  );
}
