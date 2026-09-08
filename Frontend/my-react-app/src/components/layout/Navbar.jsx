import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          Project<span>Flow</span>
        </Link>

        <div className="navbar-right">
          {user && (
            <>
              <div className="navbar-user">
                {user.picture && <img src={user.picture} alt="" className="navbar-avatar" />}
                <span className="navbar-name">{user.name}</span>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}