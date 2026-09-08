import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { computeProjectProgress } from '../../utils/taskStatus';
import Button from '../common/Button';

/**
 * Card for one project on the dashboard.
 *
 * Shows name, description, member count and a live progress bar.
 * The progress bar comes from the project's tasks, so the card loads
 * its own task list through useTasks(project.id) — the same hook the
 * ProjectDetails page uses.
 *
 * Owner-only quick actions (Edit / Add member / Delete) sit in their own
 * row below the title, outside the link so clicking them never navigates.
 * The handlers come from the Dashboard, which owns the modals and
 * useProjects mutations — they receive the full project object.
 */

// Extract a comparable user id from either a populated member/owner doc
// ({ _id, name, ... }) or a plain ObjectId string (list endpoints often
// return unpopulated ids).
function docId(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value._id ?? value.id ?? null;
}

export default function ProjectCard({ project, onEdit, onDelete, onAddMember }) {
  const { user } = useAuth();
  const { tasks } = useTasks(project._id);
  const progress = computeProjectProgress(tasks);
  const memberCount = project.members?.length ?? 0;

  // Owner check: the owner id (populated doc or raw string) matches the
  // logged-in user, OR the user's id appears in the members list (covers
  // backends that return an unpopulated owner on the list endpoint).
  // Falls back to showing actions when the user id is unknown, matching
  // the behavior of ProjectDetails.
  const userId = user?._id;
  const isOwner = userId
    ? docId(project.owner) === userId ||
      (project.members ?? []).some((m) => docId(m) === userId)
    : true;

  const projectUrl = `/projects/${project._id}`;

  return (
    <div className="project-card">
      <div className="project-card-top">
        <Link to={projectUrl} className="project-card-link">
          <h3 className="project-card-name">{project.name}</h3>
        </Link>

        <span className="project-card-members">
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </span>
      </div>

      {isOwner && (
        <div className="project-card-actions">
          <Button variant="secondary" onClick={() => onEdit(project)} title="Edit project">
            Edit
          </Button>
          <Button variant="secondary" onClick={() => onAddMember(project)} title="Add member">
            + Member
          </Button>
          <Button variant="danger" onClick={() => onDelete(project)} title="Delete project">
            Delete
          </Button>
        </div>
      )}

      <Link to={projectUrl} className="project-card-link project-card-body">
        {project.description && (
          <p className="project-card-desc">{project.description}</p>
        )}

        <div className="project-card-progress">
          <div className="progress-meta">
            <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
            <span>{progress}% completed</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </Link>
    </div>
  );
}
