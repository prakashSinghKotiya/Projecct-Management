/**
 * Friendly empty-state block with an optional action button.
 */
export default function EmptyState({ message, action }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {action}
    </div>
  );
}