import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Store, Users, BarChart3, Settings, 
  LogOut, Bell, Search, CheckCircle, XCircle, FileText, 
  DollarSign, TrendingUp, Eye, ShieldAlert, MapPin, 
  ShieldCheck, Hourglass, X, Mail, Phone, Calendar,
  UserCheck, UserX, Activity, PieChart, ArrowUpRight, ArrowDownRight, Smartphone, Monitor
} from "lucide-react";

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [merchantFilter, setMerchantFilter] = useState("All");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  
  // Real-time Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Modal State
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  // REALISTIC MUTABLE DATA - MERCHANTS
  const [merchants, setMerchants] = useState([
    { id: "M-1042", name: "Alpha Gadgets", owner: "Rahul Sharma", email: "alpha@test.com", phone: "+91 9876543210", category: "Electronics", loc: "Vesu, Surat", status: "Pending", date: "10 Apr 2026", revenue: "₹0" },
    { id: "M-1043", name: "Urban Kicks", owner: "Priya Patel", email: "urban@test.com", phone: "+91 9123456789", category: "Shopping", loc: "CG Road, Ahmedabad", status: "Approved", date: "09 Apr 2026", revenue: "₹45,200" },
    { id: "M-1044", name: "FitLife Gym", owner: "Amit Singh", email: "fit@test.com", phone: "+91 9988776655", category: "Fitness", loc: "Alkapuri, Vadodara", status: "Rejected", date: "08 Apr 2026", revenue: "₹0" },
    { id: "M-1045", name: "Cafe Mocha", owner: "Neha Desai", email: "cafe@test.com", phone: "+91 9876511111", category: "Cafe", loc: "Adajan, Surat", status: "Approved", date: "07 Apr 2026", revenue: "₹12,450" },
    { id: "M-1046", name: "City Hospital", owner: "Dr. Mehta", email: "city@test.com", phone: "+91 9999988888", category: "Medical", loc: "Varachha, Surat", status: "Pending", date: "06 Apr 2026", revenue: "₹0" },
    { id: "M-1047", name: "Balaji Medicals", owner: "Suresh P.", email: "balaji@test.com", phone: "+91 9898000000", category: "Medical", loc: "Varachha, Surat", status: "Approved", date: "02 Apr 2026", revenue: "₹89,000" },
  ]);

  // REALISTIC MUTABLE DATA - USERS
  const [usersList, setUsersList] = useState([
    { id: "U-881", name: "Ishan Rajput", email: "ishan@test.com", phone: "+91 9876500001", role: "Customer", status: "Active", joined: "15 Mar 2026" },
    { id: "U-882", name: "Sneha Kapoor", email: "sneha.k@test.com", phone: "+91 9876500002", role: "Customer", status: "Active", joined: "22 Mar 2026" },
    { id: "U-883", name: "Amitabh Raj", email: "amit.r@test.com", phone: "+91 9876500003", role: "Customer", status: "Banned", joined: "01 Apr 2026" },
    { id: "U-884", name: "Vikram Singh", email: "vikram@test.com", phone: "+91 9876500004", role: "Customer", status: "Active", joined: "05 Apr 2026" },
    { id: "U-885", name: "Pooja Desai", email: "pooja.d@test.com", phone: "+91 9876500005", role: "Customer", status: "Active", joined: "09 Apr 2026" },
  ]);

  // Dummy Analytics Data
  const chartData = [40, 65, 45, 80, 55, 90, 75, 100, 85, 120, 95, 110];
  const categoryStats = [
    { name: "Medical", percentage: 45, color: "bg-blue-500", glow: "shadow-blue-500/50" },
    { name: "Food & Cafe", percentage: 70, color: "bg-green-500", glow: "shadow-green-500/50" },
    { name: "Shopping", percentage: 35, color: "bg-purple-500", glow: "shadow-purple-500/50" },
    { name: "Fitness", percentage: 20, color: "bg-yellow-500", glow: "shadow-yellow-500/50" },
  ];

  // Live Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleApprove = (id) => {
    setMerchants(merchants.map(m => m.id === id ? { ...m, status: "Approved" } : m));
    showNotification(`Business ${id} has been Approved!`, "success");
  };

  const handleReject = (id) => {
    setMerchants(merchants.map(m => m.id === id ? { ...m, status: "Rejected" } : m));
    showNotification(`Business ${id} has been Rejected.`, "error");
  };

  const toggleUserStatus = (id) => {
    setUsersList(usersList.map(u => {
        if(u.id === id) {
            const newStatus = u.status === "Active" ? "Banned" : "Active";
            showNotification(`User ${u.name} is now ${newStatus}.`, newStatus === "Active" ? "success" : "error");
            return { ...u, status: newStatus };
        }
        return u;
    }));
  };

  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = merchantFilter === "All" || m.status === merchantFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05010d] text-white flex font-sans selection:bg-purple-500/30 overflow-hidden relative z-50">
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 duration-300 ${toast.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
           {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
           <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* MODAL: MERCHANT DETAILS */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
            <div className="bg-[#0f0720] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-black/20">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest text-white">{selectedMerchant.name}</h3>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">ID: {selectedMerchant.id}</p>
                    </div>
                    <button onClick={() => setSelectedMerchant(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-[#05010d] p-4 rounded-xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><User size={12}/> Owner Name</p>
                            <p className="font-bold text-sm text-white">{selectedMerchant.owner}</p>
                        </div>
                        <div className="bg-[#05010d] p-4 rounded-xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Phone size={12}/> Contact Phone</p>
                            <p className="font-bold text-sm text-white">{selectedMerchant.phone}</p>
                        </div>
                        <div className="bg-[#05010d] p-4 rounded-xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Mail size={12}/> Email Address</p>
                            <p className="font-bold text-sm text-white">{selectedMerchant.email}</p>
                        </div>
                        <div className="bg-[#05010d] p-4 rounded-xl border border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2"><MapPin size={12}/> Location</p>
                            <p className="font-bold text-sm text-white">{selectedMerchant.loc}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Status</p>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded border tracking-widest ${
                                selectedMerchant.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                selectedMerchant.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>{selectedMerchant.status}</span>
                        </div>
                        {selectedMerchant.status === 'Pending' && (
                            <div className="flex gap-2">
                                <button onClick={() => {handleApprove(selectedMerchant.id); setSelectedMerchant(null);}} className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors border border-green-500/50">Approve</button>
                                <button onClick={() => {handleReject(selectedMerchant.id); setSelectedMerchant(null);}} className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors border border-red-500/50">Reject</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <div className="w-72 bg-[#0a0515] border-r border-white/5 flex flex-col h-screen z-50 shadow-2xl">
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center font-black text-black shadow-lg">
            LR
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white leading-none">Admin<span className="text-yellow-500">.</span></h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Master Console</p>
          </div>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 px-4 mb-4">Main Menu</p>
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={20}/>, label: 'Overview' },
            { id: 'merchants', icon: <Store size={20}/>, label: 'Businesses' },
            { id: 'users', icon: <Users size={20}/>, label: 'Users' },
            { id: 'analytics', icon: <BarChart3 size={20}/>, label: 'Analytics' },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => {setActiveTab(item.id); setSearchQuery(""); setUserSearchQuery("");}}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest group ${activeTab === item.id ? 'bg-gradient-to-r from-yellow-500/10 to-transparent text-yellow-400 border-l-2 border-yellow-500' : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}
            >
              <div className={`${activeTab === item.id ? 'text-yellow-400' : 'text-gray-600 group-hover:text-white'} transition-colors`}>{item.icon}</div> 
              {item.label}
            </button>
          ))}
          
          <div className="pt-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 px-4 mb-4">System</p>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest group ${activeTab === 'settings' ? 'bg-gradient-to-r from-yellow-500/10 to-transparent text-yellow-400 border-l-2 border-yellow-500' : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}>
                <div className="text-gray-600 group-hover:text-white transition-colors"><Settings size={20}/></div> Settings
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="bg-[#0f0720] border border-white/5 p-4 rounded-2xl mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-0.5">
                  <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Admin" className="w-full h-full rounded-full border-2 border-[#0f0720]" />
              </div>
              <div>
                  <p className="text-xs font-bold text-white">Ishan Admin</p>
                  <p className="text-[9px] font-black uppercase text-green-400 tracking-widest flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> System Online</p>
              </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-lg">
            <LogOut size={16}/> Secure Logout
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#05010d]">
        
        {/* Top Header */}
        <header className="h-24 px-10 flex items-center justify-between z-40 bg-[#0a0515]/80 backdrop-blur-md border-b border-white/5">
          <div>
              <h1 className="text-2xl font-black uppercase tracking-widest text-white">{activeTab}</h1>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                 <Calendar size={12}/> {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
          </div>

          <div className="flex items-center gap-8">
            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-500/50 transition-all relative group">
                <Bell size={20}/>
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-[#05010d]"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Dynamic Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Listings', value: merchants.length, icon: <Store size={24}/>, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Pending Verifications', value: merchants.filter(m => m.status === 'Pending').length, icon: <Hourglass size={24}/>, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Total Users', value: usersList.length, icon: <Users size={24}/>, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Revenue Generated', value: '₹57,650', icon: <DollarSign size={24}/>, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0a0515] border border-white/5 p-6 rounded-[32px] hover:border-white/20 transition-all hover:-translate-y-1 relative group">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shadow-lg`}>{stat.icon}</div>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black italic text-white mb-1">{stat.value}</h3>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Fake Chart Widget */}
                  <div className="lg:col-span-2 bg-[#0a0515] border border-white/5 rounded-[32px] p-8 flex flex-col">
                      <div className="flex justify-between items-center mb-8">
                          <div>
                              <h3 className="text-xl font-black uppercase italic tracking-widest text-white">Revenue & Traffic</h3>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last 12 Months Activity</p>
                          </div>
                      </div>
                      {/* CSS Simulated Bar Chart */}
                      <div className="flex-1 flex items-end gap-2 h-48 mt-auto pt-10">
                          {chartData.map((val, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer">
                                  <div className="w-full relative bg-white/5 rounded-t-xl overflow-hidden transition-all group-hover:bg-white/10" style={{ height: '100%' }}>
                                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-xl transition-all duration-1000 group-hover:from-yellow-500 group-hover:to-orange-500" style={{ height: `${val}%` }}></div>
                                  </div>
                                  <span className="text-[9px] font-bold text-gray-600 mt-3 group-hover:text-white uppercase">M{i+1}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Recent Activity Timeline */}
                  <div className="bg-[#0a0515] border border-white/5 rounded-[32px] p-8">
                      <h3 className="text-xl font-black uppercase italic tracking-widest text-white mb-8">System Logs</h3>
                      <div className="space-y-6">
                          {[
                              { title: "New Shop Registered", desc: "Alpha Gadgets joined.", time: "10m ago", icon: <Store size={14}/>, color: "text-blue-400 bg-blue-500/20" },
                              { title: "High Traffic Alert", desc: "Server load at 85%.", time: "1h ago", icon: <Activity size={14}/>, color: "text-yellow-400 bg-yellow-500/20" },
                              { title: "Review Flagged", desc: "Spam detected on listing #12.", time: "3h ago", icon: <ShieldAlert size={14}/>, color: "text-red-400 bg-red-500/20" },
                              { title: "Payout Processed", desc: "₹1.2M sent to 45 merchants.", time: "5h ago", icon: <DollarSign size={14}/>, color: "text-green-400 bg-green-500/20" },
                          ].map((log, i) => (
                              <div key={i} className="flex gap-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.color}`}>
                                      {log.icon}
                                  </div>
                                  <div>
                                      <h4 className="text-sm font-bold text-white">{log.title}</h4>
                                      <p className="text-[11px] text-gray-500 font-medium mb-1">{log.desc}</p>
                                      <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest">{log.time}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESSES (MERCHANTS) */}
          {activeTab === 'merchants' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="bg-[#0a0515] border border-white/5 rounded-[32px] overflow-hidden shadow-xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/20">
                  <div>
                      <h3 className="text-xl font-black uppercase italic tracking-widest text-white">Merchant Directory</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verify and manage business listings</p>
                  </div>
                  <div className="flex items-center gap-4">
                      {/* Search for Merchants */}
                      <div className="flex items-center gap-2 w-64 bg-[#05010d] border border-white/10 rounded-xl px-4 py-2 focus-within:border-yellow-500/50 transition-all">
                        <Search size={14} className="text-gray-500" />
                        <input type="text" placeholder="Search businesses..." className="bg-transparent border-none outline-none text-xs font-bold text-white w-full placeholder-gray-600" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                      {/* Filters */}
                      <div className="flex gap-2 bg-[#05010d] p-1.5 rounded-xl border border-white/10">
                          {["All", "Pending", "Approved", "Rejected"].map(filter => (
                              <button key={filter} onClick={() => setMerchantFilter(filter)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${merchantFilter === filter ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                                  {filter}
                              </button>
                          ))}
                      </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-[#05010d]">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                        <th className="p-6 pl-8">Business Details</th>
                        <th className="p-6">Location</th>
                        <th className="p-6">Date Added</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredMerchants.length > 0 ? filteredMerchants.map((row) => (
                        <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6 pl-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center font-black text-white shadow-lg">
                                        {row.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white group-hover:text-yellow-400 transition-colors">{row.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{row.id} • {row.category}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <MapPin size={14} className="text-purple-500"/> {row.loc}
                                </div>
                            </td>
                            <td className="p-6 text-xs font-bold text-gray-500">{row.date}</td>
                            <td className="p-6">
                            <span className={`text-[9px] flex inline-flex items-center gap-1.5 font-black uppercase px-3 py-1.5 rounded-lg border tracking-widest ${
                                row.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                row.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse' : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                                {row.status === 'Approved' && <ShieldCheck size={12}/>}
                                {row.status === 'Pending' && <Hourglass size={12}/>}
                                {row.status === 'Rejected' && <XCircle size={12}/>}
                                {row.status}
                            </span>
                            </td>
                            <td className="p-6 text-right pr-8">
                            <div className="flex justify-end gap-2">
                                {row.status === 'Pending' && (
                                <>
                                    <button onClick={() => handleApprove(row.id)} className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-green-500/20" title="Approve"><CheckCircle size={16}/></button>
                                    <button onClick={() => handleReject(row.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-red-500/20" title="Reject"><XCircle size={16}/></button>
                                </>
                                )}
                                <button onClick={() => setSelectedMerchant(row)} className="p-2 bg-white/5 text-white hover:bg-white/20 rounded-xl transition-all border border-white/10" title="View Details"><Eye size={16}/></button>
                            </div>
                            </td>
                        </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-16 text-center text-gray-500">
                                    <Store size={40} className="mx-auto mb-4 opacity-50"/>
                                    <p className="font-bold uppercase tracking-widest text-xs">No businesses found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USERS */}
          {activeTab === 'users' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="bg-[#0a0515] border border-white/5 rounded-[32px] overflow-hidden shadow-xl">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/20">
                  <div>
                      <h3 className="text-xl font-black uppercase italic tracking-widest text-white">Registered Users</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manage platform customers</p>
                  </div>
                  <div className="flex items-center gap-2 w-64 bg-[#05010d] border border-white/10 rounded-xl px-4 py-2 focus-within:border-yellow-500/50 transition-all">
                    <Search size={14} className="text-gray-500" />
                    <input type="text" placeholder="Search users by name/email..." className="bg-transparent border-none outline-none text-xs font-bold text-white w-full placeholder-gray-600" value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-[#05010d]">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                        <th className="p-6 pl-8">User Profile</th>
                        <th className="p-6">Contact Info</th>
                        <th className="p-6">Joined Date</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                        <tr key={user.id} className={`hover:bg-white/5 transition-colors group ${user.status === 'Banned' ? 'opacity-60' : ''}`}>
                            <td className="p-6 pl-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-lg">
                                        <img src={`https://ui-avatars.com/api/?name=${user.name.replace(' ','+')}&background=random&color=fff`} alt={user.name} className="w-full h-full rounded-full border-2 border-[#0a0515]"/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white group-hover:text-yellow-400 transition-colors">{user.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{user.id} • {user.role}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-300 flex items-center gap-2 mb-1"><Mail size={12} className="text-purple-400"/> {user.email}</p>
                                    <p className="text-xs font-bold text-gray-500 flex items-center gap-2"><Phone size={12} className="text-blue-400"/> {user.phone}</p>
                                </div>
                            </td>
                            <td className="p-6 text-xs font-bold text-gray-500">{user.joined}</td>
                            <td className="p-6">
                                <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border tracking-widest ${
                                    user.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-6 text-right pr-8">
                                <button onClick={() => toggleUserStatus(user.id)} className={`p-2 rounded-xl transition-all border shadow-lg ${user.status === 'Active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white border-green-500/20'}`} title={user.status === 'Active' ? 'Ban User' : 'Unban User'}>
                                    {user.status === 'Active' ? <UserX size={16}/> : <UserCheck size={16}/>}
                                </button>
                            </td>
                        </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-16 text-center text-gray-500">
                                    <Users size={40} className="mx-auto mb-4 opacity-50"/>
                                    <p className="font-bold uppercase tracking-widest text-xs">No users found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Platform Growth */}
                    <div className="bg-[#0a0515] border border-white/5 rounded-[32px] p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-widest text-white flex items-center gap-2"><TrendingUp className="text-green-500" size={20}/> Platform Growth</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">User & Merchant Acquisition</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-gray-400">Total Merchants</span>
                                    <span className="text-white">1,240 <span className="text-green-400 ml-1 text-[10px]">+12%</span></span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                                    <div className="bg-purple-500 h-3 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)] w-[65%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-gray-400">Registered Users</span>
                                    <span className="text-white">84,200 <span className="text-green-400 ml-1 text-[10px]">+5%</span></span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                                    <div className="bg-blue-500 h-3 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] w-[85%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                    <span className="text-gray-400">Active Daily Visits</span>
                                    <span className="text-white">12,450 <span className="text-red-400 ml-1 text-[10px]">-2%</span></span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                                    <div className="bg-yellow-500 h-3 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)] w-[40%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-[#0a0515] border border-white/5 rounded-[32px] p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-widest text-white flex items-center gap-2"><PieChart className="text-blue-500" size={20}/> Category Distribution</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Listed businesses by sector</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {categoryStats.map((cat, i) => (
                                <div key={i} className="bg-[#05010d] p-4 rounded-2xl border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{cat.name}</span>
                                        <span className="text-white font-bold text-sm">{cat.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                        <div className={`${cat.color} h-1.5 rounded-full ${cat.glow}`} style={{ width: `${cat.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Device & Traffic Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#0a0515] border border-white/5 rounded-[32px] p-8 text-center flex flex-col items-center justify-center">
                        <Smartphone size={48} className="text-purple-500 mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                        <h4 className="text-4xl font-black text-white italic mb-1">78%</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mobile Traffic</p>
                    </div>
                    <div className="bg-[#0a0515] border border-white/5 rounded-[32px] p-8 text-center flex flex-col items-center justify-center">
                        <Monitor size={48} className="text-blue-500 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <h4 className="text-4xl font-black text-white italic mb-1">22%</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Desktop Traffic</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-[32px] p-8 text-center flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.2)]">
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Conversion Rate</h4>
                        <div className="text-5xl font-black text-white drop-shadow-lg mb-2">4.8%</div>
                        <p className="text-[10px] font-bold text-yellow-200 uppercase tracking-widest flex items-center gap-1"><ArrowUpRight size={12}/> Higher than last month</p>
                    </div>
                </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
             <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
                    <div className="w-32 h-32 bg-[#0a0515] border border-white/10 rounded-full flex items-center justify-center mb-8 relative z-10 shadow-2xl">
                        <Settings size={48} className="text-yellow-500 animate-[spin_4s_linear_infinite]" />
                    </div>
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-widest text-white mb-4">System Settings</h2>
                <p className="text-gray-500 text-sm font-medium max-w-md">Global platform configurations, API keys, and maintenance controls will be available in the upcoming patch.</p>
             </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminPanel;