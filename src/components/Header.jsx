export default function Header({ darkMode, setDarkMode }) {
  return (
    <header
      className={`mx-auto w-full max-w-[min(100vw-2rem,120rem)] mb-4 md:mb-6 flex items-center justify-between rounded-2xl px-4 py-3 ring-1 transition-colors ${
        darkMode ? 'bg-white/8 ring-white/10' : 'bg-amber-50/90 ring-amber-200/60'
      }`}
    >
      <div className="flex items-center gap-4">
        <img src="/logo.png" alt="Gumdrop Studio" className="h-20 w-20 rounded" />
        <span className="workbench-brand text-lg md:text-4xl tracking-wide">Gumdrop Studio</span>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
          darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-amber-100/70 hover:bg-amber-100/90'
        }`}
        title="Toggle dark/light mode"
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}

