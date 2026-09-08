/**
 * Task progress values — must match the backend Task model enum exactly:
 *   ["new", "started-working", "half-completed", "testing", "completed"]
 */

export const PROGRESS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'started-working', label: 'Started working' },
  { value: 'half-completed', label: 'Half completed' },
  { value: 'testing', label: 'Testing' },
  { value: 'completed', label: 'Completed' },
];

// Simple CSS-class map for the status badges (defined in index.css).
export const PROGRESS_CLASS = {
  'new': 'status-new',
  'started-working': 'status-started',
  'half-completed': 'status-half',
  'testing': 'status-testing',
  'completed': 'status-completed',
};

export function getProgressLabel(value) {
  const option = PROGRESS_OPTIONS.find((o) => o.value === value);
  return option ? option.label : value;
}

/**
 * Compute project progress (0-100) from its tasks.
 * A project with no tasks reports 0%.
 */
export function computeProjectProgress(tasks = []) {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.progress === 'completed').length;
  return Math.round((done / tasks.length) * 100);
}