import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, RotateCcw, Save, Copy, Check, AlertCircle, Download } from 'lucide-react';
import { useStore } from '../store/useStore';

type TabKey = 'drivers' | 'loads' | 'alerts' | 'metrics';

const TAB_LABELS: Record<TabKey, string> = {
  drivers: 'Drivers',
  loads: 'Loads',
  alerts: 'Alerts',
  metrics: 'Metrics',
};

export default function Debug() {
  const { drivers, loads, alerts, metrics, setDrivers, setLoads, setAlerts, setMetrics, resetToMocks } = useStore();
  const [tab, setTab] = useState<TabKey>('drivers');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [copiedFlash, setCopiedFlash] = useState(false);

  const currentData = tab === 'drivers' ? drivers : tab === 'loads' ? loads : tab === 'alerts' ? alerts : metrics;

  // Sync draft when tab changes or store data changes externally
  useEffect(() => {
    setDraft(JSON.stringify(currentData, null, 2));
    setError(null);
  }, [tab, currentData]);

  const commit = () => {
    try {
      const parsed = JSON.parse(draft);
      if (tab === 'metrics') {
        if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
          throw new Error('Metrics must be an object');
        }
        setMetrics(parsed);
      } else {
        if (!Array.isArray(parsed)) throw new Error(`${TAB_LABELS[tab]} must be a JSON array`);
        if (tab === 'drivers') setDrivers(parsed);
        else if (tab === 'loads') setLoads(parsed);
        else if (tab === 'alerts') setAlerts(parsed);
      }
      setError(null);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1400);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopiedFlash(true);
      setTimeout(() => setCopiedFlash(false), 1400);
    } catch {
      setError('Clipboard copy failed — browser may have blocked it');
    }
  };

  const downloadJson = () => {
    const blob = new Blob([draft], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock_${tab}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetCurrent = () => {
    if (!confirm(`Reset ${TAB_LABELS[tab]} to defaults? This discards your edits.`)) return;
    resetToMocks();
  };

  const addTemplate = () => {
    try {
      const parsed = JSON.parse(draft);
      if (tab === 'metrics') {
        setError('Metrics is a single object — nothing to add');
        return;
      }
      if (!Array.isArray(parsed)) throw new Error('Expected array');
      const template = makeTemplate(tab);
      parsed.unshift(template);
      setDraft(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add template — fix JSON first');
    }
  };

  const entryCount = tab === 'metrics' ? 1 : (currentData as unknown[]).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* Header */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '2px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fleet Data Debug</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Edit mock data live — changes apply to this session only</div>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset ALL fleet data to original mocks?')) resetToMocks();
          }}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
        >
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--bg-border)' }}>
          {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => {
            const count = key === 'metrics' ? 1 : (useStore.getState()[key] as unknown[]).length;
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s',
                }}
              >
                {TAB_LABELS[key]}
                <span style={{
                  padding: '1px 8px',
                  borderRadius: '20px',
                  background: isActive ? 'var(--accent-primary)' : '#F1F5F9',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  fontSize: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div style={{
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--bg-border-light)',
          background: '#FAFBFC',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {tab !== 'metrics' && (
              <button onClick={addTemplate} className="btn-secondary" style={toolbarBtnStyle}>
                + Add New
              </button>
            )}
            <button onClick={copyToClipboard} className="btn-secondary" style={toolbarBtnStyle}>
              {copiedFlash ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
            <button onClick={downloadJson} className="btn-secondary" style={toolbarBtnStyle}>
              <Download size={12} /> Export
            </button>
            <button onClick={resetCurrent} className="btn-secondary" style={{ ...toolbarBtnStyle, color: 'var(--accent-red)' }}>
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={commit} className="btn-primary" style={{ ...toolbarBtnStyle, padding: '6px 14px' }}>
              {savedFlash ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save</>}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#FEF2F2',
            borderBottom: '1px solid #FCA5A5',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--accent-red)',
            fontFamily: 'Inter, sans-serif',
          }}>
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Editor */}
        <textarea
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setError(null); }}
          spellCheck={false}
          style={{
            width: '100%',
            minHeight: 'calc(100vh - 260px)',
            padding: '14px 18px',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
            fontSize: '12px',
            lineHeight: 1.55,
            color: 'var(--text-primary)',
            background: 'var(--bg-surface)',
            tabSize: 2,
          }}
        />
      </div>
    </motion.div>
  );
}

const toolbarBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 10px',
  fontSize: '11px',
  fontWeight: 500,
};

function makeTemplate(tab: TabKey): unknown {
  if (tab === 'drivers') {
    return {
      id: `D-${Math.floor(Math.random() * 900 + 100)}`,
      name: 'New Driver',
      avatar: 'ND',
      truckId: `T-${Math.floor(Math.random() * 9000 + 1000)}`,
      truckType: 'dry-van',
      status: 'off-duty',
      location: { lat: 39.5, lng: -98.35, city: 'Kansas City', state: 'MO', lastUpdated: 'just now' },
      hos: { driveRemaining: 11, dutyRemaining: 14, cycleRemaining: 70, nextBreakIn: 8, restartAvailable: true },
      performance: { onTimeRate: 95, avgCostPerMile: 1.85, safetyScore: 90, totalMilesThisWeek: 0 },
      currentLoadId: null,
      phone: '(555) 000-0000',
    };
  }
  if (tab === 'loads') {
    return {
      id: `L-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: 'pending',
      pickup: { city: 'Dallas', state: 'TX', address: '100 Main St', lat: 32.7767, lng: -96.797, time: '06:00', windowHours: 2 },
      delivery: { city: 'Atlanta', state: 'GA', address: '200 Peachtree', lat: 33.749, lng: -84.388, time: '18:00' },
      commodity: 'General freight',
      weight: 40000,
      miles: 780,
      rate: 2200,
      assignedDriverId: null,
      brokerName: 'New Broker',
      priority: 'standard',
    };
  }
  if (tab === 'alerts') {
    return {
      id: `A-${Math.floor(Math.random() * 900 + 100)}`,
      type: 'delay',
      severity: 'warning',
      driverId: 'D-001',
      title: 'New Alert',
      description: 'Describe the alert here.',
      actionRequired: 'What to do next.',
      timestamp: 'just now',
      acknowledged: false,
    };
  }
  return {};
}
