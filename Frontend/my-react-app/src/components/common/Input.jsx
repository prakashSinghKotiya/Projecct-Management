/**
 * Labeled input with an optional inline error message.
 *
 *   <Input label="Email" type="email" value={email}
 *          onChange={...} error={errors.email} />
 */
export default function Input({ label, error, className = '', id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={error ? 'input-error' : ''} {...rest} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}