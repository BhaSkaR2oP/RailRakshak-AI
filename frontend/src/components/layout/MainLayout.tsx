import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-surface)' }}>
      <Sidebar />
      <main
        className="flex-1 min-h-screen p-6"
        style={{
          marginLeft: 'var(--sidebar-width)',
          marginTop: 'var(--topbar-height)',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
