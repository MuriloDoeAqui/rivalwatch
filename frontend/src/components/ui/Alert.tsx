export function Alert({
  variant = 'error',
  title,
  description,
}: {
  variant?: 'error' | 'info' | 'success';
  title: string;
  description?: string;
}) {
  const styles =
    variant === 'success'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
      : variant === 'info'
        ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200'
        : 'border-rose-500/30 bg-rose-500/10 text-rose-200';

  return (
    <div className={['rounded-md border px-4 py-3 text-sm', styles].join(' ')}>
      <div className="font-semibold">{title}</div>
      {description ? <div className="mt-1 text-xs opacity-90">{description}</div> : null}
    </div>
  );
}

