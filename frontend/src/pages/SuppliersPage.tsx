import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '../services/api';
import type { SupplierCreateDto } from '../types';
import Modal from '../components/Modal';

export default function SuppliersPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<SupplierCreateDto>({ name: '', contactPerson: '', email: '', phone: '' });

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: supplierApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['suppliers'] }); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: SupplierCreateDto }) => supplierApi.update(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['suppliers'] }); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: supplierApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });

  const openCreate = () => { setForm({ name: '', contactPerson: '', email: '', phone: '' }); setModal('create'); };
  const openEdit = (s: typeof suppliers[0]) => {
    setEditId(s.id);
    setForm({ name: s.name, contactPerson: s.contactPerson ?? '', email: s.email ?? '', phone: s.phone ?? '' });
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === 'create') createMutation.mutate(form);
    else if (modal === 'edit' && editId) updateMutation.mutate({ id: editId, dto: form });
  };

  const field = (label: string, key: keyof SupplierCreateDto, required = false) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form[key] ?? ''}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        required={required}
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Tedarikçiler</h2>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          + Yeni Tedarikçi
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Yükleniyor...</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Ad', 'İletişim Kişisi', 'E-posta', 'Telefon', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-600 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                  <td className="px-4 py-3 text-slate-500">{s.contactPerson ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{s.email ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{s.phone ?? '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(s)} className="text-blue-600 hover:underline mr-3">Düzenle</button>
                    <button onClick={() => deleteMutation.mutate(s.id)} className="text-red-500 hover:underline">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'create' ? 'Yeni Tedarikçi' : 'Tedarikçi Düzenle'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {field('Ad', 'name', true)}
            {field('İletişim Kişisi', 'contactPerson')}
            {field('E-posta', 'email')}
            {field('Telefon', 'phone')}
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
