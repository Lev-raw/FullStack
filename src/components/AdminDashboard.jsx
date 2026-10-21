import { NavLink, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-heading">
          <span>INTABCAPA</span>
          <h1>Content studio</h1>
        </div>
        <nav aria-label="CMS sections">
          <NavLink to="/admin/about" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            About &amp; INTABCAPA Saga
          </NavLink>
          <NavLink to="/admin/pulse" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Pulse &amp; Page
          </NavLink>
          <NavLink to="/admin/sections/hero" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Hero
          </NavLink>
          <NavLink to="/admin/sections/showtime" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Showtime
          </NavLink>
          <NavLink to="/admin/sections/performanceSpaces" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Performance Spaces
          </NavLink>
          <NavLink to="/admin/sections/legacyLibrary" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Legacy Library
          </NavLink>
          <NavLink to="/admin/sections/culinaryExperience" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Culinary Experience
          </NavLink>
        </nav>
        <a className="admin-site-link" href="/">← View website</a>
      </aside>
      <div className="admin-dashboard-content">
        <Outlet />
      </div>
    </main>
  );
}

export default AdminDashboard;
