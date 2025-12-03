// Minimal demo component
const FFXIVMacroDatabase = () => {
  return (
    <div style={{ padding: "20px", background: "#222", color: "#eee" }}>
      <h2>Hello from JSX!</h2>
      <p>
        If you see this message, your JSX loader is working correctly.
      </p>
    </div>
  );
};

// Expose globally so index.html can render it
window.FFXIVMacroDatabase = FFXIVMacroDatabase;
