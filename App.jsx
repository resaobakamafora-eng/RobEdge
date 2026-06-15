import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Trash2,
  ListOrdered,
  Plus,
  Check,
  Bot,
  Palette,
  Home as HomeIcon,
  ScanLine,
  Terminal,
  Upload,
  Zap,
  Settings,
  X,
  ChevronDown,
  Send,
  TrendingUp,
  TrendingDown,
  CheckCheck,
  Image as ImageIcon,
  LineChart,
  Eye,
  EyeOff,
  Server,
  User,
  Lock,
} from "lucide-react";

const THEMES = {
  amber: { name: "Amber", accent: "#F5A623", accentSoft: "#F5A62333" },
  violet: { name: "Violet", accent: "#8B5CF6", accentSoft: "#8B5CF633" },
  emerald: { name: "Emerald", accent: "#34D399", accentSoft: "#34D39933" },
  cyan: { name: "Cyan", accent: "#22D3EE", accentSoft: "#22D3EE33" },
  rose: { name: "Rose", accent: "#FB7185", accentSoft: "#FB718533" },
};
const THEME_ORDER = ["amber", "violet", "emerald", "cyan", "rose"];

const BOTS = [
  { id: 1, name: "Apex Drift" },
  { id: 2, name: "Quiet Reversal" },
];

const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1", "H4", "D1"];

const BROKERS = [
  "Any broker (auto-detect)",
  "MT5 — Exness",
  "MT5 — IC Markets",
  "MT5 — Pepperstone",
  "MT4 — XM",
  "MT4 — FBS",
  "MT4 — HotForex",
];

const ACCOUNT_TYPES = ["MT5", "MT4"];

function ActionButton({ icon: Icon, label, theme, primary }) {
  return (
    <button className="flex flex-col items-center gap-2 flex-1">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: primary ? theme.accent : "#262B38",
          color: primary ? "#0B0E14" : theme.accent,
        }}
      >
        <Icon size={20} fill={primary ? "#0B0E14" : "none"} />
      </div>
      <span className="text-xs font-semibold" style={{ color: "#C2C7D1" }}>
        {label}
      </span>
    </button>
  );
}

function ScreenTitle({ children, theme, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2
        className="text-xl font-extrabold tracking-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F3F4F6" }}
      >
        {children}
      </h2>
      {action}
    </div>
  );
}

function HomeScreen({ theme, activeBot, setActiveBot }) {
  const bot = BOTS.find((b) => b.id === activeBot);
  return (
    <div className="relative flex flex-col items-center px-5 pt-6 pb-4">
      <div className="text-xs font-semibold tracking-[0.2em] mb-2" style={{ color: "#8B92A4" }}>
        ROBEDGE
      </div>

      <div
        className="relative w-36 h-36 rounded-full flex items-center justify-center mb-6"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${theme.accent}55, #0B0E14 70%)`,
          border: `2px solid ${theme.accent}`,
          boxShadow: `0 0 40px ${theme.accentSoft}`,
        }}
      >
        <Bot size={56} style={{ color: theme.accent }} />
      </div>

      <p className="text-sm mb-1" style={{ color: "#8B92A4" }}>
        You are running
      </p>
      <h2
        className="text-3xl font-extrabold text-center mb-1 tracking-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F3F4F6" }}
      >
        {bot.name.toUpperCase()}
      </h2>
      <p className="text-xs tracking-[0.25em] mb-8" style={{ color: theme.accent }}>
        POWERED BY ROBEDGE
      </p>

      <div
        className="w-full rounded-3xl flex items-stretch justify-between px-2 py-4 mb-8"
        style={{ background: "#171B24" }}
      >
        <ActionButton icon={Trash2} label="Remove" theme={theme} />
        <ActionButton icon={Play} label="Start" theme={theme} primary />
        <ActionButton icon={ListOrdered} label="Quotes" theme={theme} />
      </div>

      <div className="w-full">
        <h3 className="text-sm font-bold tracking-[0.15em] mb-3" style={{ color: "#8B92A4" }}>
          BOT LIST
        </h3>

        {BOTS.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBot(b.id)}
            className="w-full rounded-2xl flex items-center justify-between px-4 py-4 mb-3"
            style={{
              background: b.id === activeBot ? theme.accent : "#171B24",
              color: b.id === activeBot ? "#0B0E14" : "#F3F4F6",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: b.id === activeBot ? "#0B0E1433" : theme.accentSoft }}
              >
                <Bot size={18} style={{ color: b.id === activeBot ? "#0B0E14" : theme.accent }} />
              </div>
              <span className="font-semibold">{b.name}</span>
            </div>
            {b.id === activeBot && (
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <Check size={14} style={{ color: theme.accent }} strokeWidth={3} />
              </div>
            )}
          </button>
        ))}

        <button
          className="w-full rounded-2xl flex items-center justify-center gap-2 px-4 py-4 font-semibold border border-dashed"
          style={{ borderColor: theme.accent, color: theme.accent, background: theme.accentSoft }}
        >
          <Plus size={18} />
          Add new trading bot
        </button>
      </div>

      <FloatingAICommand theme={theme} />
    </div>
  );
}

// ---- Floating AI Command button + chat panel --------------------------------------------------------

function FloatingAICommand({ theme }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 280, y: 480 });
  const [dragging, setDragging] = useState(false);
  const [moved, setMoved] = useState(false);
  const [open, setOpen] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: 'I\'m your RobEdge AI assistant. Tell me what to do — e.g. "close all trades", "increase lot size to 0.2", or "switch Apex Drift to XAUUSD only".',
    },
  ]);
  const [input, setInput] = useState("");

  // Clamp position to viewport on first mount
  useEffect(() => {
    const clampToViewport = () => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      setPos((p) => ({
        x: Math.min(Math.max(p.x, 16), rect.width - 64),
        y: Math.min(Math.max(p.y, 16), rect.height - 64),
      }));
    };
    clampToViewport();
  }, []);

  const getPoint = (e) => {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const onDragStart = (e) => {
    const pt = getPoint(e);
    dragStart.current = { x: pt.x, y: pt.y, posX: pos.x, posY: pos.y };
    setDragging(true);
    setMoved(false);
  };

  const onDragMove = (e) => {
    if (!dragging) return;
    const pt = getPoint(e);
    const dx = pt.x - dragStart.current.x;
    const dy = pt.y - dragStart.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setMoved(true);

    const parent = containerRef.current?.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : { width: 360, height: 700 };

    let nextX = dragStart.current.posX + dx;
    let nextY = dragStart.current.posY + dy;
    nextX = Math.min(Math.max(nextX, 16), rect.width - 64);
    nextY = Math.min(Math.max(nextY, 16), rect.height - 64);
    setPos({ x: nextX, y: nextY });
  };

  const onDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (!moved) setOpen(true);
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    const aiReply = {
      from: "ai",
      text: 'Got it — "' + input + '" has been queued for your active bot. I\'ll confirm once it\'s applied.',
    };
    setMessages((m) => [...m, userMsg, aiReply]);
    setInput("");
  };

  return (
    <>
      <div
        ref={containerRef}
        className="fixed z-40 flex items-center justify-center rounded-full select-none"
        style={{
          left: pos.x,
          top: pos.y,
          width: 56,
          height: 56,
          background: theme.accent,
          boxShadow: `0 4px 20px ${theme.accentSoft}`,
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
      >
        <Terminal size={24} style={{ color: "#0B0E14" }} />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "#00000088" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl px-5 pt-5 pb-6 flex flex-col"
            style={{ background: "#11141C", height: "70vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-extrabold flex items-center gap-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F3F4F6" }}
              >
                <Terminal size={20} style={{ color: theme.accent }} />
                AI Command
              </h3>
              <button onClick={() => setOpen(false)}>
                <X size={20} style={{ color: "#8B92A4" }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className="flex"
                  style={{ justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}
                >
                  <div
                    className="max-w-[85%] rounded-2xl px-4 py-3 text-sm"
                    style={{
                      background: m.from === "user" ? theme.accent : "#171B24",
                      color: m.from === "user" ? "#0B0E14" : "#F3F4F6",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-3 overflow-x-auto">
              {["Close all trades", "Pause bot", "Increase lots to 0.2", "Switch to XAUUSD only"].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
                  style={{ background: theme.accentSoft, color: theme.accent }}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: "#171B24" }}>
              <Terminal size={18} style={{ color: theme.accent }} />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a command…"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "#F3F4F6" }}
              />
              <button onClick={send}>
                <Send size={18} style={{ color: theme.accent }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SettingsSheet({ theme, settings, setSettings, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "#00000088" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl px-5 pt-5 pb-8"
        style={{ background: "#11141C" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg font-extrabold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F3F4F6" }}
          >
            Trade settings
          </h3>
          <button onClick={onClose}>
            <X size={20} style={{ color: "#8B92A4" }} />
          </button>
        </div>

        <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B92A4" }}>
          LOT SIZE
        </label>
        <div className="flex items-center gap-3 mb-5">
          {[0.01, 0.1, 0.5, 1].map((v) => (
            <button
              key={v}
              onClick={() => setSettings((s) => ({ ...s, lotSize: v }))}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: settings.lotSize === v ? theme.accent : "#1F2430",
                color: settings.lotSize === v ? "#0B0E14" : "#C2C7D1",
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <input
          type="range"
          min="0.01"
          max="2"
          step="0.01"
          value={settings.lotSize}
          onChange={(e) => setSettings((s) => ({ ...s, lotSize: parseFloat(e.target.value) }))}
          className="w-full mb-5"
          style={{ accentColor: theme.accent }}
        />

        <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B92A4" }}>
          NUMBER OF TRADES
        </label>
        <div className="flex items-center gap-3 mb-5">
          {[1, 2, 3, 5].map((v) => (
            <button
              key={v}
              onClick={() => setSettings((s) => ({ ...s, tradeCount: v }))}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: settings.tradeCount === v ? theme.accent : "#1F2430",
                color: settings.tradeCount === v ? "#0B0E14" : "#C2C7D1",
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B92A4" }}>
          BROKER / PLATFORM
        </label>
        <div className="relative mb-2">
          <select
            value={settings.broker}
            onChange={(e) => setSettings((s) => ({ ...s, broker: e.target.value }))}
            className="w-full appearance-none rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: "#1F2430", color: "#F3F4F6" }}
          >
            {BROKERS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#8B92A4" }}
          />
        </div>
        <p className="text-xs mb-6" style={{ color: "#8B92A4" }}>
          Works with any MT4 or MT5 broker — connect via Setup Methods in the Mentor Portal.
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-2xl py-3.5 font-bold"
          style={{ background: theme.accent, color: "#0B0E14" }}
        >
          Save settings
        </button>
      </div>
    </div>
  );
}

function ScanResultCard({ theme, result, settings, filled, onExecute }) {
  const isBuy = result.direction === "BUY";
  return (
    <div className="rounded-3xl px-5 py-5 mt-5" style={{ background: "#171B24" }}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F3F4F6" }}
          >
            {result.symbol}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Bot size={16} style={{ color: theme.accent }} />
            <span className="text-xs" style={{ color: "#8B92A4" }}>
              {result.timeframe} · RR 1:{result.rr}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm"
          style={{
            background: isBuy ? "#16341F" : "#3A2424",
            color: isBuy ? "#34D399" : "#FB7185",
          }}
        >
          {isBuy ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {result.direction}
        </div>
      </div>

      <div className="my-4 border-t" style={{ borderColor: "#1F2430" }} />

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#C2C7D1" }}>
            <span className="w-3 h-3 rounded-full" style={{ background: theme.accent }} />
            Entry
          </span>
          <span className="font-mono font-bold" style={{ color: "#F3F4F6" }}>
            {result.entry}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#C2C7D1" }}>
            <span className="w-3 h-3 rounded-full" style={{ background: "#34D399" }} />
            Take profit
          </span>
          <span className="font-mono font-bold" style={{ color: "#34D399" }}>
            {result.tp}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#C2C7D1" }}>
            <span className="w-3 h-3 rounded-full" style={{ background: "#FB7185" }} />
            Stop loss
          </span>
          <span className="font-mono font-bold" style={{ color: "#FB7185" }}>
            {result.sl}
          </span>
        </div>
      </div>

      <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "#0F1219" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: "#C2C7D1" }}>
            Signal strength
          </span>
          <span className="text-sm font-bold" style={{ color: theme.accent }}>
            {result.strength}
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: "#1F2430" }}>
          <div
            className="h-2 rounded-full"
            style={{
              width: result.strength === "HIGH" ? "90%" : result.strength === "MEDIUM" ? "60%" : "30%",
              background: theme.accent,
            }}
          />
        </div>
      </div>

      {!filled ? (
        <button
          onClick={onExecute}
          className="w-full rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2"
          style={{ background: theme.accent, color: "#0B0E14" }}
        >
          <Zap size={18} />
          Execute trade
        </button>
      ) : (
        <div
          className="w-full rounded-2xl py-3.5 font-bold flex flex-col items-center justify-center gap-1"
          style={{ background: "#16341F", color: "#34D399" }}
        >
          <span className="flex items-center gap-2">
            <CheckCheck size={18} />
            Filled
          </span>
          <span className="text-xs font-medium" style={{ color: "#7FE3AC" }}>
            Filled {settings.lotSize} lots · {settings.tradeCount} trade{settings.tradeCount > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

function ScannerScreen({ theme }) {
  const [image, setImage] = useState(null);
  const [timeframe, setTimeframe] = useState("M15");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [filled, setFilled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    lotSize: 0.1,
    tradeCount: 1,
    broker: BROKERS[0],
  });
  const fileInput = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
    setResult(null);
    setFilled(false);
  };

  const runScan = () => {
    if (!image || scanning) return;
    setScanning(true);
    setFilled(false);
    setTimeout(() => {
      setResult({
        symbol: "XAUUSD.micro-",
        timeframe,
        direction: "BUY",
        entry: "4600.65",
        tp: "4640.65",
        sl: "4580.65",
        rr: "2",
        strength: "HIGH",
      });
      setScanning(false);
    }, 1600);
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <ScreenTitle
        theme={theme}
        action={
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#171B24" }}
          >
            <Settings size={18} style={{ color: theme.accent }} />
          </button>
        }
      >
        AI Scanner
      </ScreenTitle>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {!image ? (
        <button
          onClick={() => fileInput.current && fileInput.current.click()}
          className="w-full rounded-3xl flex flex-col items-center justify-center gap-3 py-14 border border-dashed"
          style={{ borderColor: theme.accent, background: theme.accentSoft }}
        >
          <Upload size={28} style={{ color: theme.accent }} />
          <div className="text-center">
            <div className="font-semibold" style={{ color: "#F3F4F6" }}>
              Upload a chart screenshot
            </div>
            <div className="text-xs mt-1" style={{ color: "#8B92A4" }}>
              PNG or JPG · any pair, any timeframe
            </div>
          </div>
        </button>
      ) : (
        <div className="rounded-3xl overflow-hidden mb-1" style={{ background: "#171B24" }}>
          <img src={image} alt="Uploaded chart" className="w-full object-cover max-h-64" />
          <button
            onClick={() => {
              setImage(null);
              setResult(null);
              setFilled(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
            style={{ color: "#8B92A4" }}
          >
            <ImageIcon size={15} />
            Replace image
          </button>
        </div>
      )}

      <h3 className="text-sm font-bold tracking-[0.15em] mt-5 mb-3" style={{ color: "#8B92A4" }}>
        TIMEFRAME
      </h3>
      <div className="flex items-center gap-2 mb-5 overflow-x-auto">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className="px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0"
            style={{
              background: timeframe === tf ? theme.accent : "#171B24",
              color: timeframe === tf ? "#0B0E14" : "#C2C7D1",
            }}
          >
            {tf}
          </button>
        ))}
      </div>

      <button
        onClick={runScan}
        disabled={!image || scanning}
        className="w-full rounded-2xl py-4 font-bold flex items-center justify-center gap-2"
        style={{
          background: image ? theme.accent : "#1F2430",
          color: image ? "#0B0E14" : "#5A6173",
          opacity: scanning ? 0.7 : 1,
        }}
      >
        <Zap size={18} />
        {scanning ? "Analyzing chart…" : "Scan chart"}
      </button>

      {result && (
        <ScanResultCard
          theme={theme}
          result={result}
          settings={settings}
          filled={filled}
          onExecute={() => setFilled(true)}
        />
      )}

      {showSettings && (
        <SettingsSheet
          theme={theme}
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

function MetaTraderScreen({ theme }) {
  const [accountType, setAccountType] = useState("MT5");
  const [server, setServer] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const canConnect = server.trim() && login.trim() && password.trim();

  const handleConnect = () => {
    if (!canConnect || connecting) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1400);
  };

  if (connected) {
    return (
      <div className="px-5 pt-6 pb-4">
        <ScreenTitle theme={theme}>MetaTrader</ScreenTitle>

        <div className="rounded-3xl px-5 py-6 flex flex-col items-center" style={{ background: "#171B24" }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#16341F" }}
          >
            <CheckCheck size={28} style={{ color: "#34D399" }} />
          </div>
          <h3
            className="text-lg font-extrabold mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F3F4F6" }}
          >
            Account connected
          </h3>
          <p className="text-sm text-center mb-5" style={{ color: "#8B92A4" }}>
            Your {accountType} account is linked. RobEdge will now sync trades to this account.
          </p>

          <div className="w-full rounded-2xl px-4 py-4 mb-5" style={{ background: "#0F1219" }}>
            <Row label="Platform" value={accountType} theme={theme} />
            <Row label="Login" value={login} theme={theme} />
            <Row label="Server" value={server} theme={theme} last />
          </div>

          <button
            onClick={() => {
              setConnected(false);
              setServer("");
              setLogin("");
              setPassword("");
            }}
            className="w-full rounded-2xl py-3.5 font-bold"
            style={{ background: "#3A2424", color: "#FB7185" }}
          >
            Disconnect account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-4">
      <ScreenTitle theme={theme}>MetaTrader</ScreenTitle>
      <p className="text-sm mb-5" style={{ color: "#8B92A4" }}>
        Link your trading account so RobEdge can place and manage trades on your behalf.
      </p>

      <div className="flex items-center gap-2 mb-5">
        {ACCOUNT_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setAccountType(t)}
            className="flex-1 py-3 rounded-xl text-sm font-bold"
            style={{
              background: accountType === t ? theme.accent : "#171B24",
              color: accountType === t ? "#0B0E14" : "#C2C7D1",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B92A4" }}>
        SERVER
      </label>
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-4" style={{ background: "#171B24" }}>
        <Server size={18} style={{ color: theme.accent }} />
        <input
          value={server}
          onChange={(e) => setServer(e.target.value)}
          placeholder="e.g. Exness-MT5Real8"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "#F3F4F6" }}
        />
      </div>

      <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B92A4" }}>
        ACCOUNT LOGIN
      </label>
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-4" style={{ background: "#171B24" }}>
        <User size={18} style={{ color: theme.accent }} />
        <input
          value={login}
          onChange={(e) => setLogin(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="Account number"
          inputMode="numeric"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "#F3F4F6" }}
        />
      </div>

      <label className="text-xs font-semibold mb-2 block" style={{ color: "#8B92A4" }}>
        PASSWORD
      </label>
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-2" style={{ background: "#171B24" }}>
        <Lock size={18} style={{ color: theme.accent }} />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          placeholder="Investor password recommended"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "#F3F4F6" }}
        />
        <button onClick={() => setShowPassword((s) => !s)}>
          {showPassword ? (
            <EyeOff size={16} style={{ color: "#8B92A4" }} />
          ) : (
            <Eye size={16} style={{ color: "#8B92A4" }} />
          )}
        </button>
      </div>
      <p className="text-xs mb-6" style={{ color: "#8B92A4" }}>
        Use an investor (read-only) password where possible. RobEdge supports any MT4 or MT5 broker.
      </p>

      <button
        onClick={handleConnect}
        disabled={!canConnect || connecting}
        className="w-full rounded-2xl py-4 font-bold flex items-center justify-center gap-2"
        style={{
          background: canConnect ? theme.accent : "#1F2430",
          color: canConnect ? "#0B0E14" : "#5A6173",
          opacity: connecting ? 0.7 : 1,
        }}
      >
        <LineChart size={18} />
        {connecting ? "Connecting…" : "Connect account"}
      </button>
    </div>
  );
}

function Row({ label, value, theme, last }) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={{ borderBottom: last ? "none" : "1px solid #1F2430" }}
    >
      <span className="text-sm" style={{ color: "#8B92A4" }}>
        {label}
      </span>
      <span className="text-sm font-mono font-semibold" style={{ color: "#F3F4F6" }}>
        {value}
      </span>
    </div>
  );
}

const TABS = [
  { key: "home", label: "Home", icon: HomeIcon },
  { key: "scanner", label: "AI Scanner", icon: ScanLine },
  { key: "metatrader", label: "MetaTrader", icon: LineChart },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [themeKey, setThemeKey] = useState("amber");
  const [activeBot, setActiveBot] = useState(BOTS[0].id);
  const theme = THEMES[themeKey];

  const cycleTheme = () => {
    const idx = THEME_ORDER.indexOf(themeKey);
    setThemeKey(THEME_ORDER[(idx + 1) % THEME_ORDER.length]);
  };

  return (
    <div
      className="w-full max-w-sm mx-auto min-h-screen flex flex-col"
      style={{ background: "#0B0E14", fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: theme.accent }}
          >
            <Bot size={18} style={{ color: "#0B0E14" }} />
          </div>
          <span
            className="text-lg font-extrabold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#F3F4F6" }}
          >
            RobEdge
          </span>
        </div>
        <button
          onClick={cycleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: theme.accentSoft, color: theme.accent }}
        >
          <Palette size={14} />
          {theme.name}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === "home" && (
          <HomeScreen theme={theme} activeBot={activeBot} setActiveBot={setActiveBot} />
        )}
        {tab === "scanner" && <ScannerScreen theme={theme} />}
        {tab === "metatrader" && <MetaTraderScreen theme={theme} />}
      </div>

      <div
        className="flex items-center justify-around px-2 py-3 border-t sticky bottom-0"
        style={{ background: "#0B0E14", borderColor: "#1F2430" }}
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex flex-col items-center gap-1 px-3"
            >
              <Icon size={20} style={{ color: active ? theme.accent : "#8B92A4" }} />
              <span className="text-xs font-medium" style={{ color: active ? theme.accent : "#8B92A4" }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
