import TaskCard from './TaskCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

/**
 * Task list for a project with loading / error / empty states.
 * Per-card handlers (status change / edit / delete) are forwarded to each TaskCard.
 */
export default function TaskList({ tasks, loading, error, onUpdateStatus, onEdit, onDelete }) {
  if (loading) {
    return <Loader text="Loading tasks..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (tasks.length === 0) {
    return <EmptyState message="No tasks yet. Create the first task for this project." />;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}