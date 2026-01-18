import { usePackagingStore } from '@/stores/packaging-store';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { InventoryEditor } from '@/components/features/InventoryEditor';

export function InventoryPage() {
  const t = useAppTranslation();
  const { inventory, setInventory } = usePackagingStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.inventoryTitle}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t.inventoryPageDesc}</p>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <InventoryEditor 
          inventory={inventory} 
          onInventoryChange={setInventory} 
          t={t}
          defaultOpen
        />
      </div>
    </div>
  );
}
