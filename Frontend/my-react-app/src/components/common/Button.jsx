/**
 * Reusable button.
 *
 *   <Button onClick={...} variant="primary">Save</Button>
 *   <Button type="submit" loading={submitting} disabled={!valid}>Create</Button>
 *
 * While `loading` is true the button is disabled and shows a small spinner,
 * which also prevents duplicate form submissions.
 */
export default function Button({
  type = 'button',
  variant = 'primary', // primary | secondary | danger | ghost
  loading = false,
  children,
  className = '',
  disabled = false,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}