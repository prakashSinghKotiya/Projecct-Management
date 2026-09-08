import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? No need for the register page.
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    else if (form.name.trim().length < 3) next.name = 'Name must be at least 3 characters';

    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Enter a valid email address';

    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 4) next.password = 'Password must be at least 4 characters';


    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setApiError('');
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      // The backend does not log you in on registration — send the user
      // to the login page with a confirmation message.
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join ProjectFlow and start collaborating</p>

        <ErrorMessage message={apiError} />

        <form className="form" onSubmit={handleSubmit} noValidate>
          <Input
            name="name"
            label="Full name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={setField('name')}
            error={errors.name}
            autoComplete="name"
          />

          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={setField('email')}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="At least 4 characters"
            value={form.password}
            onChange={setField('password')}
            error={errors.password}
            autoComplete="new-password"
          />

          <Button type="submit" loading={submitting} className="btn-block">
            Register
          </Button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}