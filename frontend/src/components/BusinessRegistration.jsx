import React, { useRef } from 'react';
import { 
  ArrowLeft, Upload, Store, Activity, ChevronRight, 
  MessageSquare, Phone, MapPin, Link, Clock, 
  User, FileText, ShieldCheck, Check, Image as ImageIcon
} from 'lucide-react';

const BusinessRegistration = ({
  ownerRegStep,
  setOwnerRegStep,
  setLoginStep,
  newBusinessData,
  setNewBusinessData,
  ownerInfo,
  setOwnerInfo,
  handleOwnerRegistration,
  categories
}) => {

  const fileInputRef = useRef(null);
  const steps = ['Basic Info', 'Location', 'Verification'];

  // ✅ ACTUAL IMAGE UPLOAD LOGIC
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBusinessData({ ...newBusinessData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 text-left w-full font-sans [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* HEADER (No extra borders, blends with modal) */}
      <div className="flex items-center justify-between mb-10 pt-2">
        <button 
          onClick={() => setLoginStep('owner-choice')} 
          className="text-gray-400 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all bg-white/5 border border-white/5 px-4 py-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="text-right">
          <h3 className="text-2xl font-black uppercase tracking-tight text-white">
            Partner Setup
          </h3>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Local Directory</p>
        </div>
      </div>

      {/* SLEEK STEPPER */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between relative z-10 px-2">
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const isActive = ownerRegStep === stepNum;
            const isCompleted = ownerRegStep > stepNum;

            return (
              <div key={step} className="flex flex-col items-center gap-3 relative z-20">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 
                    ${isActive ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-110' : 
                      isCompleted ? 'bg-[#0a0515] border-blue-500 text-blue-500' : 
                      'bg-[#0a0515] border-white/10 text-gray-600'}`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-white/5 z-0 flex px-8">
           <div 
              className="h-full bg-blue-600 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
              style={{ width: ownerRegStep === 1 ? '0%' : ownerRegStep === 2 ? '50%' : '100%' }}
           />
        </div>
      </div>

      {/* FORM CONTENT (Directly inside modal, no nested boxes) */}
      <div className="mt-8">
        
        {/* --- STEP 1: BASICS --- */}
        {ownerRegStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
            
            {/* Logo Upload */}
            <div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <div 
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer rounded-2xl bg-white/[0.02] border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all p-6 flex flex-col items-center justify-center text-center group"
              >
                {newBusinessData.logo ? (
                  <div className="relative w-full h-32 flex items-center justify-center">
                    <img src={newBusinessData.logo} alt="Preview" className="h-full object-contain rounded-lg shadow-lg" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-sm">
                      <p className="text-white text-xs font-bold flex items-center gap-2"><Upload size={14}/> Change Logo</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-gray-500 mb-3 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                      <ImageIcon size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Upload Brand Logo</h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">PNG or JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block pl-1">Business Name <span className="text-blue-500">*</span></label>
                <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-4 focus-within:border-blue-500 focus-within:bg-blue-500/5 transition-all shadow-inner">
                  <Store className="text-gray-500 shrink-0 focus-within:text-blue-400" size={18} />
                  <input required className="bg-transparent w-full outline-none text-sm text-white ml-3 placeholder-gray-600" placeholder="e.g. Balaji Medicals" onChange={(e) => setNewBusinessData({...newBusinessData, name: e.target.value})} value={newBusinessData.name}/>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block pl-1">Category <span className="text-blue-500">*</span></label>
                <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-4 focus-within:border-blue-500 focus-within:bg-blue-500/5 transition-all shadow-inner relative">
                  <Activity className="text-gray-500 shrink-0" size={18} />
                  <select onChange={(e) => setNewBusinessData({...newBusinessData, category: e.target.value})} value={newBusinessData.category} className="bg-transparent w-full outline-none text-sm text-white ml-3 cursor-pointer appearance-none">
                    {categories.map(cat => <option key={cat.name} value={cat.name} className="bg-[#0a0515] text-white">{cat.name}</option>)}
                  </select>
                  <ChevronRight size={16} className="text-gray-600 absolute right-4 pointer-events-none rotate-90" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block pl-1">Business Email</label>
                  <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-4 focus-within:border-blue-500 focus-within:bg-blue-500/5 transition-all shadow-inner">
                    <MessageSquare className="text-gray-500 shrink-0" size={16} />
                    <input type="email" className="bg-transparent w-full outline-none text-sm text-white ml-3 placeholder-gray-600" placeholder="contact@shop.com" onChange={(e) => setNewBusinessData({...newBusinessData, email: e.target.value})} value={newBusinessData.email}/>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block pl-1">Contact Phone</label>
                  <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-4 focus-within:border-blue-500 focus-within:bg-blue-500/5 transition-all shadow-inner">
                    <Phone className="text-gray-500 shrink-0" size={16} />
                    <input type="tel" className="bg-transparent w-full outline-none text-sm text-white ml-3 placeholder-gray-600" placeholder="+91 00000 00000" onChange={(e) => setNewBusinessData({...newBusinessData, phone: e.target.value})} value={newBusinessData.phone}/>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setOwnerRegStep(2)} className="w-full mt-8 bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95">
              Next: Location <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* --- STEP 2: LOCATION --- */}
        {ownerRegStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block pl-1">Complete Address <span className="text-blue-500">*</span></label>
                <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-4 focus-within:border-blue-500 focus-within:bg-blue-500/5 transition-all shadow-inner">
                  <MapPin className="text-gray-500 shrink-0" size={18} />
                  <input className="bg-transparent w-full outline-none text-sm text-white ml-3 placeholder-gray-600" placeholder="Shop No, Street, Area, City" onChange={(e) => setNewBusinessData({...newBusinessData, location: e.target.value})} value={newBusinessData.location}/>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block pl-1">Website or Link</label>
                <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-4 focus-within:border-blue-500 focus-within:bg-blue-500/5 transition-all shadow-inner">
                  <Link className="text-gray-500 shrink-0" size={18} />
                  <input className="bg-transparent w-full outline-none text-sm text-white ml-3 placeholder-gray-600" placeholder="https://..." onChange={(e) => setNewBusinessData({...newBusinessData, website: e.target.value})} value={newBusinessData.website}/>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-inner">
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={16} className="text-gray-400"/>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Operating Hours</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest mb-2 block pl-1">Opens At</label>
                    <input type="time" className="w-full bg-[#0a0515] border border-white/10 rounded-xl p-3 outline-none text-sm text-white focus:border-blue-500 transition-all cursor-pointer" onChange={(e) => setNewBusinessData({...newBusinessData, openingTime: e.target.value})} value={newBusinessData.openingTime}/>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase text-gray-500 tracking-widest mb-2 block pl-1">Closes At</label>
                    <input type="time" className="w-full bg-[#0a0515] border border-white/10 rounded-xl p-3 outline-none text-sm text-white focus:border-blue-500 transition-all cursor-pointer" onChange={(e) => setNewBusinessData({...newBusinessData, closingTime: e.target.value})} value={newBusinessData.closingTime}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setOwnerRegStep(1)} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-white transition-all active:scale-95">Back</button>
              <button onClick={() => setOwnerRegStep(3)} className="flex-[2] bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all shadow-lg flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-95">Continue <ChevronRight size={16}/></button>
            </div>
          </div>
        )}

        {/* --- STEP 3: DETAILS & SUBMIT --- */}
        {ownerRegStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 fade-in">
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block pl-1">Owner Name</label>
                <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-4 focus-within:border-blue-500 focus-within:bg-blue-500/5 transition-all shadow-inner">
                  <User className="text-gray-500 shrink-0" size={18} />
                  <input className="bg-transparent w-full outline-none text-sm text-white ml-3 placeholder-gray-600" placeholder="e.g. Ishan" onChange={(e) => setOwnerInfo({name: e.target.value})} value={ownerInfo.name} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 block pl-1">Business Description</label>
                <div className="flex items-start bg-white/[0.03] border border-white/10 rounded-2xl p-4 focus-within:border-blue-500 focus-within:bg-blue-500/5 transition-all shadow-inner">
                  <FileText className="text-gray-500 shrink-0 mt-1" size={18} />
                  <textarea className="bg-transparent w-full outline-none text-sm text-white ml-3 h-28 resize-none placeholder-gray-600 leading-relaxed" placeholder="Describe your services..." onChange={(e) => setNewBusinessData({...newBusinessData, description: e.target.value})} value={newBusinessData.description}/>
                </div>
              </div>
            </div>
            
            {/* Clean Verification Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-4">
              <ShieldCheck size={20} className="text-blue-400 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <div>
                <p className="text-[11px] text-white font-black uppercase tracking-widest mb-1.5">Ready for Verification</p>
                <p className="text-[10px] text-blue-200/60 leading-relaxed font-medium">By submitting, you agree to the merchant terms. Our team will verify your listing before it goes live.</p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button onClick={() => setOwnerRegStep(2)} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-white transition-all active:scale-95">Back</button>
              <button 
                onClick={handleOwnerRegistration} 
                className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                Submit Listing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BusinessRegistration;