import { useCallback, useEffect, useRef, useState } from 'react';
import { projectApi } from '../api/projectApi';
import { getErrorMessage } from '../utils/errors';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [requestKey, setRequestKey] = useState(0);

  // Loading is derived: nothing has been fetched yet.
  const loading = !loaded;

  // Abort in-flight requests when the hook unmounts so an outdated response
  // never updates an unmounted component.
  const abortRef = useRef(null);

  // Initial load; `refetch()` bumps requestKey to run it again.
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    let cancelled = false;

    projectApi
      .getMyProjects({ signal: controller.signal })
      .then((data) => {
        if (cancelled || controller.signal.aborted) return;
        setProjects(data.projects ?? []);
        setLoaded(true);
        setError(null);
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError' || controller.signal.aborted) return;
        setProjects([]);
        setLoaded(true);
        setError(getErrorMessage(err));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [requestKey]);

  const refetch = useCallback(() => setRequestKey((key) => key + 1), []);

  const createProject = useCallback(async (values) => {
    const data = await projectApi.createProject(values);
    setProjects((prev) => [data.project, ...prev]);
    return data.project;
  }, []);

  const updateProject = useCallback(async (id, values) => {
    const data = await projectApi.updateProject(id, values);
    setProjects((prev) => prev.map((p) => (p._id === id ? data.project : p)));
    return data.project;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await projectApi.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  }, []);

  const addMember = useCallback(async (id, email) => {
    const data = await projectApi.addMember(id, email);
    setProjects((prev) => prev.map((p) => (p._id === id ? data.project : p)));
    return data.project;
  }, []);

  return {
    projects,
    loading,
    error,
    refetch,
    createProject,
    updateProject,
    deleteProject,
    addMember,
  };
}

export default useProjects;