import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi, supplierApi } from '../services/api';
import StockBadge from '../components/StockBadge';

export default function DashboardPage() {
  const { data: productsPage } = useQuery({ queryKey: ['products', 1, '', undefined], queryFn: () => productApi.getAll(1, 1000) });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.getAll });
  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: supplierApi.getAll });
  const { data: lowStock = [] } = useQuery({ queryKey: ['low-stock'], queryFn: productApi.getLowStock });

  const products = productsPage?.items ?? [];

  const stats = [
    { label: 'Toplam Ürün', value: productsPage?.totalCount ?? 0, icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'Kategori', value: categories.length, icon: '🏷️', color: 'bg-purple-50 text-purple-700' },
    { label: 'Tedarikçi', value: suppliers.length, icon: '🏭', color: 'bg-green-50 text-green-700' },
    { label: 'Düşük Stok', value: lowStock.length, icon: '⚠️', color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`rounded-xl p-5 ${s.color.split(' ')[0]} border border-slate-200`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-red-700 mb-3">⚠️ Düşük Stok Uyarısı</h3>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{p.name} <span className="text-slate-400 font-mono text-xs">({p.sku})</span></span>
                <StockBadge quantity={p.stockQuantity} isLowStock={p.isLowStock} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Products */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Ürünler</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Ürün', 'Kategori', 'Fiyat', 'Stok'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 8).map(p => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-3 text-slate-500">{p.categoryName}</td>
                <td className="px-4 py-3 text-slate-700">₺{p.price.toLocaleString('tr-TR')}</td>
                <td className="px-4 py-3"><StockBadge quantity={p.stockQuantity} isLowStock={p.isLowStock} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
