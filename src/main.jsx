import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  Hammer,
  Home,
  Mic,
  PackageCheck,
  PhoneOutgoing,
  Send,
  Sparkles,
  Store,
  Volume2,
} from 'lucide-react';
import './styles.css';

const demoPhrase =
  "I'm building a garden room similar to the Weymouth job, but slightly bigger. I need plasterboard by Tuesday.";

const jobs = [
  {
    id: 'weymouth',
    type: 'Garden Room',
    location: 'Weymouth',
    date: 'May 2025',
    size: '4m x 3m',
    image: 'room',
    remembered: 6,
    leftovers: 3,
    materials: [
      '18 plasterboard sheets',
      '12 OSB boards',
      '38 CLS studs',
      '5 insulation packs',
      '2 boxes drywall screws',
      '6 grab adhesive tubes',
    ],
    leftoverList: ['3 plasterboard sheets', 'half box drywall screws', '1 insulation pack'],
    notes: [
      'Used moisture board near door after rain issue',
      'Selco delivered late, Jewson more reliable',
      'Customer wanted extra insulation',
    ],
  },
  {
    id: 'decking',
    type: 'Decking',
    location: 'Bournemouth',
    date: 'March 2025',
    image: 'deck',
    remembered: 5,
    leftovers: 2,
  },
  {
    id: 'loft',
    type: 'Loft Conversion',
    location: 'Poole',
    date: 'January 2025',
    image: 'loft',
    remembered: 8,
    leftovers: 4,
  },
];

const suppliers = [
  {
    name: 'Selco',
    stock: 'In stock',
    timing: 'Delivery Tuesday AM',
    price: '£13.80 per sheet',
    tag: 'Best for certainty',
    tone: 'green',
    url: 'https://www.selcobw.com/',
  },
  {
    name: 'Screwfix',
    stock: 'Limited stock nearby',
    timing: 'Click & collect today',
    price: '£12.95 per sheet',
    tag: 'Cheapest',
    tone: 'amber',
    url: 'https://www.screwfix.com/',
  },
  {
    name: 'Jewson',
    stock: 'In stock',
    timing: 'Delivery Wednesday',
    price: '£14.10 per sheet',
    tag: 'Your usual merchant',
    tone: 'green',
    url: 'https://www.jewson.co.uk/',
  },
];

const orderMaterials = [
  '19 plasterboard sheets',
  '12 OSB boards',
  '42 CLS studs',
  '6 insulation packs',
  '2 boxes drywall screws',
  '6 grab adhesive tubes',
];

const steps = [
  'Checking Weymouth job...',
  'Looking at what you used last time...',
  'Checking likely leftovers...',
  'Finding options for Tuesday...',
];

function App() {
  const [screen, setScreen] = useState('home');
  const [typed, setTyped] = useState('');
  const [listening, setListening] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (screen !== 'listen') return;
    setListening(true);
    setTyped('');
    setLoadingStep(0);

    const listenTimer = window.setTimeout(() => {
      setTyped(demoPhrase);
      setListening(false);
    }, 1100);

    const resultTimer = window.setTimeout(() => {
      setScreen('memory');
    }, 5200);

    const interval = window.setInterval(() => {
      setLoadingStep((current) => Math.min(current + 1, steps.length - 1));
    }, 1050);

    return () => {
      window.clearTimeout(listenTimer);
      window.clearTimeout(resultTimer);
      window.clearInterval(interval);
    };
  }, [screen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = (next) => {
    setToast('');
    setScreen(next);
  };

  const showToast = (message) => setToast(message);

  return (
    <div className="app-shell">
      <PhoneFrame>
        {screen !== 'home' && <TopBar onBack={() => navigate(previousScreen(screen))} onHome={() => navigate('home')} />}

        {screen === 'home' && <HomeScreen typed={typed} setTyped={setTyped} onStart={() => navigate('listen')} />}
        {screen === 'listen' && <VoiceScreen typed={typed} listening={listening} loadingStep={loadingStep} />}
        {screen === 'memory' && <MemoryScreen onNext={() => navigate('suppliers')} />}
        {screen === 'suppliers' && <SuppliersScreen onNext={() => navigate('order')} showToast={showToast} />}
        {screen === 'order' && <OrderScreen showToast={showToast} />}

        {toast && (
          <div className="toast" role="status">
            <Check size={18} />
            {toast}
          </div>
        )}
      </PhoneFrame>
    </div>
  );
}

function previousScreen(screen) {
  if (screen === 'listen') return 'home';
  if (screen === 'memory') return 'home';
  if (screen === 'suppliers') return 'memory';
  if (screen === 'order') return 'suppliers';
  return 'home';
}

function PhoneFrame({ children }) {
  return (
    <main className="phone-frame">
      <div className="status-strip">
        <span>Builder Brain</span>
        <span>Demo mode</span>
      </div>
      {children}
    </main>
  );
}

function TopBar({ onBack, onHome }) {
  return (
    <nav className="topbar" aria-label="Screen controls">
      <button className="icon-button" type="button" onClick={onBack} aria-label="Back">
        <ArrowLeft size={21} />
      </button>
      <button className="home-pill" type="button" onClick={onHome}>
        <Home size={17} />
        Home
      </button>
    </nav>
  );
}

function HomeScreen({ typed, setTyped, onStart }) {
  return (
    <section className="screen home-screen">
      <div className="hero-block">
        <div className="brand-mark">
          <Hammer size={22} />
        </div>
        <p className="eyebrow">Your jobs, remembered</p>
        <h1>What are you working on?</h1>
        <p className="hero-copy">Talk it through. I’ll remember the old job, likely leftovers, and what to order.</p>
      </div>

      <button className="voice-cta" type="button" onClick={onStart}>
        <span className="mic-ring">
          <Mic size={34} />
        </span>
        <span>
          <strong>Talk to Builder Brain</strong>
          <small>Try the Weymouth garden room demo</small>
        </span>
      </button>

      <label className="text-fallback">
        <span>Or type a quick note</span>
        <div className="input-row">
          <input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder="e.g. Garden room like Weymouth"
          />
          <button type="button" onClick={onStart} aria-label="Send note">
            <Send size={19} />
          </button>
        </div>
      </label>

      <section className="recent-section">
        <div className="section-heading">
          <h2>Recent jobs</h2>
          <span>Tap one later</span>
        </div>
        <div className="job-list">
          {jobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className={`job-photo ${job.image}`}>
                <PackageCheck size={22} />
              </div>
              <div className="job-info">
                <h3>{job.type}</h3>
                <p>
                  {job.location} · {job.date}
                </p>
                <div className="chip-row">
                  <span className="chip">{job.remembered} materials remembered</span>
                  <span className="chip chip-warm">{job.leftovers} leftovers tracked</span>
                </div>
              </div>
              <ChevronRight className="chevron" size={19} />
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function VoiceScreen({ typed, listening, loadingStep }) {
  return (
    <section className="screen voice-screen">
      <div className="listening-card">
        <div className={`pulse-mic ${listening ? 'active' : ''}`}>
          {listening ? <Mic size={40} /> : <Volume2 size={40} />}
        </div>
        <p className="eyebrow">{listening ? 'Listening' : 'Heard this'}</p>
        <h1>{listening ? 'Say it messy.' : 'Garden room, slightly bigger.'}</h1>
        <p className="transcript">{typed || 'Listening for the job, place, and what you need next...'}</p>
      </div>

      <div className="thinking-card">
        <div className="mini-loader">
          <Sparkles size={18} />
        </div>
        <div>
          <h2>Builder Brain is checking</h2>
          <ul>
            {steps.map((step, index) => (
              <li className={index <= loadingStep ? 'done' : ''} key={step}>
                <span>{index < loadingStep ? <Check size={15} /> : index === loadingStep ? <span className="dot" /> : null}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MemoryScreen({ onNext }) {
  const weymouth = jobs[0];

  return (
    <section className="screen result-screen">
      <div className="matched-job">
        <p className="eyebrow">Matched previous job</p>
        <h1>Garden Room — Weymouth</h1>
        <p>May 2025 · {weymouth.size}</p>
        <div className="confidence">
          <Sparkles size={17} />
          Good estimate — based on your Weymouth job
        </div>
      </div>

      <GroupedList title="What you used last time" items={weymouth.materials} />
      <GroupedList title="Likely leftover" items={weymouth.leftoverList} warm />

      <section className="suggestion-panel">
        <p className="eyebrow">Suggestion</p>
        <h2>Order 19 more plasterboard sheets.</h2>
        <p>For a slightly bigger room, you’ll probably need 22 sheets. If the 3 leftovers are still usable, order 19 more.</p>
      </section>

      <section className="notes-panel">
        <h2>Worth remembering</h2>
        {weymouth.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </section>

      <button className="primary-action" type="button" onClick={onNext}>
        Check Tuesday options
        <ChevronRight size={20} />
      </button>
    </section>
  );
}

function GroupedList({ title, items, warm = false }) {
  return (
    <section className={`group-card ${warm ? 'warm' : ''}`}>
      <h2>{title}</h2>
      <div className="material-list">
        {items.map((item) => (
          <div className="material-row" key={item}>
            <span className="tick">
              <Check size={14} />
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SuppliersScreen({ onNext, showToast }) {
  return (
    <section className="screen suppliers-screen">
      <div className="screen-title">
        <p className="eyebrow">Plasterboard options</p>
        <h1>Best bet for Tuesday</h1>
        <p>Stock shown for demo. Check supplier before ordering.</p>
      </div>

      <div className="supplier-list">
        {suppliers.map((supplier) => (
          <article className="supplier-card" key={supplier.name}>
            <div className="supplier-top">
              <div className="store-icon">
                <Store size={22} />
              </div>
              <div>
                <h2>{supplier.name}</h2>
                <p>{supplier.timing}</p>
              </div>
              <span className={`stock-chip ${supplier.tone}`}>{supplier.stock}</span>
            </div>
            <div className="supplier-detail">
              <strong>{supplier.price}</strong>
              <span>{supplier.tag}</span>
            </div>
            <a className="secondary-action" href={supplier.url} target="_blank" rel="noreferrer">
              Open supplier
              <ChevronRight size={18} />
            </a>
          </article>
        ))}
      </div>

      <div className="action-stack">
        <button className="primary-action" type="button" onClick={onNext}>
          Make order list
          <ChevronRight size={20} />
        </button>
        <button className="quiet-action" type="button" onClick={() => showToast('Order list copied')}>
          <Copy size={18} />
          Copy order list
        </button>
        <button className="quiet-action" type="button" onClick={() => showToast('Text ready for supplier')}>
          <PhoneOutgoing size={18} />
          Text this to supplier
        </button>
        <button className="quiet-action" type="button" onClick={() => showToast('Saved to Bournemouth job')}>
          <PackageCheck size={18} />
          Save to job
        </button>
      </div>
    </section>
  );
}

function OrderScreen({ showToast }) {
  const orderText = useMemo(
    () =>
      [
        'Garden Room — Bournemouth',
        'Based on Weymouth job, adjusted slightly bigger',
        '',
        ...orderMaterials,
        '',
        'Note: assumes 3 plasterboard sheets left from Weymouth are still usable.',
      ].join('\n'),
    [],
  );

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      showToast('Copied to clipboard');
    } catch {
      showToast('Copy ready');
    }
  };

  return (
    <section className="screen order-screen">
      <div className="order-header">
        <p className="eyebrow">Order list</p>
        <h1>Garden Room — Bournemouth</h1>
        <p>Based on Weymouth job, adjusted slightly bigger.</p>
      </div>

      <section className="order-card">
        <h2>Materials</h2>
        {orderMaterials.map((material) => (
          <div className="order-row" key={material}>
            <span>{material}</span>
            <Check size={17} />
          </div>
        ))}
        <div className="order-note">
          Assumes 3 plasterboard sheets left from Weymouth are still usable.
        </div>
      </section>

      <div className="action-stack sticky-actions">
        <button className="primary-action" type="button" onClick={copyOrder}>
          <Copy size={19} />
          Copy
        </button>
        <button className="quiet-action" type="button" onClick={() => showToast("Text sent to Mike's merchant")}>
          <Send size={18} />
          Send to Mike’s merchant
        </button>
        <button className="quiet-action" type="button" onClick={() => showToast('Marked as ordered')}>
          <PackageCheck size={18} />
          Mark as ordered
        </button>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
