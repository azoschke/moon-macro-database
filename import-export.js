// Import/Export utility functions for FFXIV Macro Database

window.FFXIVImportExport = {
  // Escape CSV values
  escapeCSV: function(text) {
    if (text == null) return '';
    text = String(text);
    if (text.includes(',') || text.includes('\n') || text.includes('"')) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  },

  // Export database to CSV
  exportToCSV: function() {
    try {
      const data = localStorage.getItem('ffxiv-macro-database');

      if (!data) {
        alert('No FFXIV database found in localStorage!');
        return;
      }

      const macros = JSON.parse(data);

      if (!Array.isArray(macros) || macros.length === 0) {
        alert('Database is empty!');
        return;
      }

      // Create CSV header
      const headers = [
        'Quest Name',
        'Location',
        'Job',
        'Category',
        'Food Required',
        'Food Type',
        'Item Name',
        'Difficulty',
        'Quality',
        'Durability',
        'Data Reward Job',
        'Data I',
        'Data II',
        'Data III',
        'Data IV',
        'Data V',
        'Macro',
        'Notes'
      ];

      let csv = headers.join(',') + '\n';

      // Process each macro entry
      macros.forEach(macro => {
        if (macro.items && macro.items.length > 0) {
          macro.items.forEach((item, idx) => {
            const row = [];

            row.push(this.escapeCSV(macro.questName));
            row.push(this.escapeCSV(macro.location));
            row.push(this.escapeCSV(macro.job));
            row.push(this.escapeCSV(macro.category));
            row.push(macro.foodRequired ? 'Yes' : 'No');
            row.push(this.escapeCSV(macro.foodType || 'None'));

            row.push(this.escapeCSV(item.name));
            row.push(item.difficulty || 0);
            row.push(item.quality || 0);
            row.push(item.durability || 0);

            if (macro.dataReward) {
              row.push(this.escapeCSV(macro.dataReward.job || macro.job));
              row.push(macro.dataReward.i || 0);
              row.push(macro.dataReward.ii || 0);
              row.push(macro.dataReward.iii || 0);
              row.push(macro.dataReward.iv || 0);
              row.push(macro.dataReward.v || 0);
            } else {
              row.push(this.escapeCSV(macro.job));
              row.push(0, 0, 0, 0, 0);
            }

            let macroText = '';
            if (macro.macros && macro.macros[idx]) {
              macroText = macro.macros[idx].macro;
            } else if (idx === 0 && macro.macro) {
              macroText = macro.macro;
            }
            row.push(this.escapeCSV(macroText));
            row.push(this.escapeCSV(macro.notes || ''));

            csv += row.join(',') + '\n';
          });
        } else {
          const row = [
            this.escapeCSV(macro.questName),
            this.escapeCSV(macro.location),
            this.escapeCSV(macro.job),
            this.escapeCSV(macro.category),
            macro.foodRequired ? 'Yes' : 'No',
            this.escapeCSV(macro.foodType || 'None'),
            '', 0, 0, 0,
            this.escapeCSV(macro.dataReward?.job || macro.job),
            macro.dataReward?.i || 0,
            macro.dataReward?.ii || 0,
            macro.dataReward?.iii || 0,
            macro.dataReward?.iv || 0,
            macro.dataReward?.v || 0,
            this.escapeCSV(macro.macro || ''),
            this.escapeCSV(macro.notes || '')
          ];
          csv += row.join(',') + '\n';
        }
      });

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const now = new Date();
      const timestamp = now.toISOString().slice(0, 10);

      link.setAttribute('href', url);
      link.setAttribute('download', `ffxiv-macros-${timestamp}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Successfully exported ${macros.length} entries to CSV!`);

    } catch (error) {
      console.error('Export error:', error);
      alert(`Error exporting data: ${error.message}`);
    }
  },

  // Export database as JSON
  exportToJSON: function() {
    try {
      const data = localStorage.getItem('ffxiv-macro-database');

      if (!data) {
        alert('No FFXIV database found in localStorage!');
        return;
      }

      const macros = JSON.parse(data);

      if (!Array.isArray(macros) || macros.length === 0) {
        alert('Database is empty!');
        return;
      }

      const blob = new Blob([data], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const now = new Date();
      const timestamp = now.toISOString().slice(0, 10);

      link.setAttribute('href', url);
      link.setAttribute('download', `ffxiv-macros-${timestamp}.json`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert(`Successfully exported ${macros.length} entries to JSON!`);

    } catch (error) {
      console.error('Export error:', error);
      alert(`Error exporting data: ${error.message}`);
    }
  },

  // Import database from JSON
  importFromJSON: function(file, callback) {
    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!Array.isArray(importedData)) {
          alert('Invalid file format. Expected an array of macros.');
          return;
        }

        // Validate data structure
        const isValid = importedData.every(macro =>
          macro.questName && macro.job && macro.items
        );

        if (!isValid) {
          alert('Invalid data structure in imported file.');
          return;
        }

        // Ask for confirmation
        const currentData = localStorage.getItem('ffxiv-macro-database');
        let confirmMessage = `Import ${importedData.length} entries?`;

        if (currentData) {
          const currentMacros = JSON.parse(currentData);
          confirmMessage = `This will replace your current ${currentMacros.length} entries with ${importedData.length} new entries. Continue?`;
        }

        if (confirm(confirmMessage)) {
          localStorage.setItem('ffxiv-macro-database', JSON.stringify(importedData));
          alert(`Successfully imported ${importedData.length} entries!`);

          // Trigger callback to refresh the UI
          if (callback) callback();
        }

      } catch (error) {
        console.error('Import error:', error);
        alert(`Error importing data: ${error.message}`);
      }
    };

    reader.readAsText(file);
  }
};
