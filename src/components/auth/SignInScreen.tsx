interface Props {
  onSignIn: () => void;
}

export function SignInScreen({ onSignIn }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Batu Fit System</h1>
        <p className="mt-2 text-slate-400">Disciplina diaria, medida.</p>
      </div>
      <button
        onClick={onSignIn}
        className="rounded-full bg-accent px-6 py-3 font-semibold text-base-bg transition hover:brightness-110"
      >
        Entrar con Google
      </button>
    </div>
  );
}
