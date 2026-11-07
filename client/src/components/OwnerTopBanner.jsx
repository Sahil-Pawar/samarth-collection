import React from 'react';
import { UploadCloud, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function OwnerTopBanner() {
  const { isAdminLoggedIn, setIsAdminOpen, logoutAdmin } = useStore();
  const navigate = useNavigate();

  // If not logged in as owner, render NOTHING
  if (!isAdminLoggedIn) return null;

  return (
    <div className="bg-gradient-to-r from-amber-950 via-[#271A12] to-amber-950 border-b border-amber-500/50 text-amber-100 py-1.5 px-3 sm:px-6 flex items-center justify-between text-xs font-baloo shadow-lg z-50 sticky top-0">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="font-bold text-amber-200 flex items-center gap-1.5">
          <span>👑 मालक मोड: पप्पू  बागूल (समर्थ कलेक्शन, आडगाव  रेपाळ)</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-3 py-1 rounded-full flex items-center gap-1 text-[11px] shadow transition hover:scale-105"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>+ फोटो अपलोड</span>
        </button>

        <button
          onClick={() => navigate('/admin')}
          className="hidden sm:flex bg-[#231833] hover:bg-[#34244D] text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded-full items-center gap-1 text-[11px] transition"
        >
          <Settings className="w-3 h-3" />
          <span>डॅशबोर्ड</span>
        </button>

        <button
          onClick={logoutAdmin}
          className="bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/50 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] transition"
          title="मालक मोड बंद करा"
        >
          <LogOut className="w-3 h-3" />
          <span>लॉग आउट</span>
        </button>
      </div>
    </div>
  );
}
