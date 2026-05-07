import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0f1a]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <Navbar sidebarCollapsed={collapsed} />
      <main
        className="pt-16 min-h-screen transition-all duration-[250ms] ease-in-out"
        style={{ paddingLeft: sidebarWidth }}
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
