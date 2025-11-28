import React, { useState, useEffect } from 'react';
import { PackageOpen, Save, RefreshCw } from 'lucide-react';
import { DEFAULT_INVENTORY_CSV } from '../constants';
import { Translation } from '../i18n';

interface Props {
  csvData: string;
  onSave: (newCsv: string) => void;
  t: Translation;
}

export const InventoryEditor: React.FC<Props> = ({ csvData, onSave, t }) => {
  const [localCsv, setLocalCsv] = useState(csvData);
  const [isOpen, setIsOpen] = useState(false);

  // Sync prop changes to local state
  useEffect(() => {
    setLocalCsv(csvData);
  }, [csvData]);

  const handleSave = () => {
    onSave(localCsv);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalCsv(DEFAULT_INVENTORY_CSV);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div 
        className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-slate-700">
          <PackageOpen className="w-5 h-5" />
          <h2 className="font-semibold">{t.inventoryTitle}</h2>
        </div>
        <span className="text-sm text-slate-500">{isOpen ? t.close : t.editCsv}</span>
      </div>

      {isOpen && (
        <div className="p-6 animate-in slide-in-from-top-4 duration-300">
          <p className="text-sm text-slate-500 mb-3">
            {t.inventoryDesc}
          </p>
          <textarea
            className="w-full h-64 p-4 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
            value={localCsv}
            onChange={(e) => setLocalCsv(e.target.value)}
            spellCheck={false}
          />
          <div className="flex gap-3 mt-4 justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {t.resetDefault}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              <Save className="w-4 h-4" />
              {t.saveInventory}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
