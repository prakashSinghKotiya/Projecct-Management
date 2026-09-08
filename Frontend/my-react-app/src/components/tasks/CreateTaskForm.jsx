import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import { getErrorMessage } from '../../utils/errors';
import { PROGRESS_OPTIONS } from '../../utils/taskStatus';

/**
 * Task form — used for BOTH creating a task (no initialValues) and
 * editing one (pass initialValues + submitLabel), mirroring
 * CreateProjectForm.
 *
 * Props:
 *   members       -> array of { _id, name } to fill the "assigned to" select
 *   initialValues -> { title, description, assignedTo, progress } when editing
 *   submitLabel   -> button text, e.g. "Create task" / "Save changes"
 *   onSubmit(values) -> promise; receives { title, description, assignedTo, progress }
 */
export default function CreateTaskForm({
  members = [],
  initialValues = {},
  submitLabel = 'Create task',
  onSubmit,
}) {
  const [title, setTitle] = useState(initialValues.title ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [assignedTo, setAssignedTo] = useState(initialValues.assignedTo ?? '');
  const [progress, setProgress] = useState(initialValues.progress ?? 'new');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = 'Task title is required';
    else if (title.trim().length < 3) next.title = 'Title must be at least 3 characters';
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
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        // Empty string -> null so the task is created unassigned.
        assignedTo: assignedTo || null,
        progress,
      });
      // Reset the form on success so creating multiple tasks is quick.
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setProgress('new');
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
        name="title"
        label="Task title"
        placeholder="e.g. Design the landing page"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <Input
        name="taskDescription"
        label="Description"
        placeholder="What needs to be done?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="field">
        <label htmlFor="assignedTo">Assigned to</label>
        <select
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Unassigned</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="taskProgress">Status</label>
        <select
          id="taskProgress"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        >
          {PROGRESS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}