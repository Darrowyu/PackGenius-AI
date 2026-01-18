import { useState, useEffect, useMemo } from 'react';
import { PackageOpen, Plus, Trash2, Upload, X, Pencil, Search, Check } from 'lucide-react';
import { BoxItem } from '@/types';
import { api } from '@/lib/api';
import { Translation } from '@/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  inventory: BoxItem[];
  onInventoryChange: (items: BoxItem[]) => void;
  t: Translation;
  defaultOpen?: boolean;
}

export const InventoryEditor: React.FC<Props> = ({ inventory, onInventoryChange, t, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newBox, setNewBox] = useState({ id: '', length: '', width: '', height: '' });
  const [csvText, setCsvText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBox, setEditBox] = useState({ length: '', width: '', height: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const filteredInventory = useMemo(() => {
    if (!searchTerm) return inventory;
    const term = searchTerm.toLowerCase();
    return inventory.filter(box => 
      box.id.toLowerCase().includes(term) ||
      String(box.length).includes(term) ||
      String(box.width).includes(term) ||
      String(box.height).includes(term)
    );
  }, [inventory, searchTerm]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const items = await api.get<BoxItem[]>('/inventory');
      onInventoryChange(items);
    } catch (e) {
      console.error('Failed to fetch inventory:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleAdd = async () => {
    if (!newBox.id || !newBox.length || !newBox.width || !newBox.height) {
      showToast(t.fillAllFields, 'error');
      return;
    }
    try {
      await api.post('/inventory', {
        id: newBox.id,
        length: parseFloat(newBox.length),
        width: parseFloat(newBox.width),
        height: parseFloat(newBox.height)
      });
      setNewBox({ id: '', length: '', width: '', height: '' });
      setShowAddForm(false);
      showToast(t.addSuccess);
      fetchInventory();
    } catch (e) {
      console.error('Failed to add box:', e);
      showToast(t.addFailed, 'error');
    }
  };

  const handleEdit = (box: BoxItem) => {
    setEditingId(box.id);
    setEditBox({ length: String(box.length), width: String(box.width), height: String(box.height) });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.post('/inventory', {
        id,
        length: parseFloat(editBox.length),
        width: parseFloat(editBox.width),
        height: parseFloat(editBox.height)
      });
      setEditingId(null);
      showToast(t.updateSuccess);
      fetchInventory();
    } catch (e) {
      console.error('Failed to update box:', e);
      showToast(t.updateFailed, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      await api.delete(`/inventory/${id}`);
      showToast(t.deleteSuccess);
      fetchInventory();
    } catch (e) {
      console.error('Failed to delete box:', e);
      showToast(t.deleteFailed, 'error');
    }
  };

  const handleImport = async () => {
    const lines = csvText.trim().split('\n').filter(l => l.trim());
    const items = lines.map(line => {
      const [id, length, width, height] = line.split(',').map(s => s.trim());
      return { id, length: parseFloat(length), width: parseFloat(width), height: parseFloat(height) };
    }).filter(item => item.id && !isNaN(item.length) && !isNaN(item.width) && !isNaN(item.height));
    if (items.length === 0) {
      showToast(t.fillAllFields, 'error');
      return;
    }
    try {
      await api.post('/inventory', items);
      setCsvText('');
      setShowImportDialog(false);
      showToast(`${t.importSuccess} (${items.length})`);
      fetchInventory();
    } catch (e) {
      console.error('Failed to import:', e);
      showToast(t.importFailed, 'error');
    }
  };


  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
      {/* Toast 提示 */}
      {toast && (
        <div className={`absolute top-2 right-2 z-50 px-3 py-2 rounded-lg text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <PackageOpen className="w-5 h-5" />
          <h2 className="font-semibold">{t.inventoryTitle}</h2>
          <span className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full">{inventory.length}</span>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{isOpen ? t.close : t.editCsv}</span>
      </div>
      {isOpen && (
        <div className="p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="gap-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">
              <Plus className="w-4 h-4" />{t.addBox}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowImportDialog(true)} className="gap-1 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
              <Upload className="w-4 h-4" />{t.importCsv}
            </Button>
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder={t.search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 h-8 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" />
              </div>
            </div>
          </div>
          {showAddForm && (
            <div className="flex gap-2 mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg flex-wrap items-center">
              <Input placeholder="ID" value={newBox.id} onChange={e => setNewBox({...newBox, id: e.target.value})} className="w-24 dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 h-8 text-sm" />
              <Input type="number" placeholder={t.length} value={newBox.length} onChange={e => setNewBox({...newBox, length: e.target.value})} className="w-20 dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 h-8 text-sm" />
              <Input type="number" placeholder={t.width} value={newBox.width} onChange={e => setNewBox({...newBox, width: e.target.value})} className="w-20 dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 h-8 text-sm" />
              <Input type="number" placeholder={t.height} value={newBox.height} onChange={e => setNewBox({...newBox, height: e.target.value})} className="w-20 dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 h-8 text-sm" />
              <Button size="sm" onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white h-8">{t.addBox}</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)} className="dark:text-slate-400 dark:hover:bg-slate-600 h-8 w-8 p-0"><X className="w-4 h-4" /></Button>
            </div>
          )}
          {loading ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">{t.loadingInventory}</p>
          ) : filteredInventory.length === 0 ? (
            <p className="text-center text-slate-400 dark:text-slate-500 py-8">{searchTerm ? t.noSearchResults : t.noInventory}</p>
          ) : (
            <div className="rounded-md border border-slate-200 dark:border-slate-700 max-h-[400px] overflow-auto">
              <Table>
                <TableHeader className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10">
                  <TableRow className="hover:bg-slate-100 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <TableHead className="w-[120px] dark:text-slate-300">{t.boxId}</TableHead>
                    <TableHead className="text-right dark:text-slate-300">{t.length}</TableHead>
                    <TableHead className="text-right dark:text-slate-300">{t.width}</TableHead>
                    <TableHead className="text-right dark:text-slate-300">{t.height}</TableHead>
                    <TableHead className="text-center dark:text-slate-300">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map(box => (
                    <TableRow key={box.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700/50">
                      <TableCell className="font-mono text-xs dark:text-slate-300 py-2">
                        {box.id}
                      </TableCell>
                      {editingId === box.id ? (
                        <>
                          <TableCell className="p-1"><Input type="number" value={editBox.length} onChange={e => setEditBox({...editBox, length: e.target.value})} className="w-full h-7 text-right dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 font-mono text-xs" /></TableCell>
                          <TableCell className="p-1"><Input type="number" value={editBox.width} onChange={e => setEditBox({...editBox, width: e.target.value})} className="w-full h-7 text-right dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 font-mono text-xs" /></TableCell>
                          <TableCell className="p-1"><Input type="number" value={editBox.height} onChange={e => setEditBox({...editBox, height: e.target.value})} className="w-full h-7 text-right dark:bg-slate-600 dark:border-slate-500 dark:text-slate-100 font-mono text-xs" /></TableCell>
                          <TableCell className="p-1 text-center">
                            <div className="flex justify-center gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30" onClick={() => handleSaveEdit(box.id)}><Check className="w-3.5 h-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 dark:text-slate-400" onClick={() => setEditingId(null)}><X className="w-3.5 h-3.5" /></Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-right font-mono text-xs dark:text-slate-300 py-2">{box.length}</TableCell>
                          <TableCell className="text-right font-mono text-xs dark:text-slate-300 py-2">{box.width}</TableCell>
                          <TableCell className="text-right font-mono text-xs dark:text-slate-300 py-2">{box.height}</TableCell>
                          <TableCell className="text-center py-2">
                            <div className="flex justify-center gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => handleEdit(box)}><Pencil className="w-3.5 h-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => handleDelete(box.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-slate-100">{t.importCsv}</DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">{t.importCsvDesc}</DialogDescription>
          </DialogHeader>
          <textarea className="w-full h-40 p-3 text-sm font-mono border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100" value={csvText} onChange={e => setCsvText(e.target.value)} placeholder="BOX-001,200,150,100&#10;BOX-002,300,200,150" />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowImportDialog(false)} className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">{t.cancel}</Button>
            <Button onClick={handleImport} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white">{t.import}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
