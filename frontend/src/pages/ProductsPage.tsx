import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi, supplierApi, stockMovementApi } from '../services/api';
import type { ProductCreateDto, ProductUpdateDto, StockMovementCreateDto } from '../types';
import Modal from '../components/Modal';
import StockBadge from '../components/StockBadge';

export default function ProductsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [modal, setModal] = useState<'create' | 'edit' | 'movement' | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<ProductCreateDto>({
    name: '', sku: '', description: '', price: 0, stockQuantity: 0, minStockLevel: 0, categoryId: 0, supplierId: 0,
  });
  const [movementForm, setMovementForm] = useState<StockMovementCreateDto>({ productId: 0, type: 0, quantity: 1, reason: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search, categoryFilter],
    queryFn: () => productApi.getAll(page, 10, search || undefined, categoryFilter),
  });

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.getAll });
  const { data: suppliers = [] } = useQuery({ queryKey: ['suppliers'], queryFn: supplierApi.getAll });

  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ProductUpdateDto }) => productApi.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  const movementMutation = useMutation({
    mutationFn: stockMovementApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); closeModal(); },
  });

  const closeModal = () => { setModal(null); setEditId(null); };

  const openCreate = () => {
    setProductForm({ name: '', sku: '', description: '', price: 0, stockQuantity: 0, minStockLevel: 0, categoryId: categories[0]?.id ?? 0, supplierId: suppliers[0]?.id ?? 0 });
    setModal('create');
  };

  const openEdit = (p: typeof data extends undefined ? never : NonNullable<typeof data>['items'][0]) => {
    setEditId(p.id);
    setProductForm({ name: p.name, sku: p.sku, description: p.description ?? '', price: p.price, stockQuantity: p.stockQuantity, minStockLevel: p.minStockLevel, categoryId: p.categoryId, supplierId: p.supplierId });
    setModal('edit');
  };

  const openMovement = (productId: number) => {
    setMovementForm({ productId, type: 0, quantity: 1, reason: '' });
    setModal('movement');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === 'create') createMutation.mutate(productForm);
    else if (modal === 'edit' && editId) {
      const { stockQuantity, ...updateDto } = productForm;
      updateMutation.mutate({ id: editId, dto: updateDto });
    }
  };

  const handleMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    movementMutation.mutate(movementForm);
  };

  const products = data?.items ?? [];
  const totalPages = data ? Math.ceil(data.totalCount / 10) : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Ürünler</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          + Yeni Ürün
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ürün veya SKU ara..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={categoryFilter ?? ''}
          onChange={e => { setCategoryFilter(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Yükleniyor...</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Ürün', 'SKU', 'Kategori', 'Tedarikçi', 'Fiyat', 'Stok', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-slate-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 text-slate-500">{p.categoryName}</td>
                    <td className="px-4 py-3 text-slate-500">{p.supplierName}</td>
                    <td className="px-4 py-3 text-slate-700">₺{p.price.toLocaleString('tr-TR')}</td>
                    <td className="px-4 py-3"><StockBadge quantity={p.stockQuantity} isLowStock={p.isLowStock} /></td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openMovement(p.id)} className="text-green-600 hover:underline mr-3 text-xs">Stok</button>
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline mr-3 text-xs">Düzenle</button>
                      <button onClick={() => deleteMutation.mutate(p.id)} className="text-red-500 hover:underline text-xs">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
              <span>Toplam {data?.totalCount} ürün</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-slate-100">‹</button>
                <span className="px-3 py-1">{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-slate-100">›</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Product Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'create' ? 'Yeni Ürün' : 'Ürün Düzenle'} onClose={closeModal}>
          <form onSubmit={handleProductSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ad</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">SKU</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={productForm.sku} onChange={e => setProductForm(f => ({ ...f, sku: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Fiyat (₺)</label>
                <input type="number" min="0" step="0.01" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: Number(e.target.value) }))} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Min. Stok</label>
                <input type="number" min="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={productForm.minStockLevel} onChange={e => setProductForm(f => ({ ...f, minStockLevel: Number(e.target.value) }))} required />
              </div>
              {modal === 'create' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Başlangıç Stoku</label>
                  <input type="number" min="0" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={productForm.stockQuantity} onChange={e => setProductForm(f => ({ ...f, stockQuantity: Number(e.target.value) }))} required />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Kategori</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={productForm.categoryId} onChange={e => setProductForm(f => ({ ...f, categoryId: Number(e.target.value) }))} required>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tedarikçi</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={productForm.supplierId} onChange={e => setProductForm(f => ({ ...f, supplierId: Number(e.target.value) }))} required>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Açıklama</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={productForm.description ?? ''} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Kaydet</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stock Movement Modal */}
      {modal === 'movement' && (
        <Modal title="Stok Hareketi" onClose={closeModal}>
          <form onSubmit={handleMovementSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">İşlem Türü</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" checked={movementForm.type === 0} onChange={() => setMovementForm(f => ({ ...f, type: 0 }))} />
                  <span className="text-sm text-green-700 font-medium">Stok Girişi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" checked={movementForm.type === 1} onChange={() => setMovementForm(f => ({ ...f, type: 1 }))} />
                  <span className="text-sm text-red-700 font-medium">Stok Çıkışı</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Miktar</label>
              <input type="number" min="1" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={movementForm.quantity} onChange={e => setMovementForm(f => ({ ...f, quantity: Number(e.target.value) }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Neden</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={movementForm.reason ?? ''} onChange={e => setMovementForm(f => ({ ...f, reason: e.target.value }))} placeholder="Opsiyonel" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Uygula</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
