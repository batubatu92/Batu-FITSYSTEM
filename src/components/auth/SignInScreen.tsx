interface Props {
  onSignIn: () => void;
  authError?: string | null;
}

export function SignInScreen({ onSignIn, authError }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Batu Fit System</h1>
        <p className="mt-2 text-slate-300">Disciplina diaria, medida.</p>
      </div>
      <button
        onClick={onSignIn}
        className="rounded-full bg-gradient-to-r from-flame-from to-flame-to px-6 py-3 font-semibold text-base-bg shadow-lg shadow-black/30 transition hover:brightness-110"
      >
        Entrar con Google
      </button>
      {authError && (
        <p className="max-w-xs break-words rounded-lg border border-red-900 bg-red-950/50 p-3 text-xs text-red-300">
          {authError}
        </p>
      )}
    </div>
  );
}
