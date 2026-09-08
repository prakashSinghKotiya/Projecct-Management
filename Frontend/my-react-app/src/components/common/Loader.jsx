/**
 * Small spinner with optional text, e.g. <Loader text="Loading projects..." />
 */
export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader">
      <span className="spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}