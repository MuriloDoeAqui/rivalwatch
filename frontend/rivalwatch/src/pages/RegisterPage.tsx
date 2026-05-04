import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';

type FormState = { email: string; password: string; confirmPassword: string };

export function RegisterPage() {
  const { register, error, clearError } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (form.password !== form.confirmPassword) {
      setLocalError('As senhas não coincidem.');
      push({ variant: 'error', title: 'Verifique sua senha', description: 'As senhas não coincidem.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ email: form.email, password: form.password });
      push({ variant: 'success', title: 'Conta criada', description: 'Seu acesso foi criado com sucesso.' });
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao cadastrar.';
      setLocalError(message);
      push({ variant: 'error', title: 'Não foi possível criar sua conta', description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Criar conta</h1>
          <p className="mt-2 text-sm text-zinc-400">Comece a monitorar seus concorrentes.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          />
          <Input
            label="Confirmar senha"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))}
          />

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Criar conta
          </Button>

          <p className="text-center text-sm text-zinc-400">
            Já tem conta?{' '}
            <Link to="/login" className="text-indigo-300 hover:text-indigo-200">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

