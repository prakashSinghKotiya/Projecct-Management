import { PROGRESS_CLASS, PROGRESS_OPTIONS, getProgressLabel } from '../../utils/taskStatus';

/**
 * Task progress indicator.
 *
 *   <TaskStatus value={task.progress} />            -> badge only
 *   <TaskStatus value={task.progress} onChange={...} /> -> badge + select
 *
 * The select is what lets users change a task's status inline.
 */
export default function TaskStatus({ value, onChange, disabled = false }) {
  const label = getProgressLabel(value);
  const statusClass = PROGRESS_CLASS[value] || 'status-new';

  if (!onChange) {
    return <span className={`status-badge ${statusClass}`}>{label}</span>;
  }

  return (
    <label className="status-select">
      <span className={`status-badge ${statusClass}`}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Change task status"
        disabled={disabled}
      >
        {PROGRESS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}