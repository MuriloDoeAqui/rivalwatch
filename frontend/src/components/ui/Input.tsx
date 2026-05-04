import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
};

export function Input({ label, error, className = '', id, ...props }: Props) {
  const inputId = id ?? props.name ?? label;
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-200">{label}</span>
      <input
        id={inputId}
        {...props}
        className={[
          'w-full rounded-md border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500',
          'border-zinc-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30' : '',
          className,
        ].join(' ')}
      />
      {error ? <span className="mt-1 block text-xs text-rose-400">{error}</span> : null}
    </label>
  );
}

