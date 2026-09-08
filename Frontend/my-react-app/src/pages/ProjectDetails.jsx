import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { projectApi } from '../api/projectApi';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { getErrorMessage } from '../utils/errors';
import { computeProjectProgress } from '../utils/taskStatus';

import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import CreateProjectForm from '../components/projects/CreateProjectForm';
import AddMemberForm from '../components/projects/AddMemberForm';
import TaskList from '../components/tasks/TaskList';
import CreateTaskForm from '../components/tasks/CreateTaskForm';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Single-project data (fetched locally — the dashboard hook is for lists).
  const [project, setProject] = useState(null);
  const [projectError, setProjectError] = useState('');

  // Loading is derived: no project is loaded for the current projectId yet.
  const projectLoading = !project || project._id !== projectId;

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(projectId);

  const [showEdit, setShowEdit] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [actionError, setActionError] = useState('');

  // Task mutations re-throw from the hook — surface failures on the page
  // instead of swallowing them. (Defined before the early returns so the
  // hooks are always called in the same order.)
  const handleUpdateTaskStatus = useCallback(
    async (taskId, values) => {
      setActionError('');
      try {
        await updateTask(taskId, values);
      } catch (err) {
        setActionError(getErrorMessage(err));
      }
    },
    [updateTask]
  );

  const handleEditTask = async (values) => {
    // updateTask throws on failure — the edit form displays the error itself,
    // so we only close the modal on success.
    await updateTask(editingTask._id, values);
    setEditingTask(null);
  };

  const handleDeleteTask = useCallback(
    async (taskId) => {
      setActionError('');
      try {
        await deleteTask(taskId);
      } catch (err) {
        setActionError(getErrorMessage(err));
      }
    },
    [deleteTask]
  );

  useEffect(() => {
    if (!projectId) return undefined;
    const controller = new AbortController();
    let cancelled = false;

    projectApi
      .getProject(projectId, { signal: controller.signal })
      .then((data) => {
        if (cancelled) return;
        setProject(data.project);
        setProjectError('');
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError') return;
        setProject(null);
        setProjectError(getErrorMessage(err));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [projectId]);

  if (projectLoading) {
    return <Loader text="Loading project..." />;
  }

  if (projectError) {
    return (
      <div className="page">
        <ErrorMessage message={projectError} />
        <Link to="/" className="back-link">← Back to dashboard</Link>
      </div>
    );
  }

  const isOwner = project?.owner?._id === user?._id;
  const progress = computeProjectProgress(tasks);

  const handleEditProject = async (values) => {
    // projectApi.updateProject throws on failure — the form displays the error.
    const data = await projectApi.updateProject(project._id, values);
    setProject(data.project);
    setShowEdit(false);
  };

  const handleDeleteProject = async () => {
    if (!window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
    setActionError('');
    try {
      await projectApi.deleteProject(project._id);
      navigate('/');
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleAddMember = async (email) => {
    const data = await projectApi.addMember(project._id, email);
    setProject(data.project);
  };

  return (
    <div className="project-details">
      <Link to="/" className="back-link">← Back to dashboard</Link>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>{project.name}</h1>
          {project.description && <p className="page-subtitle">{project.description}</p>}
          <p className="project-owner">
            Owner: {project.owner?.name || 'Unknown'}
          </p>
        </div>
        <div className="header-actions">
          {isOwner && (
            <>
              <Button variant="secondary" onClick={() => setShowEdit(true)}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDeleteProject}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {actionError && <ErrorMessage message={actionError} />}

      {/* Progress summary */}
      <section className="panel">
        <div className="panel-title">Progress</div>
        <div className="progress-meta">
          <span>{progress}% completed</span>
          <span>
            {tasks.filter((t) => t.progress === 'completed').length} of {tasks.length} tasks done
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <div className="details-grid">
        {/* Tasks */}
        <section className="panel">
          <div className="panel-title">Tasks</div>
          <CreateTaskForm members={project.members || []} onSubmit={createTask} />
          <hr className="panel-divider" />
          <TaskList
            tasks={tasks}
            loading={tasksLoading}
            error={tasksError}
            onUpdateStatus={handleUpdateTaskStatus}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
          />
        </section>

        {/* Members */}
        <section className="panel">
          <div className="panel-title">Team members</div>
          <ul className="member-list">
            {(project.members || []).map((member) => (
              <li key={member._id} className="member-row">
                <span className="member-avatar">
                  {member.name?.charAt(0).toUpperCase() || '?'}
                </span>
                <div>
                  <div className="member-name">{member.name}</div>
                  <div className="member-email">{member.email}</div>
                </div>
                {isOwner && member._id === project.owner?._id && (
                  <span className="owner-tag">Owner</span>
                )}
              </li>
            ))}
          </ul>

          {isOwner && (
            <div className="panel-subsection">
              <div className="panel-subtitle">Add a member</div>
              <AddMemberForm onSubmit={handleAddMember} />
            </div>
          )}
        </section>
      </div>

      {/* Edit project modal (owner only) */}
      {isOwner && (
        <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit project">
          <CreateProjectForm
            initialValues={{ name: project.name, description: project.description }}
            submitLabel="Save changes"
            onSubmit={handleEditProject}
          />
        </Modal>
      )}

      {/* Edit task modal */}
      <Modal
        open={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        title={`Edit task "${editingTask?.title ?? ''}"`}
      >
        <CreateTaskForm
          key={editingTask?._id}
          members={project.members || []}
          initialValues={{
            title: editingTask?.title,
            description: editingTask?.description,
            // assignedTo may be a populated user doc or a raw id string
            assignedTo: editingTask?.assignedTo?._id ?? editingTask?.assignedTo ?? '',
            progress: editingTask?.progress,
          }}
          submitLabel="Save changes"
          onSubmit={handleEditTask}
        />
      </Modal>
    </div>
  );
}