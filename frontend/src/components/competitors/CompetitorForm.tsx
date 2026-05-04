import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { normalizeAndValidateWebsite } from '../../utils/url';

export type CompetitorFormValues = { name: string; website: string };

export function CompetitorForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: {
  initialValues?: CompetitorFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: CompetitorFormValues) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<CompetitorFormValues>(initialValues ?? { name: '', website: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof CompetitorFormValues, string>>>({});

  useEffect(() => {
    setValues(initialValues ?? { name: '', website: '' });
    setErrors({});
  }, [initialValues?.name, initialValues?.website]);

  const canSubmit = useMemo(() => values.name.trim().length > 0 && values.website.trim().length > 0, [values]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: Partial<Record<keyof CompetitorFormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = 'Informe um nome.';

    const websiteResult = normalizeAndValidateWebsite(values.website);
    if (!websiteResult.ok) nextErrors.website = websiteResult.error;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit({ name: values.name.trim(), website: websiteResult.ok ? websiteResult.url : values.website.trim() });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        label="Nome"
        name="name"
        value={values.name}
        onChange={(e) => setValues((s) => ({ ...s, name: e.target.value }))}
        placeholder="Ex: Concorrente X"
        error={errors.name}
        disabled={isSubmitting}
      />
      <Input
        label="Website"
        name="website"
        value={values.website}
        onChange={(e) => setValues((s) => ({ ...s, website: e.target.value }))}
        placeholder="https://exemplo.com"
        error={errors.website}
        disabled={isSubmitting}
      />

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

