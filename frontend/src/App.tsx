import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold text-indigo-600">StokTakip</span>
            <div className="flex gap-6">
              {[
                { to: '/', label: 'Dashboard' },
                { to: '/products', label: 'Ürünler' },
                { to: '/categories', label: 'Kategoriler' },
                { to: '/suppliers', label: 'Tedarikçiler' },
                { to: '/movements', label: 'Hareketler' },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                        : 'text-gray-500 hover:text-gray-900'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
      <p className="text-gray-400 mt-2">Bu sayfa yakında hazır olacak.</p>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<ComingSoon title="Dashboard" />} />
            <Route path="/products" element={<ComingSoon title="Ürünler" />} />
            <Route path="/categories" element={<ComingSoon title="Kategoriler" />} />
            <Route path="/suppliers" element={<ComingSoon title="Tedarikçiler" />} />
            <Route path="/movements" element={<ComingSoon title="Stok Hareketleri" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
