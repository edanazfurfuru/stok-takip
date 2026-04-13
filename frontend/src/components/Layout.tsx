import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Ürünler', icon: '📦' },
  { to: '/categories', label: 'Kategoriler', icon: '🏷️' },
  { to: '/suppliers', label: 'Tedarikçiler', icon: '🏭' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-800">StokTakip</h1>
          <p className="text-xs text-slate-500 mt-0.5">Envanter Yönetimi</p>
        </div>
        <nav className="flex-1 p-3">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
