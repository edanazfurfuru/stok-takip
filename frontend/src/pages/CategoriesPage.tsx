import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../services/api';
import type { CategoryCreateDto } from '../types';
import Modal from '../components/Modal';

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryCreateDto>({ name: '', description: '' });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CategoryCreateDto }) => categoryApi.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  const openCreate = () => { setForm({ name: '', description: '' }); setModal('create'); };
  const openEdit = (id: number, name: string, description?: string) => {
    setEditId(id); setForm({ name, description: description ?? '' }); setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === 'create') createMutation.mutate(form);
    else if (modal === 'edit' && editId) updateMutation.mutate({ id: editId, dto: form });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Kategoriler</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          + Yeni Kategori
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Yükleniyor...</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Ad</th>
                <th className="text-left px-4 py-3 text-slate-600 font-medium">Açıklama</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.description ?? '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(c.id, c.name, c.description)} className="text-blue-600 hover:underline mr-3">Düzenle</button>
                    <button onClick={() => deleteMutation.mutate(c.id)} className="text-red-500 hover:underline">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'Yeni Kategori' : 'Kategori Düzenle'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
              <input
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.description ?? ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Kaydet</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
