import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import { getErrorMessage } from '../../utils/errors';

/**
 * Project form — used for BOTH creating a project (no initialValues) and
 * editing one (pass initialValues + submitLabel).
 *
 * Props:
 *   onSubmit(values) -> promise. Called with { name, description }.
 *   initialValues    -> { name, description } when editing.
 *   submitLabel      -> button text, e.g. "Create project" / "Save changes".
 */
export default function CreateProjectForm({ onSubmit, initialValues = {}, submitLabel = 'Create project' }) {
  const [name, setName] = useState(initialValues.name ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Project name is required';
    else if (name.trim().length < 3) next.name = 'Name must be at least 3 characters';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setApiError('');
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={apiError} />

      <Input
        name="name"
        label="Project name"
        placeholder="e.g. Marketing Website"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <Input
        name="description"
        label="Description"
        placeholder="What is this project about?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />

      <div className="form-actions">
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}