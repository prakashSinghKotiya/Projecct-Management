import { useState } from 'react';
import TaskStatus from './TaskStatus';
import Button from '../common/Button';
import { formatDate } from '../../utils/format';

/**
 * One task card: title + status in the header, description and meta in the
 * body, and an Edit / Delete action row in the footer (separated by a
 * divider so the actions never crowd the content).
 *
 *   - Status select updates the task inline (onUpdateStatus).
 *   - Edit opens the edit modal via onEdit(task) — the parent owns the modal.
 *   - Delete asks for confirmation before calling onDelete.
 */
export default function TaskCard({ task, onUpdateStatus, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Errors from onUpdateStatus are handled by the parent (shown on the page).
  const handleStatusChange = async (progress) => {
    if (progress === task.progress) return;
    setUpdating(true);
    try {
      await onUpdateStatus(task._id, { progress });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setDeleting(false);
    }
  };

  const assignee = task.assignedTo?.name || null;

  return (
    <div className="task-card">
      <div className="task-card-head">
        <h4 className="task-title">{task.title}</h4>
        <TaskStatus value={task.progress} onChange={handleStatusChange} disabled={updating} />
      </div>

      <div className="task-card-main">
        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-meta">
          <span>
            <strong>Assigned to:</strong>{' '}
            {assignee ? assignee : <em>Unassigned</em>}
          </span>
          <span>Created {formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className="task-card-actions">
        <Button
          variant="secondary"
          className="btn-sm"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          Edit
        </Button>
        <Button variant="danger" className="btn-sm" loading={deleting} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
