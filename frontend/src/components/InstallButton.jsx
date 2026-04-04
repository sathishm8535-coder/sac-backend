import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallButton = () => {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setPrompt(null);
  };

  if (installed || !prompt) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 bg-white text-indigo-900 px-3 py-1.5 rounded-lg text-sm font-semibold shadow hover:bg-indigo-50 transition"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Install App</span>
    </button>
  );
};

export default InstallButton;
