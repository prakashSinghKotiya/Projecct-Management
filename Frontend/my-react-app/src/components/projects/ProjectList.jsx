import ProjectCard from './ProjectCard';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

/**
 * Grid of project cards with loading / error / empty states handled here,
 * so the Dashboard page stays focused on composition.
 *
 * Per-card action handlers (edit / add member / delete) are forwarded to
 * each ProjectCard.
 */
export default function ProjectList({
  projects,
  loading,
  error,
  onCreateClick,
  onEditProject,
  onDeleteProject,
  onAddMember,
  onActionError,
}) {
  if (loading) {
    return <Loader text="Loading projects..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        message="No projects yet. Create your first project to get started."
        action={
          <Button onClick={onCreateClick}>Create your first project</Button>
        }
      />
    );
  }

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onEdit={onEditProject}
          onDelete={onDeleteProject}
          onAddMember={onAddMember}
          onActionError={onActionError}
        />
      ))}
    </div>
  );
}
