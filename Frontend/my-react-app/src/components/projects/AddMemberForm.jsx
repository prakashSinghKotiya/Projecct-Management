import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import { getErrorMessage } from '../../utils/errors';

/**
 * Add a team member to a project by email (owner only).
 * Props: onSubmit(email) -> promise
 */
export default function AddMemberForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter the member\'s email address');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await onSubmit(email.trim());
      setEmail('');
      setSuccess('Member added');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form form-inline" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={error} />
      {success && <div className="success-banner">{success}</div>}

      <div className="inline-row">
        <Input
          name="memberEmail"
          type="email"
          placeholder="member@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" loading={submitting}>
          Add member
        </Button>
      </div>
    </form>
  );
}