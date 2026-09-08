import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Shared layout for authenticated pages: navbar on top, page content below.
 */
export default function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="container page">
        <Outlet />
      </main>
    </div>
  );
}