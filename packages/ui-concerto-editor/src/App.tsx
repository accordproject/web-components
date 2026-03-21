import { useState, useCallback } from 'react';
import { ConcertoGraphEditor } from './components/ConcertoGraphEditor';
import { defaultCto } from './utils/defaultModel';

export default function App() {
  const [cto, setCto] = useState(defaultCto);

  const handleModelChange = useCallback((newCto: string) => {
    setCto(newCto);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left: CTO text editor */}
      <div style={{ width: '35%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0' }}>
        <div style={headerStyle}>Concerto Model (.cto)</div>
        <textarea
          value={cto}
          onChange={(e) => setCto(e.target.value)}
          style={textareaStyle}
          spellCheck={false}
        />
      </div>

      {/* Right: Graphical editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={headerStyle}>Graphical Editor</div>
        <ConcertoGraphEditor cto={cto} onModelChange={handleModelChange} />
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: '#2d3748',
  color: '#fff',
  fontSize: 14,
  fontWeight: 600,
  flexShrink: 0,
};

const textareaStyle: React.CSSProperties = {
  flex: 1,
  padding: 16,
  fontFamily: 'monospace',
  fontSize: 13,
  border: 'none',
  outline: 'none',
  resize: 'none',
  background: '#1a202c',
  color: '#e2e8f0',
  lineHeight: 1.6,
};
