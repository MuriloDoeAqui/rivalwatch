import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';

type FormState = { email: string; password: string };

export function LoginPage() {
  const { login, clearError, isLoading, user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null;
    return state?.from?.pathname ?? '/app';
  }, [location.state]);

  // 🔥 REDIRECT CERTO (SÓ AQUI)
  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, isLoading, navigate, redirectTo]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    try {
      await login({
        email: form.email,
        password: form.password,
      });

      push({
        variant: 'success',
        title: 'Login realizado',
        description: 'Bem-vindo de volta!',
      });

      // ❌ NÃO TEM navigate AQUI (IMPORTANTE)
    } catch (err) {
      push({
        variant: 'error',
        title: 'Não foi possível entrar',
        description:
          err instanceof Error
            ? err.message
            : 'Verifique email e senha e tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Entrar</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Acesse seu painel do RivalWatch.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm((s) => ({ ...s, email: e.target.value }))
            }
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) =>
              setForm((s) => ({ ...s, password: e.target.value }))
            }
          />

          <Button
            type="submit"
            isLoading={isSubmitting || isLoading}
            className="w-full"
          >
            Entrar
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Não tem conta?{' '}
            <Link
              to="/register"
              className="text-indigo-300 hover:text-indigo-200"
            >
              Criar agora
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}