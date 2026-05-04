import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
};

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white',
};

export function Button({ className = '', variant = 'primary', isLoading, disabled, ...props }: Props) {
  const isDisabled = disabled || isLoading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950',
        isDisabled ? 'opacity-60 cursor-not-allowed' : '',
        variantClass[variant],
        className,
      ].join(' ')}
    >
      {isLoading ? <span className="animate-pulse">Carregando…</span> : props.children}
    </button>
  );
}

