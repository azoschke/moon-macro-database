(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "react", "lucide-react", "react/jsx-runtime"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("react"), require("lucide-react"), require("react/jsx-runtime"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.lucideReact, global.jsxRuntime);
    global.repl = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _react, _lucideReact, _jsxRuntime) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _react = _interopRequireWildcard(_react);
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
  // Job Icons Component
  const JobIcon = ({
    job,
    size = 16,
    className = ""
  }) => {
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      className: className,
      style: {
        fontSize: size
      },
      children: jobIcons[job] || "🔧"
    });
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
    const [macros, setMacrosState] = (0, _react.useState)(loadMacros);

    // Wrapper for setMacros that saves to localStorage
    const setMacros = newMacros => {
      const macrosToSave = typeof newMacros === 'function' ? newMacros(macros) : newMacros;
      setMacrosState(macrosToSave);
      localStorage.setItem('ffxiv-macro-database', JSON.stringify(macrosToSave));
    };

    // Save to localStorage whenever macros change
    (0, _react.useEffect)(() => {
      localStorage.setItem('ffxiv-macro-database', JSON.stringify(macros));
    }, [macros]);
    const [searchTerm, setSearchTerm] = (0, _react.useState)('');
    const [searchMode, setSearchMode] = (0, _react.useState)('numeric');
    const [sortBy, setSortBy] = (0, _react.useState)('questName');
    const [filterCategory, setFilterCategory] = (0, _react.useState)('all');
    const [filterLocation, setFilterLocation] = (0, _react.useState)('all');
    const [filterJob, setFilterJob] = (0, _react.useState)('all');
    const [difficultySearch, setDifficultySearch] = (0, _react.useState)('');
    const [qualitySearch, setQualitySearch] = (0, _react.useState)('');
    const [durabilitySearch, setDurabilitySearch] = (0, _react.useState)('');
    const [expandedMacros, setExpandedMacros] = (0, _react.useState)({});
    const [copiedId, setCopiedId] = (0, _react.useState)(null);
    const [copiedItemId, setCopiedItemId] = (0, _react.useState)(null);
    const [editingId, setEditingId] = (0, _react.useState)(null);
    const [editedMacro, setEditedMacro] = (0, _react.useState)('');
    const [editingMacroIndex, setEditingMacroIndex] = (0, _react.useState)(0);
    const [editingGeneral, setEditingGeneral] = (0, _react.useState)(null);
    const [editingNotes, setEditingNotes] = (0, _react.useState)(null);
    const [editedNotes, setEditedNotes] = (0, _react.useState)('');
    const [deleteConfirm, setDeleteConfirm] = (0, _react.useState)(null);
    const [showAddForm, setShowAddForm] = (0, _react.useState)(false);
    const [newMacro, setNewMacro] = (0, _react.useState)({
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
    const categories = (0, _react.useMemo)(() => {
      const cats = new Set(macros.map(m => m.category));
      return ['all', ...Array.from(cats).sort()];
    }, [macros]);
    const locations = (0, _react.useMemo)(() => {
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
    const jobs = (0, _react.useMemo)(() => {
      const jobSet = new Set(macros.map(m => m.job));
      return ['all', ...Array.from(jobSet).sort()];
    }, [macros]);

    // Filter and sort macros
    const filteredMacros = (0, _react.useMemo)(() => {
      let filtered = macros;

      // Apply search based on mode
      if (searchMode === 'text' && searchTerm) {
        filtered = filtered.filter(macro => macro.questName.toLowerCase().includes(searchTerm.toLowerCase()) || macro.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) || macro.notes.toLowerCase().includes(searchTerm.toLowerCase()) || macro.dataReward.job && macro.dataReward.job.toLowerCase().includes(searchTerm.toLowerCase()));
      } else if (searchMode === 'numeric') {
        if (difficultySearch) {
          const difficulty = parseInt(difficultySearch);
          filtered = filtered.filter(macro => macro.items.some(item => item.difficulty === difficulty));
        }
        if (qualitySearch) {
          const quality = parseInt(qualitySearch);
          filtered = filtered.filter(macro => macro.items.some(item => item.quality === quality));
        }
        if (durabilitySearch) {
          const durability = parseInt(durabilitySearch);
          filtered = filtered.filter(macro => macro.items.some(item => item.durability === durability));
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
    const toggleExpanded = id => {
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
    const saveEdit = id => {
      setMacros(prev => prev.map(macro => macro.id === id ? {
        ...macro,
        macro: editedMacro
      } : macro));
      setEditingId(null);
      setEditedMacro('');
    };
    const cancelEdit = () => {
      setEditingId(null);
      setEditedMacro('');
    };
    const saveGeneralEdit = (macroId, updates) => {
      setMacros(prev => prev.map(macro => macro.id === macroId ? {
        ...macro,
        ...updates
      } : macro));
      setEditingGeneral(null);
    };
    const deleteMacro = id => {
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
      setExpandedMacros({
        ...expandedMacros,
        [newMacroWithId.id]: true
      });
    };
    const updateNewMacro = (field, value) => {
      if (field === 'job') {
        setNewMacro(prev => ({
          ...prev,
          [field]: value,
          dataReward: {
            ...prev.dataReward,
            job: value
          }
        }));
      } else {
        setNewMacro(prev => ({
          ...prev,
          [field]: value
        }));
      }
    };
    const updateNewMacroItem = (index, field, value) => {
      const newItems = [...newMacro.items];
      newItems[index][field] = value;
      setNewMacro(prev => ({
        ...prev,
        items: newItems
      }));
    };
    const addNewItem = () => {
      setNewMacro(prev => ({
        ...prev,
        items: [...prev.items, {
          name: '',
          difficulty: '',
          quality: '',
          durability: ''
        }]
      }));
    };
    const removeNewItem = index => {
      setNewMacro(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    };
    const addItemToMacro = macroId => {
      const newItem = {
        name: 'New Item',
        difficulty: 1000,
        quality: 1000,
        durability: 40
      };
      setMacros(prev => prev.map(m => {
        if (m.id === macroId) {
          const updatedMacro = {
            ...m,
            items: [...m.items, newItem]
          };
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
          const updatedMacro = {
            ...m,
            items: m.items.filter((_, i) => i !== itemIndex)
          };
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-gray-100 p-6",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "max-w-7xl mx-auto",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
          className: "text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent",
          children: "FFXIV Cosmic Exploration - Crafting & Gathering Missions"
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "mb-6 space-y-4",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: "p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-xl",
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "flex items-center justify-between mb-3",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("h3", {
                className: "text-sm font-medium text-cyan-300 flex items-center gap-2",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Search, {
                  className: "w-4 h-4"
                }), "Search Mode"]
              }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("button", {
                onClick: () => setSearchMode(searchMode === 'numeric' ? 'text' : 'numeric'),
                className: "px-3 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 backdrop-blur-sm rounded-md transition-all text-sm border border-indigo-500/30",
                children: ["Switch to ", searchMode === 'numeric' ? 'Text' : 'Numeric', " Search"]
              })]
            }), searchMode === 'numeric' ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "flex gap-4",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                className: "flex-1",
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  placeholder: "Difficulty (exact)",
                  className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: difficultySearch,
                  onChange: e => setDifficultySearch(e.target.value)
                })
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                className: "flex-1",
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  placeholder: "Quality (exact)",
                  className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: qualitySearch,
                  onChange: e => setQualitySearch(e.target.value)
                })
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                className: "flex-1",
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  placeholder: "Durability (exact)",
                  className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: durabilitySearch,
                  onChange: e => setDurabilitySearch(e.target.value)
                })
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                onClick: () => {
                  setDifficultySearch('');
                  setQualitySearch('');
                  setDurabilitySearch('');
                },
                className: "px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 backdrop-blur-sm rounded transition-all border border-slate-600/30",
                children: "Clear"
              })]
            }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "relative",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Search, {
                className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                type: "text",
                placeholder: "Search quests, items, or data rewards...",
                className: "w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                value: searchTerm,
                onChange: e => setSearchTerm(e.target.value)
              })]
            })]
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: "p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-xl",
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "flex items-center gap-2 mb-3",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Filter, {
                className: "w-4 h-4 text-cyan-300"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h3", {
                className: "text-sm font-medium text-cyan-300",
                children: "Filters"
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "flex flex-col md:flex-row gap-4",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("select", {
                className: "px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                value: sortBy,
                onChange: e => setSortBy(e.target.value),
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                  value: "questName",
                  children: "Sort by Quest Name"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                  value: "category",
                  children: "Sort by Class (A\xE2\u2020\u2019D)"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                  value: "difficulty",
                  children: "Sort by Difficulty"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                  value: "quality",
                  children: "Sort by Quality"
                })]
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("select", {
                className: "px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                value: filterCategory,
                onChange: e => setFilterCategory(e.target.value),
                children: categories.map(cat => /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                  value: cat,
                  children: cat === 'all' ? 'All Classes' : cat
                }, cat))
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("select", {
                className: "px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                value: filterLocation,
                onChange: e => setFilterLocation(e.target.value),
                children: locations.map(loc => /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                  value: loc,
                  children: loc === 'all' ? 'All Locations' : loc
                }, loc))
              }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("select", {
                className: "px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                value: filterJob,
                onChange: e => setFilterJob(e.target.value),
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                  value: "all",
                  children: "All Jobs"
                }), jobList.map(job => /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                  value: job,
                  children: job
                }, job))]
              }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("button", {
                onClick: () => setShowAddForm(true),
                className: "px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-green-900/30",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Plus, {
                  className: "w-4 h-4"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                  children: "Add New"
                })]
              })]
            })]
          })]
        }), showAddForm && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "mb-6 p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 shadow-xl",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
            className: "text-xl font-semibold mb-4 text-cyan-400",
            children: "Add New Macro"
          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: "space-y-4",
            children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "grid grid-cols-1 md:grid-cols-3 gap-4",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                  className: "block text-sm font-medium mb-1 text-cyan-300",
                  children: "Quest Name"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "text",
                  className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: newMacro.questName,
                  onChange: e => updateNewMacro('questName', e.target.value)
                })]
              }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                  className: "block text-sm font-medium mb-1 text-cyan-300",
                  children: "Location"
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("select", {
                  className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: newMacro.location,
                  onChange: e => updateNewMacro('location', e.target.value),
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Sinus Ardorum",
                    children: "Sinus Ardorum"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Phaenna",
                    children: "Phaenna"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Sinus Ardorum/Phaenna",
                    children: "Sinus Ardorum/Phaenna"
                  })]
                })]
              }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                  className: "block text-sm font-medium mb-1 text-cyan-300",
                  children: "Job"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("select", {
                  className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: newMacro.job,
                  onChange: e => updateNewMacro('job', e.target.value),
                  children: jobList.map(job => /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: job,
                    children: job
                  }, job))
                })]
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "grid grid-cols-1 md:grid-cols-2 gap-4",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                  className: "block text-sm font-medium mb-1 text-cyan-300",
                  children: "Category"
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("select", {
                  className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: newMacro.category,
                  onChange: e => updateNewMacro('category', e.target.value),
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Class D",
                    children: "Class D"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Class C",
                    children: "Class C"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Class B",
                    children: "Class B"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Class A",
                    children: "Class A"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Class A Expert",
                    children: "Class A Expert"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Sequential",
                    children: "Sequential"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Time-Restricted",
                    children: "Time-Restricted"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                    value: "Critical",
                    children: "Critical"
                  })]
                })]
              }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                  className: "block text-sm font-medium mb-1 text-cyan-300",
                  children: "Food"
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "flex gap-2",
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                    type: "checkbox",
                    className: "mt-2 accent-cyan-500",
                    checked: newMacro.foodRequired,
                    onChange: e => updateNewMacro('foodRequired', e.target.checked)
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("select", {
                    className: "flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                    value: newMacro.foodType,
                    onChange: e => updateNewMacro('foodType', e.target.value),
                    disabled: !newMacro.foodRequired,
                    children: foodList.map(food => /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                      value: food,
                      children: food
                    }, food))
                  })]
                })]
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
                className: "block text-sm font-medium mb-1 text-cyan-300",
                children: ["Data Reward (", newMacro.job, ")"]
              }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: "grid grid-cols-4 gap-2",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  placeholder: "I",
                  className: "px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: newMacro.dataReward.i,
                  onChange: e => updateNewMacro('dataReward', {
                    ...newMacro.dataReward,
                    i: e.target.value
                  })
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  placeholder: "II",
                  className: "px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: newMacro.dataReward.ii,
                  onChange: e => updateNewMacro('dataReward', {
                    ...newMacro.dataReward,
                    ii: e.target.value
                  })
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  placeholder: "III",
                  className: "px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: newMacro.dataReward.iii,
                  onChange: e => updateNewMacro('dataReward', {
                    ...newMacro.dataReward,
                    iii: e.target.value
                  })
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  placeholder: "IV",
                  className: "px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  value: newMacro.dataReward.iv,
                  onChange: e => updateNewMacro('dataReward', {
                    ...newMacro.dataReward,
                    iv: e.target.value
                  })
                })]
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: "flex items-center justify-between mb-2",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                  className: "block text-sm font-medium text-cyan-300",
                  children: "Items"
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                  onClick: addNewItem,
                  className: "px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 backdrop-blur-sm rounded text-sm border border-indigo-500/30 transition-all",
                  children: "Add Item"
                })]
              }), newMacro.items.map((item, index) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: "flex gap-2 mb-2",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "text",
                  className: "flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  placeholder: "Item Name",
                  value: item.name,
                  onChange: e => updateNewMacroItem(index, 'name', e.target.value)
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  className: "w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  placeholder: "Difficulty",
                  value: item.difficulty,
                  onChange: e => updateNewMacroItem(index, 'difficulty', e.target.value)
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  className: "w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  placeholder: "Quality",
                  value: item.quality,
                  onChange: e => updateNewMacroItem(index, 'quality', e.target.value)
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                  type: "number",
                  className: "w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                  placeholder: "Durability",
                  value: item.durability,
                  onChange: e => updateNewMacroItem(index, 'durability', e.target.value)
                }), newMacro.items.length > 1 && /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                  onClick: () => removeNewItem(index),
                  className: "px-2 py-2 bg-red-600/50 hover:bg-red-600/70 backdrop-blur-sm rounded border border-red-500/30 transition-all",
                  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.X, {
                    className: "w-4 h-4"
                  })
                })]
              }, index))]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                className: "block text-sm font-medium mb-1 text-cyan-300",
                children: "Macro"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("textarea", {
                className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all font-mono text-sm",
                rows: 6,
                value: newMacro.macro,
                onChange: e => updateNewMacro('macro', e.target.value),
                placeholder: "/ac \"Muscle Memory\" <wait.3>"
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                className: "block text-sm font-medium mb-1 text-cyan-300",
                children: "Notes"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("textarea", {
                className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.2)] transition-all",
                rows: 2,
                value: newMacro.notes,
                onChange: e => updateNewMacro('notes', e.target.value),
                placeholder: "Stats: 5811/5332/633. Additional notes..."
              })]
            }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "flex gap-2 justify-end",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                onClick: () => setShowAddForm(false),
                className: "px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 backdrop-blur-sm rounded transition-all border border-slate-500/30",
                children: "Cancel"
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                onClick: addNewMacro,
                disabled: !newMacro.questName || !newMacro.items[0].name,
                className: "px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/30",
                children: "Add Macro"
              })]
            })]
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
          className: "mb-4 text-cyan-300",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            children: ["Found ", filteredMacros.length, " mission", filteredMacros.length !== 1 ? 's' : '']
          }), searchMode === 'numeric' && (difficultySearch || qualitySearch || durabilitySearch) && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
            className: "text-sm mt-1",
            children: ["Searching for exact matches:", difficultySearch && /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
              className: "ml-2 text-orange-400",
              children: ["Difficulty = ", difficultySearch]
            }), qualitySearch && /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
              className: "ml-2 text-green-400",
              children: ["Quality = ", qualitySearch]
            }), durabilitySearch && /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
              className: "ml-2 text-red-400",
              children: ["Durability = ", durabilitySearch]
            })]
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "space-y-4",
          children: filteredMacros.map(macro => {
            var _document$getElementB;
            return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
              className: "bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden group shadow-xl",
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                className: "p-4 cursor-pointer hover:bg-slate-700/30 transition-all",
                onClick: () => toggleExpanded(macro.id),
                children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex-1",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "flex items-center gap-2 mb-2",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h3", {
                        className: "text-xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent",
                        children: macro.questName
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                        onClick: e => {
                          e.stopPropagation();
                          setEditingGeneral(macro.id);
                        },
                        className: "p-1 hover:bg-slate-600/50 rounded opacity-0 group-hover:opacity-100 transition-all",
                        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Edit2, {
                          className: "w-4 h-4 text-cyan-400"
                        })
                      })]
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "flex flex-wrap gap-2 mb-2",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
                        className: "px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-sm flex items-center gap-1 border border-indigo-500/30",
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Globe, {
                          className: "w-3 h-3"
                        }), macro.location]
                      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
                        className: "px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-sm flex items-center gap-1 border border-purple-500/30",
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(JobIcon, {
                          job: macro.job,
                          size: 12
                        }), macro.job]
                      })]
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "flex flex-wrap gap-2 items-center",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                        className: "text-sm text-cyan-300",
                        children: "Crafts:"
                      }), macro.items.map((item, idx) => /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                        onClick: e => {
                          e.stopPropagation();
                          copyItemMacro(macro.id, idx);
                        },
                        className: "px-2 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded-md text-sm transition-all flex items-center gap-1 border border-slate-600/50",
                        children: copiedItemId === `${macro.id}-${idx}` ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Check, {
                            className: "w-3 h-3 text-green-400"
                          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            className: "text-green-400",
                            children: item.name
                          })]
                        }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Copy, {
                            className: "w-3 h-3 text-slate-400"
                          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            children: item.name
                          })]
                        })
                      }, idx))]
                    })]
                  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex items-center gap-2",
                    children: [macro.foodRequired && macro.foodType !== 'None' && /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
                      className: "flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md text-sm border border-emerald-500/30",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Coffee, {
                        className: "w-3 h-3"
                      }), macro.foodType]
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                      className: `text-sm px-2 py-1 rounded border ${macro.category.includes('Class A') && !macro.category.includes('Expert') ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : macro.category === 'Class A Expert' ? 'bg-red-500/20 text-red-300 border-red-500/30' : macro.category === 'Class B' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : macro.category === 'Class C' ? 'bg-green-500/20 text-green-300 border-green-500/30' : macro.category === 'Class D' ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' : macro.category === 'Sequential' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : macro.category === 'Time-Restricted' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : macro.category === 'Critical' ? 'bg-red-600/20 text-red-300 border-red-600/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`,
                      children: macro.category
                    }), expandedMacros[macro.id] ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.ChevronUp, {
                      className: "w-5 h-5 text-cyan-400"
                    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.ChevronDown, {
                      className: "w-5 h-5 text-cyan-400"
                    })]
                  })]
                })
              }), editingGeneral === macro.id && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: "border-t border-slate-700/50 p-4 bg-slate-900/30",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4",
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                      className: "block text-sm font-medium mb-1 text-cyan-300",
                      children: "Quest Name"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "text",
                      className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500",
                      defaultValue: macro.questName,
                      id: `questName-${macro.id}`
                    })]
                  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                      className: "block text-sm font-medium mb-1 text-cyan-300",
                      children: "Location"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("select", {
                      className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500",
                      defaultValue: macro.location,
                      id: `location-${macro.id}`,
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Sinus Ardorum",
                        children: "Sinus Ardorum"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Phaenna",
                        children: "Phaenna"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Sinus Ardorum/Phaenna",
                        children: "Sinus Ardorum/Phaenna"
                      })]
                    })]
                  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                      className: "block text-sm font-medium mb-1 text-cyan-300",
                      children: "Job"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("select", {
                      className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500",
                      defaultValue: macro.job,
                      id: `job-${macro.id}`,
                      children: jobList.map(job => /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: job,
                        children: job
                      }, job))
                    })]
                  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                      className: "block text-sm font-medium mb-1 text-cyan-300",
                      children: "Category"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("select", {
                      className: "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500",
                      defaultValue: macro.category,
                      id: `category-${macro.id}`,
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Class D",
                        children: "Class D"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Class C",
                        children: "Class C"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Class B",
                        children: "Class B"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Class A",
                        children: "Class A"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Class A Expert",
                        children: "Class A Expert"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Sequential",
                        children: "Sequential"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Time-Restricted",
                        children: "Time-Restricted"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                        value: "Critical",
                        children: "Critical"
                      })]
                    })]
                  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                      className: "block text-sm font-medium mb-1 text-cyan-300",
                      children: "Food"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "flex gap-2",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                        type: "checkbox",
                        className: "mt-2 accent-cyan-500",
                        defaultChecked: macro.foodRequired,
                        id: `foodRequired-${macro.id}`
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("select", {
                        className: "flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded focus:outline-none focus:border-cyan-500",
                        defaultValue: macro.foodType,
                        id: `foodType-${macro.id}`,
                        children: foodList.map(food => /*#__PURE__*/(0, _jsxRuntime.jsx)("option", {
                          value: food,
                          children: food
                        }, food))
                      })]
                    })]
                  })]
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "mb-4",
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
                    className: "block text-sm font-medium mb-1 text-cyan-300",
                    children: "Craft Requirements"
                  }), macro.items.map((item, idx) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex gap-2 mb-2",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "text",
                      className: "flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded",
                      defaultValue: item.name,
                      id: `itemName-${macro.id}-${idx}`
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "number",
                      className: "w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded",
                      defaultValue: item.difficulty,
                      id: `itemDifficulty-${macro.id}-${idx}`
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "number",
                      className: "w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded",
                      defaultValue: item.quality,
                      id: `itemQuality-${macro.id}-${idx}`
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "number",
                      className: "w-24 px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded",
                      defaultValue: item.durability,
                      id: `itemDurability-${macro.id}-${idx}`
                    })]
                  }, idx))]
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "mb-4",
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("label", {
                    className: "block text-sm font-medium mb-1 text-cyan-300",
                    children: ["Data Reward (", ((_document$getElementB = document.getElementById(`job-${macro.id}`)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.value) || macro.dataReward.job, ")"]
                  }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "grid grid-cols-4 gap-2",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "number",
                      placeholder: "I",
                      className: "px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded",
                      defaultValue: macro.dataReward.i,
                      id: `dataRewardI-${macro.id}`
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "number",
                      placeholder: "II",
                      className: "px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded",
                      defaultValue: macro.dataReward.ii,
                      id: `dataRewardII-${macro.id}`
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "number",
                      placeholder: "III",
                      className: "px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded",
                      defaultValue: macro.dataReward.iii,
                      id: `dataRewardIII-${macro.id}`
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
                      type: "number",
                      placeholder: "IV",
                      className: "px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded",
                      defaultValue: macro.dataReward.iv,
                      id: `dataRewardIV-${macro.id}`
                    })]
                  })]
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  className: "flex gap-2 justify-end",
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                    onClick: () => setEditingGeneral(null),
                    className: "px-4 py-2 bg-slate-600/50 hover:bg-slate-600/70 backdrop-blur-sm rounded transition-all border border-slate-500/30",
                    children: "Cancel"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                    onClick: () => {
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
                    },
                    className: "px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded transition-all shadow-lg shadow-green-900/30",
                    children: "Save"
                  })]
                })]
              }), expandedMacros[macro.id] && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                className: "border-t border-slate-700/50 p-4 space-y-4",
                children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex items-center justify-between mb-2",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h4", {
                      className: "font-semibold text-cyan-300",
                      children: "Craft Requirements"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                      onClick: () => addItemToMacro(macro.id),
                      className: "px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 backdrop-blur-sm rounded text-sm border border-indigo-500/30 transition-all",
                      children: "Add Item"
                    })]
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                    children: macro.items.map((item, idx) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "bg-slate-700/30 p-3 rounded-lg relative border border-slate-600/50",
                      children: [macro.items.length > 1 && /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                        onClick: () => removeItemFromMacro(macro.id, idx),
                        className: "absolute top-2 right-2 p-1 bg-red-600/50 hover:bg-red-600/70 rounded border border-red-500/30",
                        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.X, {
                          className: "w-3 h-3"
                        })
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                        className: "font-medium text-cyan-300 pr-6",
                        children: item.name
                      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                        className: "space-y-1 text-sm mt-2",
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
                          children: ["Difficulty: ", /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            className: `text-orange-400 ${searchMode === 'numeric' && difficultySearch && item.difficulty === parseInt(difficultySearch) ? 'font-bold bg-orange-500/20 px-1 rounded' : ''}`,
                            children: item.difficulty
                          })]
                        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
                          children: ["Quality: ", /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            className: `text-green-400 ${searchMode === 'numeric' && qualitySearch && item.quality === parseInt(qualitySearch) ? 'font-bold bg-green-500/20 px-1 rounded' : ''}`,
                            children: item.quality
                          })]
                        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
                          children: ["Durability: ", /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            className: `text-red-400 ${searchMode === 'numeric' && durabilitySearch && item.durability === parseInt(durabilitySearch) ? 'font-bold bg-red-500/20 px-1 rounded' : ''}`,
                            children: item.durability
                          })]
                        })]
                      })]
                    }, idx))
                  })]
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h4", {
                    className: "font-semibold mb-2 text-cyan-300",
                    children: "Data Reward"
                  }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                    className: "bg-slate-700/30 p-3 rounded-lg border border-slate-600/50",
                    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "flex flex-wrap gap-3",
                      children: [macro.dataReward.i > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                        className: "flex items-center gap-2 px-3 py-1 bg-gray-600/30 rounded-md border border-gray-500/50",
                        style: {
                          boxShadow: '0 0 10px rgba(156, 163, 175, 0.5)'
                        },
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(JobIcon, {
                          job: macro.dataReward.job || macro.job,
                          size: 16
                        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                          className: "text-gray-300 font-bold",
                          children: "I"
                        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
                          className: "text-gray-400 text-sm",
                          children: ["\xC3\u2014", macro.dataReward.i]
                        })]
                      }), macro.dataReward.ii > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                        className: "flex items-center gap-2 px-3 py-1 bg-yellow-600/30 rounded-md border border-yellow-500/50",
                        style: {
                          boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)'
                        },
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(JobIcon, {
                          job: macro.dataReward.job || macro.job,
                          size: 16
                        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                          className: "text-yellow-300 font-bold",
                          children: "II"
                        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
                          className: "text-yellow-400 text-sm",
                          children: ["\xC3\u2014", macro.dataReward.ii]
                        })]
                      }), macro.dataReward.iii > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                        className: "flex items-center gap-2 px-3 py-1 bg-blue-600/30 rounded-md border border-blue-500/50",
                        style: {
                          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                        },
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(JobIcon, {
                          job: macro.dataReward.job || macro.job,
                          size: 16
                        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                          className: "text-blue-300 font-bold",
                          children: "III"
                        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
                          className: "text-blue-400 text-sm",
                          children: ["\xC3\u2014", macro.dataReward.iii]
                        })]
                      }), macro.dataReward.iv > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                        className: "flex items-center gap-2 px-3 py-1 bg-purple-600/30 rounded-md border border-purple-500/50",
                        style: {
                          boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
                        },
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(JobIcon, {
                          job: macro.dataReward.job || macro.job,
                          size: 16
                        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                          className: "text-purple-300 font-bold",
                          children: "IV"
                        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("span", {
                          className: "text-purple-400 text-sm",
                          children: ["\xC3\u2014", macro.dataReward.iv]
                        })]
                      }), macro.dataReward.i === 0 && macro.dataReward.ii === 0 && macro.dataReward.iii === 0 && macro.dataReward.iv === 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                        className: "text-slate-400 text-sm",
                        children: "No data rewards"
                      })]
                    })
                  })]
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex items-center justify-between mb-2",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("h4", {
                      className: "font-semibold text-cyan-300",
                      children: ["Macro", macro.macros && macro.macros.length > 1 ? 's' : '']
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "flex gap-2",
                      children: [editingId !== macro.id && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("button", {
                          onClick: e => {
                            e.stopPropagation();
                            startEditing(macro.id, macro.macros ? macro.macros[0].macro : macro.macro);
                            setEditingMacroIndex(0);
                          },
                          className: "flex items-center gap-2 px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded transition-all border border-slate-600/50",
                          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Edit2, {
                            className: "w-4 h-4"
                          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            className: "text-sm",
                            children: "Edit"
                          })]
                        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                          onClick: e => {
                            e.stopPropagation();
                            copyMacro(macro.id, macro.macros ? macro.macros[0].macro : macro.macro);
                          },
                          className: "flex items-center gap-2 px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded transition-all border border-slate-600/50",
                          children: copiedId === macro.id ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Check, {
                              className: "w-4 h-4 text-green-400"
                            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                              className: "text-sm text-green-400",
                              children: "Copied!"
                            })]
                          }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Copy, {
                              className: "w-4 h-4"
                            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                              className: "text-sm",
                              children: "Copy"
                            })]
                          })
                        })]
                      }), editingId === macro.id && /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("button", {
                          onClick: e => {
                            e.stopPropagation();
                            if (macro.macros) {
                              const updatedMacros = [...macro.macros];
                              updatedMacros[editingMacroIndex] = {
                                ...updatedMacros[editingMacroIndex],
                                macro: editedMacro
                              };
                              setMacros(prev => prev.map(m => m.id === macro.id ? {
                                ...m,
                                macros: updatedMacros
                              } : m));
                            } else {
                              saveEdit(macro.id);
                            }
                            setEditingId(null);
                            setEditedMacro('');
                          },
                          className: "flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded transition-all",
                          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Save, {
                            className: "w-4 h-4"
                          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            className: "text-sm",
                            children: "Save"
                          })]
                        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("button", {
                          onClick: e => {
                            e.stopPropagation();
                            cancelEdit();
                          },
                          className: "flex items-center gap-2 px-3 py-1 bg-red-600/50 hover:bg-red-600/70 rounded transition-all border border-red-500/30",
                          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.X, {
                            className: "w-4 h-4"
                          }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                            className: "text-sm",
                            children: "Cancel"
                          })]
                        })]
                      })]
                    })]
                  }), editingId === macro.id ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "space-y-2",
                    children: [macro.macros && editingMacroIndex < macro.macros.length && /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "text-sm text-cyan-300",
                      children: ["Editing macro for: ", macro.macros[editingMacroIndex].itemName]
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("textarea", {
                      value: editedMacro,
                      onChange: e => setEditedMacro(e.target.value),
                      className: "w-full bg-slate-900/50 p-3 rounded-lg text-sm font-mono border border-slate-600/50 focus:outline-none focus:border-cyan-500",
                      rows: 10,
                      onClick: e => e.stopPropagation()
                    })]
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
                    children: macro.macros ? /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                      className: "space-y-4",
                      children: macro.macros.map((macroItem, idx) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                        className: "bg-slate-900/50 rounded-lg p-3 border border-slate-600/50",
                        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                          className: "flex items-center justify-between mb-2",
                          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h5", {
                            className: "text-sm font-medium text-cyan-300",
                            children: macroItem.itemName
                          }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                            className: "flex gap-2",
                            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                              onClick: e => {
                                e.stopPropagation();
                                startEditing(macro.id, macroItem.macro);
                                setEditingMacroIndex(idx);
                              },
                              className: "p-1 hover:bg-slate-700/50 rounded",
                              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Edit2, {
                                className: "w-3 h-3 text-cyan-400"
                              })
                            }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                              onClick: e => {
                                e.stopPropagation();
                                copyMacro(`${macro.id}-${idx}`, macroItem.macro);
                              },
                              className: "p-1 hover:bg-slate-700/50 rounded",
                              children: copiedId === `${macro.id}-${idx}` ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Check, {
                                className: "w-3 h-3 text-green-400"
                              }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Copy, {
                                className: "w-3 h-3"
                              })
                            })]
                          })]
                        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("pre", {
                          className: "text-sm font-mono overflow-x-auto text-gray-300",
                          children: macroItem.macro
                        })]
                      }, idx))
                    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("pre", {
                      className: "bg-slate-900/50 p-3 rounded-lg text-sm font-mono overflow-x-auto border border-slate-600/50 text-gray-300",
                      children: macro.macro
                    })
                  })]
                }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex items-center justify-between mb-2",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h4", {
                      className: "font-semibold text-cyan-300",
                      children: "Notes"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("button", {
                      onClick: e => {
                        e.stopPropagation();
                        setEditingNotes(macro.id);
                        setEditedNotes(macro.notes || '');
                      },
                      className: "flex items-center gap-2 px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded transition-all border border-slate-600/50",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Edit2, {
                        className: "w-4 h-4"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                        className: "text-sm",
                        children: "Edit"
                      })]
                    })]
                  }), editingNotes === macro.id ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "space-y-2",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("textarea", {
                      value: editedNotes,
                      onChange: e => setEditedNotes(e.target.value),
                      className: "w-full bg-slate-700/30 p-3 rounded text-gray-300 border border-slate-600/50",
                      rows: 3
                    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                      className: "flex gap-2",
                      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                        onClick: () => {
                          setMacros(prev => prev.map(m => m.id === macro.id ? {
                            ...m,
                            notes: editedNotes
                          } : m));
                          setEditingNotes(null);
                          setEditedNotes('');
                        },
                        className: "px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded",
                        children: "Save"
                      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                        onClick: () => {
                          setEditingNotes(null);
                          setEditedNotes('');
                        },
                        className: "px-3 py-1 bg-red-600/50 hover:bg-red-600/70 rounded border border-red-500/30",
                        children: "Cancel"
                      })]
                    })]
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
                    className: "text-gray-400",
                    children: macro.notes || 'No notes added.'
                  })]
                }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
                  className: "pt-4 border-t border-slate-700/50",
                  children: deleteConfirm === macro.id ? /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
                    className: "flex items-center justify-center gap-2",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                      className: "text-red-400",
                      children: "Are you sure?"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                      onClick: () => deleteMacro(macro.id),
                      className: "px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded transition-all",
                      children: "Yes"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
                      onClick: () => setDeleteConfirm(null),
                      className: "px-4 py-2 bg-red-600/50 hover:bg-red-600/70 rounded transition-all border border-red-500/30",
                      children: "No"
                    })]
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("button", {
                    onClick: () => setDeleteConfirm(macro.id),
                    className: "w-full px-4 py-2 bg-red-600/30 hover:bg-red-600/50 backdrop-blur-sm rounded transition-all flex items-center justify-center gap-2 border border-red-500/30",
                    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_lucideReact.Trash2, {
                      className: "w-4 h-4"
                    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                      children: "Delete Entry"
                    })]
                  })
                })]
              })]
            }, macro.id);
          })
        }), macros.length === 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "text-center py-12",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
            className: "text-cyan-300 text-lg",
            children: "No data"
          })
        }), macros.length > 0 && filteredMacros.length === 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
          className: "text-center py-12",
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
            className: "text-cyan-300",
            children: "No missions found matching your criteria."
          })
        })]
      })
    });
  };
  // Export as default for module systems
  var _default = _exports.default = FFXIVMacroDatabase;

  // Also attach to window for direct browser usage
  if (typeof window !== "undefined") {
    window.FFXIVMacroDatabase = FFXIVMacroDatabase;
  }
});
