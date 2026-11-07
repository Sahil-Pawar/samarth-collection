import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, Plus, Settings, List, CheckCircle2, 
  AlertCircle, Trash2, Lock, RefreshCw, LogOut, ArrowLeft,
  Sparkles, Check, Home, ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { compressImageFiles } from '../utils/imageCompressor';

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    isAdminLoggedIn,
    verifyAdmin,
    logoutAdmin,
    products,
    addProduct,
    deleteProduct,
    clearAllProducts,
    bulkUploadAndCreate,
    settings,
    saveSettings,
    triggerFestiveCelebration
  } = useStore();

  const [activeTab, setActiveTab] = useState('bulk'); // 'bulk' | 'single' | 'manage' | 'settings'

  // Admin PIN Login state
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Bulk Upload State (Phone Gallery Ready)
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkCategory, setBulkCategory] = useState('sarees');
  const [bulkSubCategory, setBulkSubCategory] = useState('बनारसी सिल्क');
  const [bulkTitlePrefix, setBulkTitlePrefix] = useState('शाही फेस्टिव्ह साडी');
  const [bulkSizes, setBulkSizes] = useState('फ्री साइज (५.५ मीटर + ब्लाउज)');
  const [bulkIsDiwaliSpecial, setBulkIsDiwaliSpecial] = useState(true);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  // Single Product Form State
  const [singleTitle, setSingleTitle] = useState('');
  const [singleCategory, setSingleCategory] = useState('sarees');
  const [singleSubCategory, setSingleSubCategory] = useState('बनारसी सिल्क');
  const [singleFabric, setSingleFabric] = useState('शुद्ध रेशीम सिल्क');
  const [singleSizes, setSingleSizes] = useState('फ्री साइज');
  const [singleStockStatus, setSingleStockStatus] = useState('उपलब्ध');
  const [singleIsDiwali, setSingleIsDiwali] = useState(true);
  const [singleImages, setSingleImages] = useState([]);
  const [singleImgUrl, setSingleImgUrl] = useState('');
  const [isSubmittingSingle, setIsSubmittingSingle] = useState(false);
  const [singleSuccessMsg, setSingleSuccessMsg] = useState('');
  const singleFileRef = useRef(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    storeName: settings.storeName || 'समर्थ कलेक्शन',
    storeLocation: settings.storeLocation || 'आडगाव  रेपाळ',
    ownerName: settings.ownerName || 'पप्पू  बागूल',
    whatsappNumber: settings.whatsappNumber || '+919260439143',
    announcement: settings.announcement || '',
    newPin: ''
  });
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [manageSearch, setManageSearch] = useState('');

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setLoginError('कृपया PIN टाका.');
      return;
    }
    setIsVerifying(true);
    setLoginError('');
    try {
      const ok = await verifyAdmin(pinInput.trim());
      if (!ok) {
        setLoginError('चुकीचा PIN आहे. केवळ अधिकृत मालकच प्रवेश करू शकतात.');
      } else {
        triggerFestiveCelebration();
      }
    } catch {
      setLoginError('पडताळणी अयशस्वी. पुन्हा प्रयत्न करा.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Bulk Files Selection (Mobile Gallery)
  const handleBulkFilesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const mapped = files.map(file => ({
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        preview: URL.createObjectURL(file)
      }));
      setBulkFiles(prev => [...prev, ...mapped]);
    }
  };

  const removeBulkFile = (index) => {
    setBulkFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Bulk Upload
  const handleBulkSubmit = async () => {
    if (bulkFiles.length === 0) {
      alert('कृपया किमान एक फोटो निवडा.');
      return;
    }

    setIsUploadingBulk(true);
    setBulkSuccessMsg('');

    try {
      // 1. Automatically compress images on the client to avoid 6MB serverless limits
      const rawFiles = bulkFiles.map(item => item.file);
      const compressedFiles = await compressImageFiles(rawFiles);

      const formData = new FormData();
      compressedFiles.forEach(file => {
        formData.append('images', file);
      });
      formData.append('defaultCategory', bulkCategory);
      formData.append('defaultSubCategory', bulkSubCategory);
      formData.append('titlePrefix', bulkTitlePrefix);
      formData.append('defaultSizes', bulkSizes);
      formData.append('isDiwaliSpecial', bulkIsDiwaliSpecial.toString());

      const res = await bulkUploadAndCreate(formData);
      setBulkSuccessMsg(`🎉 छान! ${res.count || bulkFiles.length} फोटो थेट सर्व्हरवर अपलोड झाले आणि वेबसाईटवर लाइव्ह झाले!`);
      setBulkFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      triggerFestiveCelebration();
    } catch (err) {
      alert(`फोटो अपलोड करताना अडचण आली: ${err.message}`);
    } finally {
      setIsUploadingBulk(false);
    }
  };

  // Submit Single Product
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!singleTitle.trim()) {
      alert('कृपया उत्पादनाचे नाव टाका');
      return;
    }

    setIsSubmittingSingle(true);
    setSingleSuccessMsg('');

    try {
      let finalImages = [...singleImages];

      if (singleFileRef.current && singleFileRef.current.files.length > 0) {
        const formData = new FormData();
        Array.from(singleFileRef.current.files).forEach(f => formData.append('images', f));
        const upRes = await fetch('/api/upload', { 
          method: 'POST', 
          headers: { 'x-admin-pin': localStorage.getItem('samarth_admin_pin') || 'samarth2026' },
          body: formData 
        });
        const upData = await upRes.json();
        if (upData.success && upData.files) {
          finalImages = [...finalImages, ...upData.files.map(f => f.url)];
        }
      }

      if (singleImgUrl.trim()) {
        finalImages.push(singleImgUrl.trim());
      }

      const sizesArray = singleSizes.split(',').map(s => s.trim()).filter(Boolean);

      const productPayload = {
        title: singleTitle.trim(),
        category: singleCategory,
        subCategory: singleSubCategory || (singleCategory === 'sarees' ? 'रेशीम साडी' : 'उत्सवी पोशाख'),
        fabric: singleFabric || 'उत्कृष्ट फॅब्रिक',
        sizes: sizesArray.length > 0 ? sizesArray : ['सर्व साइज उपलब्ध'],
        stockStatus: singleStockStatus,
        isDiwaliSpecial: singleIsDiwali,
        images: finalImages.length > 0 ? finalImages : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80']
      };

      await addProduct(productPayload);
      setSingleSuccessMsg('✨ उत्पादन थेट वेबसाईटवर यशस्वीरीत्या जोडले गेले!');
      triggerFestiveCelebration();

      // Reset form
      setSingleTitle('');
      setSingleFabric('');
      setSingleImages([]);
      setSingleImgUrl('');
      if (singleFileRef.current) singleFileRef.current.value = '';
    } catch (err) {
      alert(`जोडताना त्रुटी आली: ${err.message}`);
    } finally {
      setIsSubmittingSingle(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await saveSettings({
        storeName: settingsForm.storeName,
        storeLocation: settingsForm.storeLocation,
        ownerName: settingsForm.ownerName,
        whatsappNumber: settingsForm.whatsappNumber,
        announcement: settingsForm.announcement,
        ...(settingsForm.newPin ? { adminPin: settingsForm.newPin } : {})
      });

      setSettingsSuccess('✓ सेटिंग्ज व माहिती यशस्वीरीत्या अपडेट झाली!');
      setTimeout(() => setSettingsSuccess(''), 3000);
    } catch (err) {
      alert('सेव्ह करताना त्रुटी आली: ' + err.message);
    }
  };

  // If NOT logged in, show Owner Login Portal
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#161224] rounded-3xl border border-amber-500/40 p-8 sm:p-10 shadow-2xl shadow-amber-950/80 text-center space-y-6">
          
          <div className="w-20 h-20 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
            <Lock className="w-9 h-9" />
          </div>

          <div>
            <span className="font-baloo text-xs uppercase tracking-widest text-amber-400/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              केवळ अधिकृत मालकासाठी
            </span>
            <h1 className="font-rozha text-3xl font-bold rangoli-gold-text mt-3">
              समर्थ कलेक्शन
            </h1>
            <p className="font-tiro text-sm text-amber-300/90 mt-1">
              आडगाव  रेपाळ • प्रो. पप्पू  बागूल
            </p>
            <p className="font-baloo text-xs text-amber-200/60 mt-2">
              मोबाईल गॅलरीतून फोटो अपलोड करण्यासाठी आणि दुकान व्यवस्थापनासाठी गुप्त PIN टाका.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="गुप्त PIN प्रविष्ट करा"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="font-baloo w-full bg-[#201831] text-amber-100 placeholder-amber-400/40 text-center text-xl tracking-widest py-3.5 px-4 rounded-2xl border border-amber-900/70 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              autoFocus
            />

            {loginError && (
              <p className="font-baloo text-xs text-rose-400 flex items-center justify-center gap-1.5 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="font-baloo w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3.5 px-4 rounded-2xl transition shadow-lg shadow-amber-950/60 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>तपासत आहे...</span>
                </>
              ) : (
                <span>मालक पोर्टलमध्ये प्रवेश करा</span>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-amber-950/60">
            <button
              onClick={() => navigate('/')}
              className="font-baloo text-xs text-amber-400/70 hover:text-amber-200 flex items-center justify-center gap-1.5 mx-auto transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ग्राहक वेबसाईटवर परत जा</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // LOGGED IN OWNER DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 fade-in-up">
      
      {/* Top Banner / Navigation */}
      <div className="bg-[#171226] border border-amber-500/40 rounded-3xl p-4 sm:p-6 mb-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
            <div className="w-full h-full bg-[#181128] rounded-2xl flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-tiro text-xl sm:text-2xl font-bold text-amber-50">
                समर्थ कलेक्शन • मालक पॅनेल
              </h1>
              <span className="font-baloo text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                लॉगिन सक्रिय
              </span>
            </div>
            <p className="font-baloo text-xs text-amber-300/80">
              आडगाव  रेपाळ • प्रो. पप्पू  बागूल (९२६०४३९१४३)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="font-baloo text-xs bg-[#241A38] hover:bg-[#342750] text-amber-200 border border-amber-700/50 px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>ग्राहक वेबसाईट पहा</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="font-baloo text-xs bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/60 px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉग आउट</span>
          </button>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="bg-[#161224] rounded-3xl border border-amber-950 overflow-hidden shadow-2xl">
        
        {/* Navigation Tabs */}
        <div className="bg-[#181226] border-b border-amber-950/70 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
          <button
            onClick={() => setActiveTab('bulk')}
            className={`font-baloo px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition flex-shrink-0 ${
              activeTab === 'bulk'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow border border-amber-400/40'
                : 'text-amber-200/70 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-amber-300" />
            <span>📱 गॅलरीतून बल्क फोटो अपलोड (वेगवान)</span>
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`font-baloo px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition flex-shrink-0 ${
              activeTab === 'single'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow border border-amber-400/40'
                : 'text-amber-200/70 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>➕ एक नवीन कपडा जोडा</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`font-baloo px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition flex-shrink-0 ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow border border-amber-400/40'
                : 'text-amber-200/70 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <List className="w-4 h-4 text-amber-300" />
            <span>📋 चालू कपडे व्यवस्थापन ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`font-baloo px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition flex-shrink-0 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow border border-amber-400/40'
                : 'text-amber-200/70 hover:text-white hover:bg-amber-950/30'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-300" />
            <span>⚙️ व्हॉट्सअॅप व पिन सेटिंग्ज</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-8">
          
          {/* TAB 1: BULK GALLERY UPLOAD */}
          {activeTab === 'bulk' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-[#1F1731] border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
                <span className="text-2xl diya-flame">🪔</span>
                <div className="font-baloo text-xs text-amber-200/90 leading-relaxed">
                  <strong className="text-amber-300 block text-sm font-bold mb-0.5">
                    मोबाईल गॅलरीतून थेट सर्व्हरवर फोटो अपलोड करा
                  </strong>
                  तुमच्या फोन गॅलरीमधून एकाच वेळी ५, १०, २५+ कपड्यांचे फोटो निवडा. खाली योग्य विभाग निवडा आणि 
                  <strong> "सर्व फोटो थेट अपलोड करा"</strong> बटणावर क्लिक करा. सर्व फोटो त्वरित वेबसाईटवर ग्राहकांना दिसू लागतील!
                </div>
              </div>

              {bulkSuccessMsg && (
                <div className="font-baloo bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs sm:text-sm p-4 rounded-xl flex items-center gap-2 shadow">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{bulkSuccessMsg}</span>
                </div>
              )}

              {/* Tap to Pick from Phone Gallery */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-[#191328]/80 hover:bg-[#201833] rounded-3xl p-10 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-tiro font-bold text-amber-100 text-lg sm:text-xl">
                    येथे टॅप करून मोबाईल गॅलरीतील फोटो निवडा
                  </h3>
                  <p className="font-baloo text-xs sm:text-sm text-amber-400/70 mt-1">
                    JPEG, JPG, PNG, WEBP — एकाच वेळी ५० पर्यंत फोटो निवडू शकता
                  </p>
                </div>
                <button
                  type="button"
                  className="font-baloo bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold px-6 py-2.5 rounded-full border border-amber-400/50 shadow"
                >
                  📁 फोन गॅलरी उघडा
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBulkFilesSelect}
                  className="hidden"
                />
              </div>

              {/* Previews */}
              {bulkFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-baloo text-xs text-amber-200 font-semibold">
                    <span>अपलोडसाठी निवडलेले फोटो ({bulkFiles.length}):</span>
                    <button
                      onClick={() => setBulkFiles([])}
                      className="text-rose-400 hover:text-rose-300 underline"
                    >
                      सर्व काढून टाका
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-2 bg-[#1A142A] rounded-xl border border-amber-950">
                    {bulkFiles.map((item, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-amber-900/60 aspect-[3/4] bg-[#221B33]">
                        <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1 font-baloo text-[9px] text-amber-200 truncate">
                          {item.name}
                        </div>
                        <button
                          onClick={() => removeBulkFile(idx)}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full transition"
                          title="काढून टाका"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bulk Presets */}
              <div className="bg-[#1C162E] p-5 rounded-2xl border border-amber-900/50 space-y-4">
                <h4 className="font-baloo text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>अपलोड होणाऱ्या सर्व फोटोंसाठी माहिती:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                      कपड्यांचा विभाग (कॅटेगरी)
                    </label>
                    <select
                      value={bulkCategory}
                      onChange={(e) => {
                        setBulkCategory(e.target.value);
                        if (e.target.value === 'sarees') {
                          setBulkSubCategory('बनारसी सिल्क');
                          setBulkTitlePrefix('शाही फेस्टिव्ह साडी');
                        }
                        if (e.target.value === 'kids') {
                          setBulkSubCategory('मुले-मुलींचे उत्सवी कपडे');
                          setBulkTitlePrefix('दिवाळी स्पेशल किड्स वेअर');
                        }
                        if (e.target.value === 'men') {
                          setBulkSubCategory('फेस्टिव्ह शर्ट व कुर्ते');
                          setBulkTitlePrefix('पुरुष डिझायनर शर्ट');
                        }
                      }}
                      className="font-baloo w-full bg-[#271E3A] text-amber-100 text-xs rounded-xl p-2.5 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                    >
                      <option value="sarees">शाही साड्या (Sarees)</option>
                      <option value="kids">लहान मुलांचे कपडे (मुले व मुली)</option>
                      <option value="men">पुरुष कपडे (शर्ट, पँट व कुर्ते)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                      प्रकार / स्टाईल
                    </label>
                    <input
                      type="text"
                      value={bulkSubCategory}
                      onChange={(e) => setBulkSubCategory(e.target.value)}
                      placeholder="उदा. काठपदरी, कॉटन शर्ट, फ्रॉक"
                      className="font-baloo w-full bg-[#271E3A] text-amber-100 text-xs rounded-xl p-2.5 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                      नावाचे शीर्षक (नाव)
                    </label>
                    <input
                      type="text"
                      value={bulkTitlePrefix}
                      onChange={(e) => setBulkTitlePrefix(e.target.value)}
                      placeholder="उदा. समर्थ रॉयल कलेक्शन"
                      className="font-baloo w-full bg-[#271E3A] text-amber-100 text-xs rounded-xl p-2.5 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                      उपलब्ध साइज (कॉमा देऊन लिहा)
                    </label>
                    <input
                      type="text"
                      value={bulkSizes}
                      onChange={(e) => setBulkSizes(e.target.value)}
                      placeholder="फ्री साइज, S, M, L, XL, २-३ वर्षे"
                      className="font-baloo w-full bg-[#271E3A] text-amber-100 text-xs rounded-xl p-2.5 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="bulkDiwaliCheckPage"
                      checked={bulkIsDiwaliSpecial}
                      onChange={(e) => setBulkIsDiwaliSpecial(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-[#271E3A] border-amber-700 cursor-pointer"
                    />
                    <label htmlFor="bulkDiwaliCheckPage" className="font-baloo text-xs font-semibold text-amber-200 cursor-pointer flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>दिवाळी स्पेशल संग्रह म्हणून चिन्हांकित करा</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Upload Action */}
              <button
                onClick={handleBulkSubmit}
                disabled={isUploadingBulk || bulkFiles.length === 0}
                className="font-baloo w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-bold py-4 px-6 rounded-2xl shadow-xl shadow-amber-950/60 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isUploadingBulk ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{bulkFiles.length} फोटो थेट सर्व्हरवर अपलोड होत आहेत...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    <span>सर्व {bulkFiles.length > 0 ? `(${bulkFiles.length})` : ''} फोटो थेट सर्व्हरवर अपलोड करा व लाइव्ह करा</span>
                  </>
                )}
              </button>

            </div>
          )}

          {/* TAB 2: SINGLE PRODUCT ADD */}
          {activeTab === 'single' && (
            <form onSubmit={handleSingleSubmit} className="space-y-4 max-w-3xl mx-auto">
              {singleSuccessMsg && (
                <div className="font-baloo bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs sm:text-sm p-3.5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{singleSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                    पोशाखाचे नाव (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={singleTitle}
                    onChange={(e) => setSingleTitle(e.target.value)}
                    placeholder="उदा. शाही बनारसी रेशीम साडी / डिझायनर कुर्ता"
                    className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                    विभाग *
                  </label>
                  <select
                    value={singleCategory}
                    onChange={(e) => setSingleCategory(e.target.value)}
                    className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                  >
                    <option value="sarees">शाही साड्या (Sarees)</option>
                    <option value="kids">लहान मुलांचे कपडे (Kids Wear)</option>
                    <option value="men">पुरुष शर्ट व कुर्ते (Men's Wear)</option>
                  </select>
                </div>

                <div>
                  <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                    प्रकार / स्टाईल
                  </label>
                  <input
                    type="text"
                    value={singleSubCategory}
                    onChange={(e) => setSingleSubCategory(e.target.value)}
                    placeholder="उदा. कांजीवरम, सिल्क, कॉटन"
                    className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                    कापड प्रकार (Fabric)
                  </label>
                  <input
                    type="text"
                    value={singleFabric}
                    onChange={(e) => setSingleFabric(e.target.value)}
                    placeholder="उदा. शुद्ध रेशीम, सुती कॉटन"
                    className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                    उपलब्ध साइज (कॉमा देऊन लिहा)
                  </label>
                  <input
                    type="text"
                    value={singleSizes}
                    onChange={(e) => setSingleSizes(e.target.value)}
                    placeholder="फ्री साइज, S, M, L, XL"
                    className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                    फोन गॅलरीतून किंवा डिव्हाइसवरून फोटो निवडा
                  </label>
                  <input
                    ref={singleFileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs rounded-xl p-2.5 border border-amber-900/60 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                    किंवा वेब इमेज लिंक टाका
                  </label>
                  <input
                    type="url"
                    value={singleImgUrl}
                    onChange={(e) => setSingleImgUrl(e.target.value)}
                    placeholder="https://..."
                    className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="singleDiwaliPage"
                    checked={singleIsDiwali}
                    onChange={(e) => setSingleIsDiwali(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-[#1F1730] border-amber-700"
                  />
                  <label htmlFor="singleDiwaliPage" className="font-baloo text-xs font-semibold text-amber-200">
                    दिवाळी स्पेशल संग्रह म्हणून दाखवा
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingSingle}
                className="font-baloo w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition"
              >
                {isSubmittingSingle ? 'अपलोड होत आहे...' : 'वेबसाईटवर नवीन पोशाख जोडा'}
              </button>
            </form>
          )}

          {/* TAB 3: MANAGE EXISTING */}
          {activeTab === 'manage' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="संग्रहातील कपडे शोधा..."
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  className="font-baloo w-full max-w-sm bg-[#1F1730] text-amber-100 placeholder-amber-400/40 text-xs rounded-xl px-3 py-2 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                />
                <div className="flex items-center gap-3">
                  <span className="font-baloo text-xs text-amber-400/80 font-semibold">
                    एकूण: {products.length} कपडे
                  </span>
                  {products.length > 0 && (
                    <button
                      onClick={async () => {
                        if (confirm('तुम्हाला नक्की सर्व जुने कपडे आणि फोटो हटवायचे आहेत का?')) {
                          try {
                            await clearAllProducts();
                            alert('सर्व फोटो यशस्वीरीत्या हटवले गेले!');
                          } catch (e) {
                            alert('हटवताना त्रुटी: ' + e.message);
                          }
                        }
                      }}
                      className="font-baloo text-xs bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60 px-3 py-1.5 rounded-xl transition"
                    >
                      सर्व फोटो हटवा
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#1A142A] rounded-2xl border border-amber-950 overflow-hidden">
                <div className="divide-y divide-amber-950/60 max-h-[60vh] overflow-y-auto">
                  {products
                    .filter(p => !manageSearch || p.title.toLowerCase().includes(manageSearch.toLowerCase()))
                    .map((p) => {
                      const img = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '';
                      return (
                        <div key={p.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#201833] transition">
                          <div className="flex items-center gap-3">
                            <img
                              src={img}
                              alt={p.title}
                              className="w-12 h-14 object-cover rounded-lg bg-[#271E3C] flex-shrink-0"
                            />
                            <div>
                              <h4 className="font-tiro text-xs sm:text-sm font-semibold text-amber-100 line-clamp-1">
                                {p.title}
                              </h4>
                              <div className="flex items-center gap-2 font-baloo text-[11px] text-amber-400/70 mt-0.5">
                                <span className="uppercase">{p.category}</span>
                                <span>•</span>
                                <span>{p.subCategory || 'उत्सवी'}</span>
                                {p.isDiwaliSpecial && (
                                  <span className="text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/20">
                                    दिवाळी 🪔
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (confirm(`तुम्हाला नक्की "${p.title}" हटवायचे आहे का?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-950/40 transition"
                              title="हटवा (Delete)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & PIN */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl mx-auto">
              {settingsSuccess && (
                <div className="font-baloo bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs sm:text-sm p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              <div>
                <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                  दुकानाचे नाव
                </label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                  गाव / ठिकाण
                </label>
                <input
                  type="text"
                  value={settingsForm.storeLocation}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeLocation: e.target.value })}
                  className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                  प्रोप्रायटर / मालकाचे नाव
                </label>
                <input
                  type="text"
                  value={settingsForm.ownerName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                  className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                  व्हॉट्सअॅप ऑर्डर नंबर (कंट्री कोडसह)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  placeholder="+919260439143"
                  className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                />
                <p className="font-baloo text-[11px] text-amber-400/60 mt-1">
                  सर्व ग्राहकांच्या व्हॉट्सअॅप ऑर्डर्स थेट या नंबरवर येतील.
                </p>
              </div>

              <div>
                <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                  वरती धावणारी घोषणा पट्टी (Marquee Announcement)
                </label>
                <input
                  type="text"
                  value={settingsForm.announcement}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                  className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-baloo block text-xs font-semibold text-amber-300 mb-1">
                  नवीन गुप्त ॲडमीन PIN बदला (ऐच्छिक)
                </label>
                <input
                  type="password"
                  placeholder="सध्याचा PIN ठेवण्यासाठी रिकामे सोडा"
                  value={settingsForm.newPin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, newPin: e.target.value })}
                  className="font-baloo w-full bg-[#1F1730] text-amber-100 text-xs sm:text-sm rounded-xl p-3 border border-amber-900/60 focus:outline-none focus:border-amber-400"
                />
                <p className="font-baloo text-[11px] text-amber-400/60 mt-1">
                  केवळ तुम्हाला माहित असलेला गुप्त पासवर्ड ठेवा.
                </p>
              </div>

              <button
                type="submit"
                className="font-baloo w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow transition"
              >
                माहिती व सेटिंग्ज सेव्ह करा
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
