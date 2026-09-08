/**
 * Inline error banner. Receives a plain message string
 * (components get it via getErrorMessage()).
 */
export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert">
      {message}
    </div>
  );
}