import { useCallback, useEffect, useRef, useState } from 'react';
import { taskApi } from '../api/taskApi';
import { getErrorMessage } from '../utils/errors';

/**
 * Tasks for a single project.
 *
 *   const { tasks, loading, error, createTask, updateTask, deleteTask } =
 *     useTasks(projectId);
 *
 * The list is refetched whenever `projectId` changes (or `refetch()` is
 * called). Mutations update local state immediately and re-throw errors
 * for the forms to display.
 */
export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loadedProjectId, setLoadedProjectId] = useState(null);
  const [error, setError] = useState(null);
  const [requestKey, setRequestKey] = useState(0);

  // Loading is derived: the current project's tasks have not been fetched yet.
  const loading = !projectId || loadedProjectId !== projectId;

  // Abort in-flight requests when the hook unmounts so an outdated response
  // never updates an unmounted component.
  const abortRef = useRef(null);

  useEffect(() => {
    if (!projectId) return undefined;
    const controller = new AbortController();
    abortRef.current = controller;
    let cancelled = false;

    taskApi
      .getTasks(projectId, { signal: controller.signal })
      .then((data) => {
        if (cancelled || controller.signal.aborted) return;
        setTasks(data.tasks ?? []);
        setLoadedProjectId(projectId);
        setError(null);
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError' || controller.signal.aborted) return;
        setTasks([]);
        setLoadedProjectId(projectId);
        setError(getErrorMessage(err));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [projectId, requestKey]);

  const refetch = useCallback(() => setRequestKey((key) => key + 1), []);

  const createTask = useCallback(
    async (values) => {
      const data = await taskApi.createTask(projectId, values);
      setTasks((prev) => [data.task, ...prev]);
      return data.task;
    },
    [projectId]
  );

  const updateTask = useCallback(async (taskId, values) => {
    const data = await taskApi.updateTask(taskId, values);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
    return data.task;
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    await taskApi.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
  };
}

export default useTasks;