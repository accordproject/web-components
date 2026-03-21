import { useState, useCallback } from 'react';
import { ConcertoGraphEditor } from './components/ConcertoGraphEditor';
import { CtoEditor } from './components/CtoEditor';
import { defaultCto } from './utils/defaultModel';

export default function App() {
  const [cto, setCto] = useState(defaultCto);
  const [showText, setShowText] = useState(true);

  const handleModelChange = useCallback((newCto: string) => {
    setCto(newCto);
  }, []);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cto';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setCto(reader.result as string);
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = () => {
    const blob = new Blob([cto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model.cto';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
      {/* Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {showText && (
          <div style={{ width: '35%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #4a5568' }}>
            <CtoEditor value={cto} onChange={setCto} />
          </div>
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ConcertoGraphEditor
            cto={cto}
            onModelChange={handleModelChange}
            showText={showText}
            onToggleText={() => setShowText(!showText)}
            onImport={handleImport}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}

