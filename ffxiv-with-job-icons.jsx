const { useState, useMemo, useEffect } = React;
import { Search, Filter, ChevronDown, ChevronUp, Copy, Check, Edit2, Save, X, Plus, Trash2, Coffee, Globe } from 'lucide-react';

// Job Icons Component
const JobIcon = ({ job, size = 16, className = "" }) => {
  const jobIcons = {
    Carpenter: "🔨",
    Alchemist: "⚗️",
    Armorer: "🛡️",
    Blacksmith: "⚔️",
    Culinarian: "🍳",
    Goldsmith: "💍",
    Leatherworker: "🧤",
    Weaver: "🧵",
    Miner: "⛏️",
    Fisher: "🎣",
    Botanist: "🌿"
  };
  
  return (
    <span className={className} style={{ fontSize: size }}>
      {jobIcons[job] || "🔧"}
    </span>
  );
};

const FFXIVMacroDatabase = () => {
  // Job list for filters and dropdowns
  const jobList = ["Carpenter", "Alchemist", "Armorer", "Blacksmith", "Culinarian", "Goldsmith", "Leatherworker", "Weaver", "Miner", "Fisher", "Botanist"];
  const foodList = ["None", "Rroneek Steak HQ", "Ceviche HQ"];

  // Load data from localStorage
  const loadMacros = () => {
    const saved = localStorage.getItem('ffxiv-macro-database');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
        return [];
      }
    }
    return [];
  };

  const [macros, setMacrosState] = useState(loadMacros);

  // Wrapper for setMacros that saves to localStorage
  const setMacros = (newMacros) => {
    const macrosToSave = typeof newMacros === 'function' ? newMacros(macros) : newMacros;
    setMacrosState(macrosToSave);
    localStorage.setItem('ffxiv-macro-database', JSON.stringify(macrosToSave));
  };

  // Save to localStorage whenever macros change
  useEffect(() => {
    localStorage.setItem('ffxiv-macro-database', JSON.stringify(macros));
  }, [macros]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState('numeric');
  const [sortBy, setSortBy] = useState('questName');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterJob, setFilterJob] = useState('all');
  const [difficultySearch, setDifficultySearch] = useState('');
  const [qualitySearch, setQualitySearch] = useState('');
  const [durabilitySearch, setDurabilitySearch] = useState('');
  const [expandedMacros, setExpandedMacros] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [copiedItemId, setCopiedItemId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedMacro, setEditedMacro] = useState('');
  const [editingMacroIndex, setEditingMacroIndex] = useState(0);
  const [editingGeneral, setEditingGeneral] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [editedNotes, setEditedNotes] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMacro, setNewMacro] = useState({
    questName: '',
    location: 'Sinus Ardorum',
    job: 'Carpenter',
    items: [{
      name: '',
      difficulty: '',
      quality: '',
      durability: ''
    }],
    macro: '',
    notes: '',
    category: 'Class D',
    dataReward: {
      job: 'Carpenter',
      i: 0,
      ii: 0,
      iii: 0,
      iv: 0
    },
    foodRequired: false,
    foodType: 'None'
  });

  // Get unique categories, locations, and jobs
  const categories = useMemo(() => {
    const cats = new Set(macros.map(m => m.category));
    return ['all', ...Array.from(cats).sort()];
  }, [macros]);

  const locations = useMemo(() => {
    const locs = new Set();
    macros.forEach(m => {
      if (m.location.includes('/')) {
        m.location.split('/').forEach(l => locs.add(l.trim()));
      } else {
        locs.add(m.location);
      }
    });
    return ['all', ...Array.from(locs).sort()];
  }, [macros]);

  const jobs = useMemo(() => {
    const jobSet = new Set(macros.map(m => m.job));
    return ['all', ...Array.from(jobSet).sort()];
  }, [macros]);

  // Filter and sort macros
  const filteredMacros = useMemo(() => {
    let filtered = macros;

    // Apply search based on mode
    if (searchMode === 'text' && searchTerm) {
      filtered = filtered.filter(macro => 
        macro.questName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        macro.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        macro.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (macro.dataReward.job && macro.dataReward.job.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } else if (searchMode === 'numeric') {
      if (difficultySearch) {
        const difficulty = parseInt(difficultySearch);
        filtered = filtered.filter(macro => 
          macro.items.some(item => item.difficulty === difficulty)
        );
      }

      if (qualitySearch) {
        const quality = parseInt(qualitySearch);
        filtered = filtered.filter(macro => 
          macro.items.some(item => item.quality === quality)
        );
      }

      if (durabilitySearch) {
        const durability = parseInt(durabilitySearch);
        filtered = filtered.filter(macro => 
          macro.items.some(item => item.durability === durability)
        );
      }
    }

    // Apply filters
    if (filterCategory !== 'all') {
      filtered = filtered.filter(macro => macro.category === filterCategory);
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(macro => macro.location.includes(filterLocation));
    }

    if (filterJob !== 'all') {
      filtered = filtered.filter(macro => macro.job === filterJob);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'questName':
          return a.questName.localeCompare(b.questName);
        case 'difficulty':
          const maxDiffA = Math.max(...a.items.map(i => i.difficulty));
          const maxDiffB = Math.max(...b.items.map(i => i.difficulty));
          return maxDiffB - maxDiffA;
        case 'quality':
          const maxQualA = Math.max(...a.items.map(i => i.quality));
          const maxQualB = Math.max(...b.items.map(i => i.quality));
          return maxQualB - maxQualA;
        case 'category':
          const categoryOrder = ['Class A Expert', 'Class A', 'Class B', 'Class C', 'Class D', 'Sequential', 'Time-Restricted', 'Critical'];
          return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [macros, searchTerm, searchMode, sortBy, filterCategory, filterLocation, filterJob, difficultySearch, qualitySearch, durabilitySearch]);

  const toggleExpanded = (id) => {
    setExpandedMacros(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyMacro = (id, macroText) => {
    navigator.clipboard.writeText(macroText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyItemMacro = (macroId, itemIdx) => {
    const macro = macros.find(m => m.id === macroId);
    if (!macro) return;
    
    let macroText = '';
    if (macro.macros && macro.macros[itemIdx]) {
      macroText = macro.macros[itemIdx].macro;
    } else {
      macroText = macro.macro;
    }
    
    navigator.clipboard.writeText(macroText);
    setCopiedItemId(`${macroId}-${itemIdx}`);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  const startEditing = (id, currentMacro) => {
    setEditingId(id);
    setEditedMacro(currentMacro);
  };

  const saveEdit = (id) => {
    setMacros(prev => prev.map(macro => 
      macro.id === id ? { ...macro, macro: editedMacro } : macro
    ));
    setEditingId(null);
    setEditedMacro('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedMacro('');
  };

  const saveGeneralEdit = (macroId, updates) => {
    setMacros(prev => prev.map(macro => 
      macro.id === macroId ? { ...macro, ...updates } : macro
    ));
    setEditingGeneral(null);
  };

  const deleteMacro = (id) => {
    setMacros(prev => prev.filter(macro => macro.id !== id));
    setDeleteConfirm(null);
    delete expandedMacros[id];
  };

  const addNewMacro = () => {
    const newMacroWithId = {
      ...newMacro,
      id: Date.now(),
      items: newMacro.items.map(item => ({
        ...item,
        difficulty: parseInt(item.difficulty) || 0,
        quality: parseInt(item.quality) || 0,
        durability: parseInt(item.durability) || 0
      })),
      dataReward: {
        job: newMacro.job,
        i: parseInt(newMacro.dataReward.i) || 0,
        ii: parseInt(newMacro.dataReward.ii) || 0,
        iii: parseInt(newMacro.dataReward.iii) || 0,
        iv: parseInt(newMacro.dataReward.iv) || 0
      }
    };
    
    if (newMacroWithId.items.length > 1) {
      newMacroWithId.macros = newMacroWithId.items.map(item => ({
        itemName: item.name,
        macro: newMacroWithId.macro
      }));
    }
    
    setMacros(prev => [...prev, newMacroWithId]);
    setNewMacro({
      questName: '',
      location: 'Sinus Ardorum',
      job: 'Carpenter',
      items: [{
        name: '',
        difficulty: '',
        quality: '',
        durability: ''
      }],
      macro: '',
      notes: '',
      category: 'Class D',
      dataReward: {
        job: 'Carpenter',
        i: 0,
        ii: 0,
        iii: 0,
        iv: 0
      },
      foodRequired: false,
      foodType: 'None'
    });
    setShowAddForm(false);
    setExpandedMacros({ ...expandedMacros, [newMacroWithId.id]: true });
  };

  const updateNewMacro = (field, value) => {
    if (field === 'job') {
      setNewMacro(prev => ({ 
        ...prev, 
        [field]: value,
        dataReward: { ...prev.dataReward, job: value }
      }));
    } else {
      setNewMacro(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateNewMacroItem = (index, field, value) => {
    const newItems = [...newMacro.items];
    newItems[index][field] = value;
    setNewMacro(prev => ({ ...prev, items: newItems }));
  };

  const addNewItem = () => {
    setNewMacro(prev => ({
      ...prev,
      items: [...prev.items, { name: '', difficulty: '', quality: '', durability: '' }]
    }));
  };

  const removeNewItem = (index) => {
    setNewMacro(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const addItemToMacro = (macroId) => {
    const newItem = {
      name: 'New Item',
      difficulty: 1000,
      quality: 1000,
      durability: 40
    };
    
    setMacros(prev => prev.map(m => {
      if (m.id === macroId) {
        const updatedMacro = { ...m, items: [...m.items, newItem] };
        
        if (updatedMacro.items.length > 1) {
          if (!updatedMacro.macros) {
            updatedMacro.macros = updatedMacro.items.map((item, idx) => ({
              itemName: item.name,
              macro: idx === 0 ? updatedMacro.macro : ''
            }));
          } else {
            updatedMacro.macros.push({
              itemName: newItem.name,
              macro: ''
            });
          }
        }
        
        return updatedMacro;
      }
      return m;
    }));
  };

  const removeItemFromMacro = (macroId, itemIndex) => {
    setMacros(prev => prev.map(m => {
      if (m.id === macroId) {
        const updatedMacro = { ...m, items: m.items.filter((_, i) => i !== itemIndex) };
        
        if (updatedMacro.macros && updatedMacro.macros.length > itemIndex) {
          updatedMacro.macros = updatedMacro.macros.filter((_, i) => i !== itemIndex);
          
          if (updatedMacro.items.length === 1 && updatedMacro.macros.length === 1) {
            updatedMacro.macro = updatedMacro.macros[0].macro;
            delete updatedMacro.macros;
          }
        }
        
        return updatedMacro;
      }
      return m;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          FFXIV Cosmic Exploration
        </h1>
        <p className="text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Crafting Missions</p>
        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Section with Toggle */}
          <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-cyan-300 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Mode
              </h3>
              <button
                onClick={() => setSearchMode(searchMode === 'numeric' ? 'text' : 'numeric')}
                className="px-3 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 backdrop-blur-sm rounded-md transition-all text-sm border border-indigo-500/30"
              >
                Switch to {searchMode === 'numeric' ? 'Text' : 'Numeric'} Search
              </button>
            </div>
            
            {searchMode === 'numeric' ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Difficulty (exact)"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={difficultySearch}
                    onChange={(e) => setDifficultySearch(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Quality (exact)"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={qualitySearch}
                    onChange={(e) => setQualitySearch(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Durability (exact)"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={durabilitySearch}
                    onChange={(e) => setDurabilitySearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    setDifficultySearch('');
                    setQualitySearch('');
                    setDurabilitySearch('');
                  }}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 backdrop-blur-sm rounded transition-all border border-slate-600/30"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search quests, items, or data rewards..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-cyan-300" />
              <h3 className="text-sm font-medium text-cyan-300">Filters</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="questName">Sort by Quest Name</option>
                <option value="category">Sort by Class (A→D)</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="quality">Sort by Quality</option>
              </select>

              <select
                className="px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Classes' : cat}
                  </option>
                ))}
              </select>

              <select
                className="px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>

              <select
                className="px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
              >
                <option value="all">All Jobs</option>
                {jobList.map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>

              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-green-900/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add New Macro Form */}
        {showAddForm && (
          <div className="mb-6 p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Add New Macro</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300">Quest Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={newMacro.questName}
                    onChange={(e) => updateNewMacro('questName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300">Location</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={newMacro.location}
                    onChange={(e) => updateNewMacro('location', e.target.value)}
                  >
                    <option value="Sinus Ardorum">Sinus Ardorum</option>
                    <option value="Phaenna">Phaenna</option>
                    <option value="Sinus Ardorum/Phaenna">Sinus Ardorum/Phaenna</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300">Job</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={newMacro.job}
                    onChange={(e) => updateNewMacro('job', e.target.value)}
                  >
                    {jobList.map(job => (
                      <option key={job} value={job}>{job}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300">Category</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={newMacro.category}
                    onChange={(e) => updateNewMacro('category', e.target.value)}
                  >
                    <option value="Class D">Class D</option>
                    <option value="Class C">Class C</option>
                    <option value="Class B">Class B</option>
                    <option value="Class A">Class A</option>
                    <option value="Class A Expert">Class A Expert</option>
                    <option value="Sequential">Sequential</option>
                    <option value="Time-Restricted">Time-Restricted</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300">Food</label>
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      className="mt-2 accent-cyan-500"
                      checked={newMacro.foodRequired}
                      onChange={(e) => updateNewMacro('foodRequired', e.target.checked)}
                    />
                    <select
                      className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                      value={newMacro.foodType}
                      onChange={(e) => updateNewMacro('foodType', e.target.value)}
                      disabled={!newMacro.foodRequired}
                    >
                      {foodList.map(food => (
                        <option key={food} value={food}>{food}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-cyan-300">Data Reward ({newMacro.job})</label>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    placeholder="I"
                    className="px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={newMacro.dataReward.i}
                    onChange={(e) => updateNewMacro('dataReward', { ...newMacro.dataReward, i: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="II"
                    className="px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={newMacro.dataReward.ii}
                    onChange={(e) => updateNewMacro('dataReward', { ...newMacro.dataReward, ii: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="III"
                    className="px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={newMacro.dataReward.iii}
                    onChange={(e) => updateNewMacro('dataReward', { ...newMacro.dataReward, iii: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="IV"
                    className="px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                    value={newMacro.dataReward.iv}
                    onChange={(e) => updateNewMacro('dataReward', { ...newMacro.dataReward, iv: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-cyan-300">Items</label>
                  <button
                    onClick={addNewItem}
                    className="px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 backdrop-blur-sm rounded text-sm border border-indigo-500/30 transition-all"
                  >
                    Add Item
                  </button>
                </div>
                {newMacro.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => updateNewMacroItem(index, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                      placeholder="Difficulty"
                      value={item.difficulty}
                      onChange={(e) => updateNewMacroItem(index, 'difficulty', e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                      placeholder="Quality"
                      value={item.quality}
                      onChange={(e) => updateNewMacroItem(index, 'quality', e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                      placeholder="Durability"
                      value={item.durability}
                      onChange={(e) => updateNewMacroItem(index, 'durability', e.target.value)}
                    />
                    {newMacro.items.length > 1 && (
                      <button
                        onClick={() => removeNewItem(index)}
                        className="px-2 py-2 bg-red-600/50 hover:bg-red-600/70 backdrop-blur-sm rounded border border-red-500/30 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-cyan-300">Macro</label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all font-mono text-sm"
                  rows={6}
                  value={newMacro.macro}
                  onChange={(e) => updateNewMacro('macro', e.target.value)}
                  placeholder='/ac "Muscle Memory" <wait.3>'
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-cyan-300">Notes</label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all"
                  rows={2}
                  value={newMacro.notes}
                  onChange={(e) => updateNewMacro('notes', e.target.value)}
                  placeholder="Stats: 5811/5332/633. Additional notes..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 backdrop-blur-sm rounded transition-all border border-slate-500/30"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewMacro}
                  disabled={!newMacro.questName || !newMacro.items[0].name}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/30"
                >
                  Add Macro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 text-cyan-300">
          <div>Found {filteredMacros.length} mission{filteredMacros.length !== 1 ? 's' : ''}</div>
          {searchMode === 'numeric' && (difficultySearch || qualitySearch || durabilitySearch) && (
            <div className="text-sm mt-1">
              Searching for exact matches:
              {difficultySearch && <span className="ml-2 text-orange-400">Difficulty = {difficultySearch}</span>}
              {qualitySearch && <span className="ml-2 text-green-400">Quality = {qualitySearch}</span>}
              {durabilitySearch && <span className="ml-2 text-red-400">Durability = {durabilitySearch}</span>}
            </div>
          )}
        </div>

        {/* Macro Cards */}
        <div className="space-y-4">
          {filteredMacros.map(macro => (
            <div key={macro.id} className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden group shadow-xl">
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-slate-700/30 transition-all"
                onClick={() => toggleExpanded(macro.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{macro.questName}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingGeneral(macro.id);
                        }}
                        className="p-1 hover:bg-slate-600/50 rounded opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Edit2 className="w-4 h-4 text-cyan-400" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-sm flex items-center gap-1 border border-indigo-500/30">
                        <Globe className="w-3 h-3" />
                        {macro.location}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-sm flex items-center gap-1 border border-purple-500/30">
                        <JobIcon job={macro.job} size={12} />
                        {macro.job}
                      </span>
                    </div>
                    {/* Craft Requirements as separate line */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-cyan-300">Crafts:</span>
                      {macro.items.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyItemMacro(macro.id, idx);
                          }}
                          className="px-2 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded-md text-sm transition-all flex items-center gap-1 border border-slate-600/50"
                        >
                          {copiedItemId === `${macro.id}-${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-green-400">{item.name}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>{item.name}</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {macro.foodRequired && macro.foodType !== 'None' && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md text-sm border border-emerald-500/30">
                        <Coffee className="w-3 h-3" />
                        {macro.foodType}
                      </span>
                    )}
                    <span className={`text-sm px-2 py-1 rounded border ${
                      macro.category.includes('Class A') && !macro.category.includes('Expert') ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                      macro.category === 'Class A Expert' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      macro.category === 'Class B' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      macro.category === 'Class C' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      macro.category === 'Class D' ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' :
                      macro.category === 'Sequential' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                      macro.category === 'Time-Restricted' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      macro.category === 'Critical' ? 'bg-red-600/20 text-red-300 border-red-600/30' :
                      'bg-slate-500/20 text-slate-300 border-slate-500/30'
                    }`}>{macro.category}</span>
                    {expandedMacros[macro.id] ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Edit General Info Form */}
              {editingGeneral === macro.id && (
                <div className="border-t border-slate-700/50 p-4 bg-slate-900/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-cyan-300">Quest Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500"
                        defaultValue={macro.questName}
                        id={`questName-${macro.id}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-cyan-300">Location</label>
                      <select
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500"
                        defaultValue={macro.location}
                        id={`location-${macro.id}`}
                      >
                        <option value="Sinus Ardorum">Sinus Ardorum</option>
                        <option value="Phaenna">Phaenna</option>
                        <option value="Sinus Ardorum/Phaenna">Sinus Ardorum/Phaenna</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-cyan-300">Job</label>
                      <select
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500"
                        defaultValue={macro.job}
                        id={`job-${macro.id}`}
                      >
                        {jobList.map(job => (
                          <option key={job} value={job}>{job}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-cyan-300">Category</label>
                      <select
                        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500"
                        defaultValue={macro.category}
                        id={`category-${macro.id}`}
                      >
                        <option value="Class D">Class D</option>
                        <option value="Class C">Class C</option>
                        <option value="Class B">Class B</option>
                        <option value="Class A">Class A</option>
                        <option value="Class A Expert">Class A Expert</option>
                        <option value="Sequential">Sequential</option>
                        <option value="Time-Restricted">Time-Restricted</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-cyan-300">Food</label>
                      <div className="flex gap-2">
                        <input
                          type="checkbox"
                          className="mt-2 accent-cyan-500"
                          defaultChecked={macro.foodRequired}
                          id={`foodRequired-${macro.id}`}
                        />
                        <select
                          className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500"
                          defaultValue={macro.foodType}
                          id={`foodType-${macro.id}`}
                        >
                          {foodList.map(food => (
                            <option key={food} value={food}>{food}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-cyan-300">Craft Requirements</label>
                    {macro.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded"
                          defaultValue={item.name}
                          id={`itemName-${macro.id}-${idx}`}
                        />
                        <input
                          type="number"
                          className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded"
                          defaultValue={item.difficulty}
                          id={`itemDifficulty-${macro.id}-${idx}`}
                        />
                        <input
                          type="number"
                          className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded"
                          defaultValue={item.quality}
                          id={`itemQuality-${macro.id}-${idx}`}
                        />
                        <input
                          type="number"
                          className="w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded"
                          defaultValue={item.durability}
                          id={`itemDurability-${macro.id}-${idx}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-cyan-300">
                      Data Reward ({document.getElementById(`job-${macro.id}`)?.value || macro.dataReward.job})
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="number"
                        placeholder="I"
                        className="px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded"
                        defaultValue={macro.dataReward.i}
                        id={`dataRewardI-${macro.id}`}
                      />
                      <input
                        type="number"
                        placeholder="II"
                        className="px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded"
                        defaultValue={macro.dataReward.ii}
                        id={`dataRewardII-${macro.id}`}
                      />
                      <input
                        type="number"
                        placeholder="III"
                        className="px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded"
                        defaultValue={macro.dataReward.iii}
                        id={`dataRewardIII-${macro.id}`}
                      />
                      <input
                        type="number"
                        placeholder="IV"
                        className="px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded"
                        defaultValue={macro.dataReward.iv}
                        id={`dataRewardIV-${macro.id}`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingGeneral(null)}
                      className="px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 backdrop-blur-sm rounded transition-all border border-slate-500/30"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const job = document.getElementById(`job-${macro.id}`).value;
                        const updates = {
                          questName: document.getElementById(`questName-${macro.id}`).value,
                          location: document.getElementById(`location-${macro.id}`).value,
                          job: job,
                          category: document.getElementById(`category-${macro.id}`).value,
                          foodRequired: document.getElementById(`foodRequired-${macro.id}`).checked,
                          foodType: document.getElementById(`foodType-${macro.id}`).value,
                          items: macro.items.map((item, idx) => ({
                            name: document.getElementById(`itemName-${macro.id}-${idx}`).value,
                            difficulty: parseInt(document.getElementById(`itemDifficulty-${macro.id}-${idx}`).value) || 0,
                            quality: parseInt(document.getElementById(`itemQuality-${macro.id}-${idx}`).value) || 0,
                            durability: parseInt(document.getElementById(`itemDurability-${macro.id}-${idx}`).value) || 0
                          })),
                          dataReward: {
                            job: job,
                            i: parseInt(document.getElementById(`dataRewardI-${macro.id}`).value) || 0,
                            ii: parseInt(document.getElementById(`dataRewardII-${macro.id}`).value) || 0,
                            iii: parseInt(document.getElementById(`dataRewardIII-${macro.id}`).value) || 0,
                            iv: parseInt(document.getElementById(`dataRewardIV-${macro.id}`).value) || 0
                          }
                        };
                        saveGeneralEdit(macro.id, updates);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded transition-all shadow-lg shadow-green-900/30"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Expanded Content */}
              {expandedMacros[macro.id] && (
                <div className="border-t border-slate-700/50 p-4 space-y-4">
                  {/* Item Details */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-cyan-300">Craft Requirements</h4>
                      <button
                        onClick={() => addItemToMacro(macro.id)}
                        className="px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 backdrop-blur-sm rounded text-sm border border-indigo-500/30 transition-all"
                      >
                        Add Item
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {macro.items.map((item, idx) => (
                        <div key={idx} className="bg-slate-700/30 p-3 rounded-lg relative border border-slate-600/50">
                          {macro.items.length > 1 && (
                            <button
                              onClick={() => removeItemFromMacro(macro.id, idx)}
                              className="absolute top-2 right-2 p-1 bg-red-600/50 hover:bg-red-600/70 rounded border border-red-500/30"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                          <p className="font-medium text-cyan-300 pr-6">{item.name}</p>
                          <div className="space-y-1 text-sm mt-2">
                            <p>Difficulty: <span className={`text-orange-400 ${
                              searchMode === 'numeric' && difficultySearch && item.difficulty === parseInt(difficultySearch)
                                ? 'font-bold bg-orange-500/20 px-1 rounded' : ''
                            }`}>{item.difficulty}</span></p>
                            <p>Quality: <span className={`text-green-400 ${
                              searchMode === 'numeric' && qualitySearch && item.quality === parseInt(qualitySearch)
                                ? 'font-bold bg-green-500/20 px-1 rounded' : ''
                            }`}>{item.quality}</span></p>
                            <p>Durability: <span className={`text-red-400 ${
                              searchMode === 'numeric' && durabilitySearch && item.durability === parseInt(durabilitySearch)
                                ? 'font-bold bg-red-500/20 px-1 rounded' : ''
                            }`}>{item.durability}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Reward */}
                  <div>
                    <h4 className="font-semibold mb-2 text-cyan-300">Data Reward</h4>
                    <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/50">
                      <div className="flex flex-wrap gap-3">
                        {macro.dataReward.i > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-600/30 rounded-md border border-gray-500/50" 
                               style={{ boxShadow: '0 0 10px rgba(156, 163, 175, 0.5)' }}>
                            <JobIcon job={macro.dataReward.job || macro.job} size={16} />
                            <span className="text-gray-300 font-bold">I</span>
                            <span className="text-gray-400 text-sm">×{macro.dataReward.i}</span>
                          </div>
                        )}
                        {macro.dataReward.ii > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-600/30 rounded-md border border-yellow-500/50" 
                               style={{ boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }}>
                            <JobIcon job={macro.dataReward.job || macro.job} size={16} />
                            <span className="text-yellow-300 font-bold">II</span>
                            <span className="text-yellow-400 text-sm">×{macro.dataReward.ii}</span>
                          </div>
                        )}
                        {macro.dataReward.iii > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/30 rounded-md border border-blue-500/50" 
                               style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
                            <JobIcon job={macro.dataReward.job || macro.job} size={16} />
                            <span className="text-blue-300 font-bold">III</span>
                            <span className="text-blue-400 text-sm">×{macro.dataReward.iii}</span>
                          </div>
                        )}
                        {macro.dataReward.iv > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/30 rounded-md border border-purple-500/50" 
                               style={{ boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>
                            <JobIcon job={macro.dataReward.job || macro.job} size={16} />
                            <span className="text-purple-300 font-bold">IV</span>
                            <span className="text-purple-400 text-sm">×{macro.dataReward.iv}</span>
                          </div>
                        )}
                        {macro.dataReward.i === 0 && macro.dataReward.ii === 0 && macro.dataReward.iii === 0 && macro.dataReward.iv === 0 && (
                          <span className="text-slate-400 text-sm">No data rewards</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Macro */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-cyan-300">Macro{macro.macros && macro.macros.length > 1 ? 's' : ''}</h4>
                      <div className="flex gap-2">
                        {editingId !== macro.id && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(macro.id, macro.macros ? macro.macros[0].macro : macro.macro);
                                setEditingMacroIndex(0);
                              }}
                              className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded transition-all border border-slate-600/50"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="text-sm">Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyMacro(macro.id, macro.macros ? macro.macros[0].macro : macro.macro);
                              }}
                              className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded transition-all border border-slate-600/50"
                            >
                              {copiedId === macro.id ? (
                                <>
                                  <Check className="w-4 h-4 text-green-400" />
                                  <span className="text-sm text-green-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span className="text-sm">Copy</span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                        {editingId === macro.id && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (macro.macros) {
                                  const updatedMacros = [...macro.macros];
                                  updatedMacros[editingMacroIndex] = { ...updatedMacros[editingMacroIndex], macro: editedMacro };
                                  setMacros(prev => prev.map(m => 
                                    m.id === macro.id ? { ...m, macros: updatedMacros } : m
                                  ));
                                } else {
                                  saveEdit(macro.id);
                                }
                                setEditingId(null);
                                setEditedMacro('');
                              }}
                              className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded transition-all"
                            >
                              <Save className="w-4 h-4" />
                              <span className="text-sm">Save</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEdit();
                              }}
                              className="flex items-center gap-2 px-3 py-1 bg-red-600/50 hover:bg-red-600/70 rounded transition-all border border-red-500/30"
                            >
                              <X className="w-4 h-4" />
                              <span className="text-sm">Cancel</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {editingId === macro.id ? (
                      <div className="space-y-2">
                        {macro.macros && editingMacroIndex < macro.macros.length && (
                          <div className="text-sm text-cyan-300">
                            Editing macro for: {macro.macros[editingMacroIndex].itemName}
                          </div>
                        )}
                        <textarea
                          value={editedMacro}
                          onChange={(e) => setEditedMacro(e.target.value)}
                          className="w-full bg-slate-900/50 p-3 rounded-lg text-sm font-mono border border-slate-600/50 focus:outline-none focus:border-cyan-500"
                          rows={10}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <>
                        {macro.macros ? (
                          <div className="space-y-4">
                            {macro.macros.map((macroItem, idx) => (
                              <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-600/50">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-sm font-medium text-cyan-300">{macroItem.itemName}</h5>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditing(macro.id, macroItem.macro);
                                        setEditingMacroIndex(idx);
                                      }}
                                      className="p-1 hover:bg-slate-700/50 rounded"
                                    >
                                      <Edit2 className="w-3 h-3 text-cyan-400" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyMacro(`${macro.id}-${idx}`, macroItem.macro);
                                      }}
                                      className="p-1 hover:bg-slate-700/50 rounded"
                                    >
                                      {copiedId === `${macro.id}-${idx}` ? (
                                        <Check className="w-3 h-3 text-green-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                <pre className="text-sm font-mono overflow-x-auto text-gray-300">
                                  {macroItem.macro}
                                </pre>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <pre className="bg-slate-900/50 p-3 rounded-lg text-sm font-mono overflow-x-auto border border-slate-600/50 text-gray-300">
                            {macro.macro}
                          </pre>
                        )}
                      </>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-cyan-300">Notes</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingNotes(macro.id);
                          setEditedNotes(macro.notes || '');
                        }}
                        className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded transition-all border border-slate-600/50"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </button>
                    </div>
                    {editingNotes === macro.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedNotes}
                          onChange={(e) => setEditedNotes(e.target.value)}
                          className="w-full bg-slate-700/30 p-3 rounded text-gray-300 border border-slate-600/50"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setMacros(prev => prev.map(m => 
                                m.id === macro.id ? { ...m, notes: editedNotes } : m
                              ));
                              setEditingNotes(null);
                              setEditedNotes('');
                            }}
                            className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingNotes(null);
                              setEditedNotes('');
                            }}
                            className="px-3 py-1 bg-red-600/50 hover:bg-red-600/70 rounded border border-red-500/30"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">{macro.notes || 'No notes added.'}</p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="pt-4 border-t border-slate-700/50">
                    {deleteConfirm === macro.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-red-400">Are you sure?</span>
                        <button
                          onClick={() => deleteMacro(macro.id)}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded transition-all"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 bg-red-600/50 hover:bg-red-600/70 rounded transition-all border border-red-500/30"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(macro.id)}
                        className="w-full px-4 py-2 bg-red-600/30 hover:bg-red-600/50 backdrop-blur-sm rounded transition-all flex items-center justify-center gap-2 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Entry</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {macros.length === 0 && (
          <div className="text-center py-12">
            <p className="text-cyan-300 text-lg">No data</p>
          </div>
        )}

        {macros.length > 0 && filteredMacros.length === 0 && (
          <div className="text-center py-12">
            <p className="text-cyan-300">No missions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const App = FFXIVMacroDatabase;
