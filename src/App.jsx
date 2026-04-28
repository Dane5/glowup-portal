import { useState } from "react";

// ─── Brand tokens ───────────────────────────────────────────────
const LIME    = "#C8F135";
const DARK    = "#0D0D0D";
const SURFACE = "#161616";
const CARD_BG = "#1C1C1C";
const BORDER  = "rgba(200,241,53,0.15)";
const MUTED   = "#888";
const DIMMER  = "#555";

// ─── Mock dealer / rep database ─────────────────────────────────
const DEALERS = {
  "STORE-001": {
    storeName: "Glow Up Queens",
    location: "Jamaica, NY",
    reps: [
      { id: "REP-101", name: "Dane Rahh",   pin: "1234", salesNum: "GU-S-0101" },
      { id: "REP-102", name: "Marcus Webb",    pin: "2345", salesNum: "GU-S-0102" },
      { id: "REP-103", name: "Nadia Osei",     pin: "3456", salesNum: "GU-S-0103" },
    ],
  },
  "STORE-002": {
    storeName: "Glow Up BX",
    location: "Bronx, NY",
    reps: [
      { id: "REP-201", name: "DeShawn Carter", pin: "1111", salesNum: "GU-S-0201" },
      { id: "REP-202", name: "Priya Sharma",   pin: "2222", salesNum: "GU-S-0202" },
    ],
  },
  "STORE-003": {
    storeName: "Glow Up Brooklyn",
    location: "Flatbush, NY",
    reps: [
      { id: "REP-301", name: "Aaliyah Grant",  pin: "9999", salesNum: "GU-S-0301" },
      { id: "REP-302", name: "Jordan Miles",   pin: "8888", salesNum: "GU-S-0302" },
    ],
  },
};

// ─── Single plan ─────────────────────────────────────────────────
const PLAN = {
  id: "unlimited",
  name: "Glow Unlimited",
  price: 25,
  data: "Unlimited",
  hotspot: "Unlimited",
  features: [
    "Unlimited LTE data",
    "Unlimited hotspot",
    "Unlimited talk & text",
    "Wi-Fi calling",
    "Mexico & Canada included",
    "No contracts, ever",
  ],
};

// ─── Mock subscriber data ────────────────────────────────────────
const SUBS = [
  { id:"GU0015", name:"Devon Carter",    status:"provisioning", sim:"eSIM",     msisdn:"—",                 date:"Nov 16", mrr:25, rep:"GU-S-0101" },
  { id:"GU0014", name:"Marcus Williams", status:"active",       sim:"eSIM",     msisdn:"+1 (929) 555-0142", date:"Nov 15", mrr:25, rep:"GU-S-0102" },
  { id:"GU0013", name:"Aaliyah Johnson", status:"active",       sim:"Physical", msisdn:"+1 (718) 555-0198", date:"Nov 14", mrr:25, rep:"GU-S-0101" },
  { id:"GU0012", name:"Keisha Brown",    status:"active",       sim:"eSIM",     msisdn:"+1 (347) 555-0071", date:"Nov 13", mrr:25, rep:"GU-S-0103" },
  { id:"GU0016", name:"Andre Mitchell",  status:"porting",      sim:"Physical", msisdn:"porting...",        date:"Nov 16", mrr:25, rep:"GU-S-0101" },
  { id:"GU0011", name:"Simone Davis",    status:"active",       sim:"eSIM",     msisdn:"+1 (917) 555-0156", date:"Nov 10", mrr:25, rep:"GU-S-0102" },
  { id:"GU0008", name:"Jaylen Thomas",   status:"suspended",    sim:"Physical", msisdn:"+1 (646) 555-0223", date:"Oct 28", mrr:0,  rep:"GU-S-0201" },
];

const PORTS = [
  { id:"PORT-0012", customer:"Jordan Williams", number:"+1 (212) 555-0189", carrier:"Verizon",  focDate:"Nov 19", status:"foc_pending",
    steps:[{l:"Eligibility",done:true,t:"9:02am"},{l:"LOA gen.",done:true,t:"9:03am"},{l:"LOA signed",done:true,t:"2:31pm"},{l:"Submitted",done:true,t:"2:45pm"},{l:"FOC rcvd",done:true,t:"Nov 15"},{l:"Live",done:false,t:"Nov 19"}]},
  { id:"PORT-0011", customer:"Priya Sharma",    number:"+1 (646) 555-0234", carrier:"AT&T",     focDate:"Nov 21", status:"submitted",
    steps:[{l:"Eligibility",done:true,t:"11:00am"},{l:"LOA gen.",done:true,t:"11:01am"},{l:"LOA signed",done:true,t:"4:12pm"},{l:"Submitted",done:true,t:"5:00pm"},{l:"FOC rcvd",done:false,t:"Pending"},{l:"Live",done:false,t:"Nov 21"}]},
  { id:"PORT-0010", customer:"Marcus Chen",     number:"+1 (718) 555-0087", carrier:"T-Mobile prepaid", focDate:null, status:"awaiting_loa",
    steps:[{l:"Eligibility",done:true,t:"10:15am"},{l:"LOA gen.",done:true,t:"10:16am"},{l:"LOA signed",done:false,t:"Awaiting"},{l:"Submitted",done:false,t:"Pending"},{l:"FOC rcvd",done:false,t:"Pending"},{l:"Live",done:false,t:"TBD"}]},
];

const STATUS_MAP = {
  active:       { label:"Active",       bg:"rgba(200,241,53,0.15)",  color:LIME },
  provisioning: { label:"Provisioning", bg:"rgba(59,139,212,0.15)",  color:"#5BB8FF" },
  suspended:    { label:"Suspended",    bg:"rgba(239,159,39,0.15)",  color:"#EFA027" },
  porting:      { label:"Porting",      bg:"rgba(127,119,221,0.15)", color:"#9F97FF" },
  foc_pending:  { label:"FOC pending",  bg:"rgba(239,159,39,0.15)",  color:"#EFA027" },
  submitted:    { label:"Submitted",    bg:"rgba(59,139,212,0.15)",  color:"#5BB8FF" },
  awaiting_loa: { label:"Awaiting LOA", bg:"rgba(127,119,221,0.15)", color:"#9F97FF" },
};

// ─── Shared tiny components ──────────────────────────────────────
const Badge = ({ s }) => {
  const d = STATUS_MAP[s] || { label: s, bg:"#222", color:MUTED };
  return (
    <span style={{ background:d.bg, color:d.color, fontSize:11, fontWeight:600,
      padding:"3px 9px", borderRadius:20, letterSpacing:"0.03em", whiteSpace:"nowrap" }}>
      {d.label}
    </span>
  );
};

const Av = ({ name, size=30 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%",
    background:"rgba(200,241,53,0.12)", border:"1px solid rgba(200,241,53,0.3)",
    color:LIME, display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:Math.round(size*.35), fontWeight:700, flexShrink:0, letterSpacing:"-0.02em" }}>
    {name.split(" ").map(n=>n[0]).join("").slice(0,2)}
  </div>
);

const Logo = ({ size=28 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="44" stroke={LIME} strokeWidth="5"/>
    <circle cx="50" cy="68" r="5" fill={LIME}/>
    <path d="M32 52 Q50 34 68 52" stroke={LIME} strokeWidth="5" strokeLinecap="round" fill="none"/>
    <path d="M22 42 Q50 16 78 42" stroke={LIME} strokeWidth="5" strokeLinecap="round" fill="none"/>
  </svg>
);

const Ic = {
  check:   () => <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:    () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  search:  () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chevron: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:   () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  arrow:   () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dash:    () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>,
  users:   () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M14 13.5c0-1.66-1.57-3-3.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  phone:   () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 2.5A1.5 1.5 0 013.5 1h1a1.5 1.5 0 011.5 1.5v.5c0 .4-.2.77-.52 1l-.98.73A9.5 9.5 0 009.27 9.5l.73-.98c.23-.32.6-.52 1-.52h.5A1.5 1.5 0 0113 9.5v1A1.5 1.5 0 0111.5 12c-5.25 0-9.5-4.25-9.5-9.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  pkg:     () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5v7L8 15 2 11.5v-7L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M2 4.5l6 3.5 6-3.5M8 8v7" stroke="currentColor" strokeWidth="1.3"/></svg>,
  logout:  () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  store:   () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 6l1-4h12l1 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M1 6v8h14V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 6c0 1.1.9 2 2 2s2-.9 2-2 .9 2 2 2 2-.9 2-2 .9 2 2 2 2-.9 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  tag:     () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 1h5.5L13 7.5 7.5 13 1 6.5V1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="3.5" cy="3.5" r="1" fill="currentColor"/></svg>,
};

const BTN_PRIMARY = {
  display:"inline-flex", alignItems:"center", gap:6, cursor:"pointer",
  padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:700,
  border:"none", background:LIME, color:DARK, fontFamily:"inherit", letterSpacing:"0.01em",
};
const BTN_GHOST = {
  display:"inline-flex", alignItems:"center", gap:6, cursor:"pointer",
  padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:500,
  border:`1px solid ${BORDER}`, background:"transparent", color:"#ccc", fontFamily:"inherit",
};

const inp = {
  width:"100%", padding:"10px 13px", fontSize:14, borderRadius:8,
  border:`1px solid ${BORDER}`, background:"#1e1e1e", color:"#fff",
  fontFamily:"inherit", outline:"none", boxSizing:"border-box",
  transition:"border-color 0.15s",
};

const WSTEPS = ["Subscriber info", "SIM & number", "Payment", "Review"];

// ═══════════════════════════════════════════════════════════════════
// SCREEN 1 — Dealer Login
// ═══════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [storeId, setStoreId]   = useState("");
  const [repName, setRepName]   = useState("");
  const [pin, setPin]           = useState("");
  const [stage, setStage]       = useState("store"); // "store" | "rep"
  const [error, setError]       = useState("");
  const [storeData, setStoreData] = useState(null);
  const [filteredReps, setFilteredReps] = useState([]);

  const handleStoreSubmit = () => {
    const upper = storeId.trim().toUpperCase();
    const d = DEALERS[upper];
    if (!d) { setError("Store ID not found. Try STORE-001, STORE-002, or STORE-003."); return; }
    setStoreData({ ...d, id: upper });
    setFilteredReps(d.reps);
    setError("");
    setStage("rep");
  };

  const handleRepLogin = () => {
    const name = repName.trim().toLowerCase();
    const match = storeData.reps.find(r => r.name.toLowerCase().includes(name) && r.pin === pin);
    if (!match) { setError("Name or PIN incorrect."); return; }
    setError("");
    onLogin({ rep: match, store: storeData });
  };

  return (
    <div style={{
      minHeight:"100%", display:"flex", alignItems:"center", justifyContent:"center",
      background:DARK, fontFamily:"'DM Sans','Helvetica Neue',sans-serif",
      position:"relative", overflow:"hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position:"absolute", inset:0, opacity:0.04,
        backgroundImage:"linear-gradient(rgba(200,241,53,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,241,53,1) 1px,transparent 1px)",
        backgroundSize:"40px 40px",
      }}/>
      {/* Glow blob */}
      <div style={{
        position:"absolute", width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(200,241,53,0.07) 0%, transparent 70%)",
        top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none",
      }}/>

      <div style={{
        position:"relative", width:420, background:SURFACE,
        border:`1px solid ${BORDER}`, borderRadius:18, padding:"36px 36px 32px",
        boxShadow:"0 32px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Logo + title */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:32 }}>
          <Logo size={48}/>
          <div style={{ marginTop:12, textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"-0.04em" }}>Glow Up Wireless</div>
            <div style={{ fontSize:12, color:MUTED, marginTop:4, letterSpacing:"0.04em" }}>DEALER PORTAL</div>
          </div>
        </div>

        {stage === "store" ? (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:DIMMER, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
                Store ID
              </label>
              <input
                style={inp}
                placeholder="e.g. STORE-001"
                value={storeId}
                onChange={e => { setStoreId(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleStoreSubmit()}
              />
            </div>
            {error && <div style={{ fontSize:12, color:"#FF6B6B", background:"rgba(255,107,107,0.08)", border:"1px solid rgba(255,107,107,0.2)", borderRadius:7, padding:"8px 11px" }}>{error}</div>}
            <button onClick={handleStoreSubmit} style={{ ...BTN_PRIMARY, justifyContent:"center", padding:"11px", width:"100%", fontSize:14, marginTop:4 }}>
              Continue <Ic.arrow />
            </button>
            <div style={{ textAlign:"center", fontSize:11, color:DIMMER, marginTop:4 }}>
              Demo IDs: STORE-001 · STORE-002 · STORE-003
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Store confirmed banner */}
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(200,241,53,0.06)", border:`1px solid ${BORDER}`, borderRadius:9, padding:"10px 13px" }}>
              <Ic.store />
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{storeData.storeName}</div>
                <div style={{ fontSize:11, color:DIMMER }}>{storeData.id} · {storeData.location}</div>
              </div>
              <button onClick={() => { setStage("store"); setError(""); }} style={{ marginLeft:"auto", fontSize:11, color:MUTED, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                Change
              </button>
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:DIMMER, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
                Your name
              </label>
              <input style={inp} placeholder="e.g. Jamie Rivera" value={repName}
                onChange={e => { setRepName(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleRepLogin()} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:DIMMER, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6 }}>
                PIN
              </label>
              <input style={inp} type="password" placeholder="••••" maxLength={6} value={pin}
                onChange={e => { setPin(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleRepLogin()} />
            </div>
            {error && <div style={{ fontSize:12, color:"#FF6B6B", background:"rgba(255,107,107,0.08)", border:"1px solid rgba(255,107,107,0.2)", borderRadius:7, padding:"8px 11px" }}>{error}</div>}
            <button onClick={handleRepLogin} style={{ ...BTN_PRIMARY, justifyContent:"center", padding:"11px", width:"100%", fontSize:14, marginTop:4 }}>
              Sign in <Ic.arrow />
            </button>
            <div style={{ textAlign:"center", fontSize:11, color:DIMMER }}>
              Demo: any rep name from the store · PIN shown in code
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN 2 — Main Portal
// ═══════════════════════════════════════════════════════════════════
function Portal({ session, onLogout }) {
  const [view, setView] = useState("dashboard");
  const [wiz, setWiz]   = useState(false);
  const [step, setStep] = useState(0);
  const [q, setQ]       = useState("");
  const [f, setF]       = useState({ fn:"", ln:"", email:"", phone:"", sim:"esim", port:false, portNum:"", portCarrier:"", portAcct:"", portPin:"", pay:"ach" });

  // Filter subs to this store's reps for a store-scoped view
  const storeRepIds  = session.store.reps.map(r => r.salesNum);
  const mySubs       = SUBS.filter(s => storeRepIds.includes(s.rep));
  const activeSubs   = mySubs.filter(s => s.status === "active");
  const mrr          = activeSubs.reduce((a,s) => a + s.mrr, 0);
  const filtered     = mySubs.filter(s =>
    !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.msisdn.includes(q) || s.id.includes(q)
  );

  const openWiz  = () => { setF({ fn:"", ln:"", email:"", phone:"", sim:"esim", port:false, portNum:"", portCarrier:"", portAcct:"", portPin:"", pay:"ach" }); setStep(0); setWiz(true); };
  const nextStep = () => step < WSTEPS.length-1 ? setStep(s=>s+1) : (setWiz(false), setStep(0), setView("subscribers"));
  const prevStep = () => step===0 ? setWiz(false) : setStep(s=>s-1);

  const NAV = [
    { id:"dashboard",   label:"Dashboard",      I:Ic.dash },
    { id:"subscribers", label:"Subscribers",    I:Ic.users },
    { id:"porting",     label:"Number porting", I:Ic.phone },
    { id:"plan",        label:"Plan",           I:Ic.pkg },
  ];

  const selCard = (on) => ({
    display:"flex", alignItems:"center", gap:10, padding:"11px 13px", marginBottom:6,
    border:`1px solid ${on ? LIME : BORDER}`,
    background: on ? "rgba(200,241,53,0.07)" : "#1e1e1e",
    borderRadius:9, cursor:"pointer",
  });

  const css = {
    app:     { display:"flex", height:680, overflow:"hidden", fontFamily:"'DM Sans','Helvetica Neue',sans-serif", fontSize:14, background:DARK, color:"#fff", position:"relative" },
    sidebar: { width:224, flexShrink:0, background:SURFACE, borderRight:`1px solid ${BORDER}`, display:"flex", flexDirection:"column" },
    main:    { flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:DARK },
    topbar:  { height:50, borderBottom:`1px solid ${BORDER}`, background:SURFACE, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", flexShrink:0 },
    scroll:  { flex:1, overflowY:"auto", padding:18 },
    card:    { background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"14px 16px" },
    met:     { background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:10, padding:"14px 16px" },
    inp:     { width:"100%", padding:"8px 11px", fontSize:13, borderRadius:8, border:`1px solid ${BORDER}`, background:"#222", color:"#fff", fontFamily:"inherit", outline:"none", boxSizing:"border-box" },
  };

  return (
    <div style={css.app}>
      {/* ── SIDEBAR ── */}
      <div style={css.sidebar}>
        <div style={{ padding:"14px 14px 12px", borderBottom:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:10 }}>
          <Logo size={32}/>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>Glow Up</div>
            <div style={{ fontSize:10, fontWeight:700, color:LIME, letterSpacing:"0.12em", textTransform:"uppercase" }}>Wireless</div>
          </div>
        </div>

        {/* Rep badge */}
        <div style={{ margin:"10px 10px 6px", background:"rgba(200,241,53,0.06)", border:`1px solid ${BORDER}`, borderRadius:9, padding:"9px 11px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <Ic.tag />
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#fff" }}>{session.rep.salesNum}</div>
              <div style={{ fontSize:10, color:DIMMER }}>Your sales number</div>
            </div>
          </div>
        </div>

        <div style={{ padding:"0 10px 6px" }}>
          <button onClick={openWiz} style={{ ...BTN_PRIMARY, width:"100%", justifyContent:"center", padding:"9px" }}>
            <Ic.plus /> New activation
          </button>
        </div>

        <nav style={{ padding:"4px 8px", flex:1 }}>
          {NAV.map(({ id, label, I }) => (
            <button key={id} onClick={() => setView(id)} style={{
              display:"flex", alignItems:"center", gap:9, width:"100%", padding:"8px 10px",
              borderRadius:8, marginBottom:2,
              background: view===id ? "rgba(200,241,53,0.08)" : "transparent",
              color: view===id ? LIME : MUTED,
              border: view===id ? "1px solid rgba(200,241,53,0.2)" : "1px solid transparent",
              fontFamily:"inherit", fontSize:13, fontWeight: view===id ? 700 : 400,
              cursor:"pointer", textAlign:"left",
            }}>
              <I />{label}
            </button>
          ))}
        </nav>

        <div style={{ padding:"12px 14px", borderTop:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:9 }}>
          <Av name={session.rep.name} size={28}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{session.rep.name}</div>
            <div style={{ fontSize:10, color:DIMMER, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{session.store.storeName}</div>
          </div>
          <button onClick={onLogout} title="Log out" style={{ background:"none", border:"none", cursor:"pointer", color:MUTED, display:"flex", padding:0 }}><Ic.logout /></button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={css.main}>
        <div style={css.topbar}>
          <span style={{ fontWeight:700, color:"#fff", fontSize:15 }}>{NAV.find(n=>n.id===view)?.label}</span>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:LIME }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:LIME }}/>
            T-Mobile API connected
          </div>
        </div>

        <div style={css.scroll}>

          {/* ── DASHBOARD ── */}
          {view==="dashboard" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10 }}>
                {[
                  { label:"Store subscribers", value:mySubs.length,  sub:`${session.store.storeName}` },
                  { label:"Active lines",       value:activeSubs.length, sub:`${mySubs.length ? Math.round(activeSubs.length/mySubs.length*100) : 0}% of total` },
                  { label:"Monthly revenue",    value:`$${mrr}`,   sub:"Store MRR" },
                  { label:"Pending ports",      value:PORTS.length, sub:"In progress" },
                ].map((m,i) => (
                  <div key={i} style={css.met}>
                    <div style={{ fontSize:11, color:DIMMER, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>{m.label}</div>
                    <div style={{ fontSize:24, fontWeight:800, color:"#fff", letterSpacing:"-0.03em" }}>{m.value}</div>
                    <div style={{ fontSize:11, color:MUTED, marginTop:4 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12 }}>
                <div style={css.card}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <span style={{ fontWeight:700, color:"#fff" }}>Recent activations</span>
                    <button onClick={() => setView("subscribers")} style={{ fontSize:12, color:LIME, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>View all →</button>
                  </div>
                  {mySubs.slice(0,5).map((s,i) => (
                    <div key={s.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 0", borderTop: i>0 ? `1px solid ${BORDER}` : "none" }}>
                      <Av name={s.name} size={28}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:13, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                        <div style={{ fontSize:11, color:DIMMER }}>Glow Unlimited · {s.sim}</div>
                      </div>
                      <Badge s={s.status}/>
                      <span style={{ fontSize:11, color:DIMMER, minWidth:44, textAlign:"right" }}>{s.date}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={css.card}>
                    <div style={{ fontWeight:700, color:"#fff", marginBottom:10 }}>Quick actions</div>
                    {[
                      { label:"New activation",    act: openWiz },
                      { label:"Start port request", act:() => setView("porting") },
                      { label:"View plan",          act:() => setView("plan") },
                    ].map((a,i) => (
                      <button key={i} onClick={a.act} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"8px 10px", marginBottom:4, background:"#222", border:`1px solid ${BORDER}`, borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:13, color:"#ccc" }}>
                        {a.label} <Ic.chevron />
                      </button>
                    ))}
                  </div>

                  {/* Store rep leaderboard */}
                  <div style={css.card}>
                    <div style={{ fontWeight:700, color:"#fff", marginBottom:12 }}>Store reps</div>
                    {session.store.reps.map(r => {
                      const cnt = SUBS.filter(s => s.rep === r.salesNum).length;
                      return (
                        <div key={r.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                          <Av name={r.name} size={24}/>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:600, color: r.id === session.rep.id ? LIME : "#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {r.name}{r.id === session.rep.id && " (you)"}
                            </div>
                            <div style={{ fontSize:10, color:DIMMER }}>{r.salesNum}</div>
                          </div>
                          <span style={{ fontSize:13, fontWeight:700, color: cnt > 0 ? LIME : DIMMER }}>{cnt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SUBSCRIBERS ── */}
          {view==="subscribers" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <div style={{ flex:1, position:"relative", maxWidth:300 }}>
                  <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:MUTED }}><Ic.search /></span>
                  <input placeholder="Search name, MSISDN, ID..." value={q} onChange={e=>setQ(e.target.value)} style={{ ...css.inp, paddingLeft:32 }}/>
                </div>
                <button onClick={openWiz} style={BTN_PRIMARY}><Ic.plus /> New activation</button>
              </div>
              <div style={{ ...css.card, padding:0, overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ background:"#191919", borderBottom:`1px solid ${BORDER}` }}>
                      {["Subscriber","Status","SIM","MSISDN","Rep","Activated","MRR"].map((h,i) => (
                        <th key={h} style={{ padding:"9px 13px", textAlign:i===6?"right":"left", fontSize:10, fontWeight:700, color:DIMMER, letterSpacing:"0.08em", textTransform:"uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s,i) => (
                      <tr key={s.id} style={{ borderTop: i>0 ? `1px solid ${BORDER}` : "none" }}>
                        <td style={{ padding:"9px 13px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <Av name={s.name} size={26}/>
                            <div>
                              <div style={{ fontWeight:600, color:"#fff" }}>{s.name}</div>
                              <div style={{ fontSize:11, color:DIMMER }}>{s.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:"9px 13px" }}><Badge s={s.status}/></td>
                        <td style={{ padding:"9px 13px", color:MUTED }}>{s.sim}</td>
                        <td style={{ padding:"9px 13px", fontFamily:"'SF Mono',monospace", fontSize:12, color:MUTED }}>{s.msisdn}</td>
                        <td style={{ padding:"9px 13px" }}>
                          <span style={{ fontSize:11, fontWeight:600, color: s.rep === session.rep.salesNum ? LIME : MUTED }}>{s.rep}</span>
                        </td>
                        <td style={{ padding:"9px 13px", color:DIMMER, fontSize:12 }}>{s.date}</td>
                        <td style={{ padding:"9px 13px", textAlign:"right", fontWeight:700, color: s.mrr>0 ? LIME : DIMMER }}>{s.mrr>0 ? `$${s.mrr}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PORTING ── */}
          {view==="porting" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:"#fff" }}>Active port requests</div>
                  <div style={{ fontSize:12, color:DIMMER, marginTop:2 }}>{PORTS.length} in progress</div>
                </div>
                <button onClick={openWiz} style={BTN_PRIMARY}><Ic.plus /> New port request</button>
              </div>
              {PORTS.map(p => {
                const done = p.steps.filter(s=>s.done).length;
                return (
                  <div key={p.id} style={css.card}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                          <span style={{ fontWeight:700, color:"#fff" }}>{p.customer}</span>
                          <Badge s={p.status}/>
                        </div>
                        <div style={{ fontSize:12, color:MUTED }}>{p.number} · from {p.carrier} · Glow Unlimited</div>
                        <div style={{ fontSize:11, color:DIMMER, marginTop:2, fontFamily:"monospace" }}>{p.id}</div>
                      </div>
                      {p.focDate && (
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:10, color:DIMMER, textTransform:"uppercase", letterSpacing:"0.06em" }}>FOC date</div>
                          <div style={{ fontWeight:700, color:LIME }}>{p.focDate}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:DIMMER, marginBottom:5 }}>
                        <span>Progress</span><span style={{ color:"#fff", fontWeight:600 }}>{done}/{p.steps.length}</span>
                      </div>
                      <div style={{ height:3, background:"#2a2a2a", borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${Math.round(done/p.steps.length*100)}%`, background:LIME, borderRadius:2 }}/>
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:6 }}>
                      {p.steps.map((s,i) => (
                        <div key={i} style={{ textAlign:"center" }}>
                          <div style={{ width:22, height:22, borderRadius:"50%", margin:"0 auto 4px", background: s.done ? LIME : "#252525", border: s.done ? "none" : `1px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", color: s.done ? DARK : DIMMER, fontSize:11, fontWeight:700 }}>
                            {s.done ? <Ic.check /> : i+1}
                          </div>
                          <div style={{ fontSize:10, color:MUTED, lineHeight:1.3 }}>{s.l}</div>
                          <div style={{ fontSize:10, color:DIMMER, marginTop:2 }}>{s.t}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── PLAN ── */}
          {view==="plan" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:15, color:"#fff" }}>Plan</div>
                <div style={{ fontSize:12, color:DIMMER, marginTop:2 }}>T-Mobile powered · no contracts, no hidden fees</div>
              </div>
              <div style={{ maxWidth:340 }}>
                <div style={{ ...css.card, border:`1px solid ${LIME}`, position:"relative" }}>
                  <div style={{ position:"absolute", top:-11, left:20 }}>
                    <span style={{ background:LIME, color:DARK, fontSize:10, fontWeight:800, padding:"3px 12px", borderRadius:20, letterSpacing:"0.05em" }}>ONE SIMPLE PLAN</span>
                  </div>
                  <div style={{ marginTop:10 }}>
                    <div style={{ fontSize:11, color:DIMMER, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.1em" }}>{PLAN.name}</div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:4 }}>
                      <span style={{ fontSize:40, fontWeight:900, color:"#fff", letterSpacing:"-0.05em" }}>${PLAN.price}</span>
                      <span style={{ fontSize:13, color:DIMMER }}>/mo</span>
                    </div>
                    <div style={{ fontSize:13, color:LIME, marginBottom:18, fontWeight:700 }}>Unlimited everything</div>
                    <ul style={{ listStyle:"none", padding:0, margin:"0 0 20px", display:"flex", flexDirection:"column", gap:9 }}>
                      {PLAN.features.map((feat,i) => (
                        <li key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:MUTED }}>
                          <span style={{ color:LIME, flexShrink:0, background:"rgba(200,241,53,0.1)", borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center" }}><Ic.check /></span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <button onClick={openWiz} style={{ ...BTN_PRIMARY, width:"100%", justifyContent:"center", padding:"11px", fontSize:14 }}>
                      Activate a subscriber
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── ACTIVATION WIZARD ── */}
      {wiz && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
          <div style={{ background:"#181818", border:`1px solid ${BORDER}`, borderRadius:14, width:468, maxHeight:"93%", overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"15px 18px", borderBottom:`1px solid ${BORDER}` }}>
              <div>
                <div style={{ fontWeight:800, color:"#fff" }}>New activation</div>
                <div style={{ fontSize:11, color:DIMMER, marginTop:2 }}>Step {step+1} of {WSTEPS.length}: {WSTEPS[step]}</div>
              </div>
              <button onClick={() => setWiz(false)} style={{ background:"none", border:`1px solid ${BORDER}`, borderRadius:6, cursor:"pointer", color:MUTED, padding:"4px 6px", display:"flex" }}><Ic.close /></button>
            </div>
            <div style={{ display:"flex", gap:4, padding:"10px 18px", borderBottom:`1px solid ${BORDER}` }}>
              {WSTEPS.map((_,i) => <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i<=step ? LIME : "#2a2a2a" }}/>)}
            </div>

            {/* Plan always shows at top of wizard */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", margin:"14px 18px 0", padding:"10px 13px", background:"rgba(200,241,53,0.05)", border:`1px solid ${BORDER}`, borderRadius:9 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#fff" }}>Glow Unlimited</div>
                <div style={{ fontSize:11, color:DIMMER }}>Unlimited data · talk · text</div>
              </div>
              <div style={{ fontSize:20, fontWeight:900, color:LIME }}>$25<span style={{ fontSize:11, color:DIMMER, fontWeight:400 }}>/mo</span></div>
            </div>

            <div style={{ padding:18, flex:1 }}>

              {/* Step 0: Subscriber info */}
              {step===0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ fontSize:13, color:MUTED, marginBottom:2 }}>Enter subscriber details</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[{label:"First name",key:"fn"},{label:"Last name",key:"ln"}].map(x => (
                      <div key={x.key}>
                        <label style={{ fontSize:11, color:DIMMER, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{x.label}</label>
                        <input style={css.inp} value={f[x.key]} onChange={e=>setF(p=>({...p,[x.key]:e.target.value}))}/>
                      </div>
                    ))}
                  </div>
                  {[{label:"Email address",key:"email",type:"email"},{label:"Phone (verification)",key:"phone",type:"tel"}].map(x => (
                    <div key={x.key}>
                      <label style={{ fontSize:11, color:DIMMER, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{x.label}</label>
                      <input type={x.type} style={css.inp} value={f[x.key]} onChange={e=>setF(p=>({...p,[x.key]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: SIM & number */}
              {step===1 && (
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <div>
                    <div style={{ fontSize:13, color:MUTED, marginBottom:9 }}>SIM type</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {[{id:"esim",label:"eSIM",sub:"Instant activation"},{id:"physical",label:"Physical SIM",sub:"Ships in 3–5 days"}].map(o => (
                        <div key={o.id} onClick={() => setF(x=>({...x,sim:o.id}))} style={{ ...selCard(f.sim===o.id), flexDirection:"column", alignItems:"center", textAlign:"center", padding:"13px" }}>
                          <div style={{ fontWeight:700, fontSize:13, color: f.sim===o.id ? LIME : "#fff" }}>{o.label}</div>
                          <div style={{ fontSize:11, color: f.sim===o.id ? "rgba(200,241,53,0.6)" : DIMMER, marginTop:3 }}>{o.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:13, color:MUTED, marginBottom:8 }}>Number assignment</div>
                    {[{v:false,label:"New number",sub:"T-Mobile assigns a new MSISDN"},{v:true,label:"Port existing number",sub:"Keep current number (1–7 days)"}].map(o => (
                      <div key={String(o.v)} onClick={() => setF(x=>({...x,port:o.v}))} style={{ ...selCard(f.port===o.v), marginBottom:6 }}>
                        <div style={{ width:14, height:14, borderRadius:"50%", flexShrink:0, border:`2px solid ${f.port===o.v ? LIME : DIMMER}`, background: f.port===o.v ? LIME : "transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {f.port===o.v && <div style={{ width:5, height:5, borderRadius:"50%", background:DARK }}/>}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color: f.port===o.v ? LIME : "#fff" }}>{o.label}</div>
                          <div style={{ fontSize:11, color: f.port===o.v ? "rgba(200,241,53,0.6)" : DIMMER }}>{o.sub}</div>
                        </div>
                      </div>
                    ))}
                    {f.port && (
                      <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:8 }}>
                        <input placeholder="Current phone number" style={css.inp} value={f.portNum} onChange={e=>setF(x=>({...x,portNum:e.target.value}))}/>
                        <input placeholder="Current carrier" style={css.inp} value={f.portCarrier} onChange={e=>setF(x=>({...x,portCarrier:e.target.value}))}/>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                          <input placeholder="Account number" style={css.inp} value={f.portAcct} onChange={e=>setF(x=>({...x,portAcct:e.target.value}))}/>
                          <input placeholder="Account PIN" style={css.inp} value={f.portPin} onChange={e=>setF(x=>({...x,portPin:e.target.value}))}/>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step===2 && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ fontSize:13, color:MUTED, marginBottom:4 }}>Payment method</div>
                  {[
                    {id:"ach",  label:"ACH bank transfer",   sub:"0.8% fee, capped at $5 — linked via Plaid", badge:"Recommended"},
                    {id:"card", label:"Credit / Debit card", sub:"Interchange + 0.3% + $0.08 — surcharge passed to subscriber"},
                  ].map(o => (
                    <div key={o.id} onClick={() => setF(x=>({...x,pay:o.id}))} style={{ ...selCard(f.pay===o.id), justifyContent:"space-between" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                          <span style={{ fontWeight:700, fontSize:13, color: f.pay===o.id ? LIME : "#fff" }}>{o.label}</span>
                          {o.badge && <span style={{ background:"rgba(200,241,53,0.15)", color:LIME, fontSize:10, fontWeight:700, padding:"1px 8px", borderRadius:20 }}>{o.badge}</span>}
                        </div>
                        <div style={{ fontSize:11, color: f.pay===o.id ? "rgba(200,241,53,0.6)" : DIMMER }}>{o.sub}</div>
                      </div>
                      {f.pay===o.id && <span style={{ color:LIME, flexShrink:0 }}><Ic.check /></span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Review */}
              {step===3 && (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ fontSize:13, color:MUTED }}>Review and confirm</div>
                  <div style={{ background:"#222", border:`1px solid ${BORDER}`, borderRadius:10, padding:"12px 14px" }}>
                    {[
                      ["Subscriber", `${f.fn} ${f.ln}`.trim()||"—"],
                      ["Email",       f.email||"—"],
                      ["Plan",        "Glow Unlimited — $25/mo"],
                      ["SIM type",   f.sim==="esim"?"eSIM":"Physical SIM"],
                      ["Number",     f.port?`Port ${f.portNum||"—"}`:"New MSISDN"],
                      ["Payment",    f.pay==="ach"?"ACH via Plaid":"Credit/Debit card"],
                      ["Sales rep",  session.rep.salesNum],
                    ].map(([k,v],i) => (
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderTop: i>0 ? `1px solid ${BORDER}` : "none" }}>
                        <span style={{ fontSize:12, color:DIMMER }}>{k}</span>
                        <span style={{ fontSize:13, fontWeight:600, color: k==="Sales rep" ? LIME : "#fff" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:"rgba(200,241,53,0.07)", border:"1px solid rgba(200,241,53,0.2)", borderRadius:9, padding:"10px 12px", fontSize:12, color:LIME }}>
                    {f.sim==="esim" ? "eSIM activation typically completes within 30 seconds." : "Physical SIM ships within 1 business day via USPS."}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", borderTop:`1px solid ${BORDER}` }}>
              <button onClick={prevStep} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, color:MUTED }}>
                {step===0 ? "Cancel" : "← Back"}
              </button>
              <button onClick={nextStep} style={{ ...BTN_PRIMARY }}>
                {step===WSTEPS.length-1
                  ? "Submit activation"
                  : <span style={{ display:"flex", alignItems:"center", gap:5 }}>Continue <Ic.arrow /></span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROOT — routes between login and portal
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null);
  if (!session) return <LoginScreen onLogin={setSession}/>;
  return <Portal session={session} onLogout={() => setSession(null)}/>;
}
