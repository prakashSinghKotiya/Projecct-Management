import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { getErrorMessage } from '../utils/errors';
import ProjectList from '../components/projects/ProjectList';
import CreateProjectForm from '../components/projects/CreateProjectForm';
import AddMemberForm from '../components/projects/AddMemberForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    addMember,
  } = useProjects();

  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [memberProject, setMemberProject] = useState(null);
  const [actionError, setActionError] = useState('');

  const firstName = user?.name?.split(' ')[0] || 'there';

  // createProject throws on failure — the form displays the error itself,
  // so we only close the modal on success.
  const handleCreateProject = async (values) => {
    await createProject(values);
    setShowCreate(false);
  };

  // Same contract as create: the form shows the error, we close on success.
  const handleUpdateProject = async (values) => {
    await updateProject(editingProject._id, values);
    setEditingProject(null);
  };

  // Card actions run without a form, so failures are surfaced here.
  const handleDeleteProject = async (project) => {
    setActionError('');
    if (!window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(project._id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleAddMember = async (email) => {
    await addMember(memberProject._id, email);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Welcome, {firstName} 👋</h1>
          <p className="page-subtitle">Here are your projects.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>Create project</Button>
      </div>

      {actionError && <ErrorMessage message={actionError} />}

      <ProjectList
        projects={projects}
        loading={loading}
        error={error}
        onCreateClick={() => setShowCreate(true)}
        onEditProject={setEditingProject}
        onDeleteProject={handleDeleteProject}
        onAddMember={setMemberProject}
        onActionError={(err) => setActionError(getErrorMessage(err))}
      />

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create a new project">
        <CreateProjectForm
          onSubmit={handleCreateProject}
          submitLabel="Create project"
        />
      </Modal>

      <Modal
        open={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        title={`Edit "${editingProject?.name ?? ''}"`}
      >
        <CreateProjectForm
          key={editingProject?._id}
          initialValues={{ name: editingProject?.name, description: editingProject?.description }}
          submitLabel="Save changes"
          onSubmit={handleUpdateProject}
        />
      </Modal>

      <Modal
        open={Boolean(memberProject)}
        onClose={() => setMemberProject(null)}
        title={`Add member to "${memberProject?.name ?? ''}"`}
      >
        <AddMemberForm
          key={memberProject?._id}
          onSubmit={handleAddMember}
        />
      </Modal>
    </>
  );
}
