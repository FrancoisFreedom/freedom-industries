import { useState, useMemo, useEffect, useRef } from "react";

// Fallback global (remplacé par L.days / L.months dans le composant)
const _DAYS_FR = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const _MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

// ── TRADUCTIONS ───────────────────────────────────────────────────
const I18N = {
  fr: {
    days: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],
    months: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
    journal:"Journal", dashboard:"Dashboard", compare:"Comparer",
    capital:"Capital", startCapital:"Capital de départ", current:"Actuel", departure:"Départ",
    month:"Mois", week:"Sem.", year:"Année", allTime:"All Time",
    ytd:"YTD", streak:"streak",
    goal:"Objectif", goalMonth:"Objectif", noGoal:"Aucun objectif défini", achieved:"✅ Atteint !",
    define:"+ Définir", modify:"Modifier", validate:"Valider",
    pnl:"Gain / Perte (€)", winners:"Gagnants", losers:"Perdants", breakeven:"Breakeven", rr:"RR Moyen",
    note:"Notes & analyse", mood:"Humeur", planRespected:"Plan respecté",
    yes:"✅ Oui", no:"❌ Non", partial:"➖ Partiel",
    instrument:"Instrument", setup:"Setup / Stratégie",
    entryHour:"Heure d'entrée",
    instruments:["Forex","Indices","Crypto","Actions","Matières 1ères","Obligations","Autre"],
    dailyEntry:"Saisie journalière", delete:"🗑 Effacer ce jour", save:"Valider",
    tradesMonth:"Stats du mois", totalTrades:"Total trades", winRate:"Win Rate", avgRR:"RR Moyen",
    badges:"🏅 Trophées & Badges", unlocked:"débloqués",
    analytics:"📊 Analytics avancés", maxDD:"📉 Drawdown max", bestDay:"🏆 Meilleur jour", worstDay:"💀 Pire jour",
    dowPerf:"📅 Performance par jour de la semaine", wrEvol:"📈 Évolution du Win Rate",
    heatmap:"🕐 Heatmap des heures de trading",
    annualRecap:"Récap annuel",
    capitalCurve:"Courbe d'évolution du capital",
    hint:"Clique sur 💰 pour ton capital · Clique sur un jour pour saisir · Le % est calculé automatiquement",
    noData:"Aucune donnée pour l'instant", startFilling:"Commence à remplir ton journal pour voir ton dashboard !",
    notEnoughData:"Pas encore assez de données", needTwoMonths:"Il te faut au moins 2 mois de données pour comparer !",
    monthlyHistory:"📊 Historique mensuel complet",
    trophiesUnlocked:"🏅 Trophées débloqués",
    compareTable:"⚖️ Comparaison mois par mois",
    sameMonthYears:"📊 Même mois, années différentes",
    avgWinLoss:"💹 Gain moyen vs Perte moyenne", avgWin:"Gain moyen / jour vert", avgLoss:"Perte moyenne / jour rouge",
    personalRecords:"🏆 Records personnels", bestMonthStreak:"Meilleure série de mois verts", bestDayEver:"Meilleur jour ever", worstDayEver:"Pire jour ever",
    realRatio:"Ratio réel", winMoreThanLose:"tu gagnes plus que tu ne perds 🎯", loseMoreThanWin:"attention, tes pertes dépassent tes gains ⚠️",
    allTimeStats:"📊 Stats All Time", since:"depuis le",
    totalPnl:"PnL Total", tradingDays:"Jours tradés", greenDays:"Jours verts", redDays:"Jours rouges",
    esperance:"Espérance", greenMonths:"Mois verts", months:"mois",
    mathEsperance:"🧮 Espérance mathématique",
    excellentEdge:"🚀 Excellent edge !", positiveEdge:"✅ Edge positif", negativeEdge:"⚠️ Edge négatif — revois ta stratégie",
    alertObjectif:"⚠️ Objectif mensuel en danger", alertStreak:"🔥 Streak en danger",
    alertObjectifDesc:(p)=>`Tu es à ${p}% de ton objectif — accélère !`,
    alertStreakDesc:(s)=>`${s} jour${s>1?"s":""} de streak — ne lâche pas maintenant !`,
    badgeUnlocked:"🏅 Badge débloqué !",
    exported:"Exporté le",
    generatedBy:"Généré par Chronicle · Trading Journal",
    on:"sur",
  },
  en: {
    days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    journal:"Journal", dashboard:"Dashboard", compare:"Compare",
    capital:"Capital", startCapital:"Starting capital", current:"Current", departure:"Start",
    month:"Month", week:"Wk.", year:"Year", allTime:"All Time",
    ytd:"YTD", streak:"streak",
    goal:"Goal", goalMonth:"Goal", noGoal:"No goal defined", achieved:"✅ Achieved!",
    define:"+ Set goal", modify:"Edit", validate:"Save",
    pnl:"Gain / Loss (€)", winners:"Winners", losers:"Losers", breakeven:"Breakeven", rr:"Avg RR",
    note:"Notes & analysis", mood:"Mood", planRespected:"Plan followed",
    yes:"✅ Yes", no:"❌ No", partial:"➖ Partial",
    instrument:"Instrument", setup:"Setup / Strategy",
    entryHour:"Entry time",
    instruments:["Forex","Indices","Crypto","Stocks","Commodities","Bonds","Other"],
    dailyEntry:"Daily entry", delete:"🗑 Clear this day", save:"Save",
    tradesMonth:"Month stats", totalTrades:"Total trades", winRate:"Win Rate", avgRR:"Avg RR",
    badges:"🏅 Trophies & Badges", unlocked:"unlocked",
    analytics:"📊 Advanced analytics", maxDD:"📉 Max drawdown", bestDay:"🏆 Best day", worstDay:"💀 Worst day",
    dowPerf:"📅 Performance by weekday", wrEvol:"📈 Win Rate evolution",
    heatmap:"🕐 Trading hours heatmap",
    annualRecap:"Annual recap",
    capitalCurve:"Capital growth curve",
    hint:"Click 💰 to set capital · Click a day to enter · % is auto-calculated",
    noData:"No data yet", startFilling:"Start filling your journal to see your dashboard!",
    notEnoughData:"Not enough data yet", needTwoMonths:"You need at least 2 months of data to compare!",
    monthlyHistory:"📊 Full monthly history",
    trophiesUnlocked:"🏅 Unlocked trophies",
    compareTable:"⚖️ Month by month comparison",
    sameMonthYears:"📊 Same month, different years",
    avgWinLoss:"💹 Avg win vs Avg loss", avgWin:"Avg gain / green day", avgLoss:"Avg loss / red day",
    personalRecords:"🏆 Personal records", bestMonthStreak:"Best green month streak", bestDayEver:"Best day ever", worstDayEver:"Worst day ever",
    realRatio:"Real ratio", winMoreThanLose:"you win more than you lose 🎯", loseMoreThanWin:"warning, your losses exceed your gains ⚠️",
    allTimeStats:"📊 All Time Stats", since:"since",
    totalPnl:"Total PnL", tradingDays:"Trading days", greenDays:"Green days", redDays:"Red days",
    esperance:"Expectancy", greenMonths:"Green months", months:"months",
    mathEsperance:"🧮 Mathematical expectancy",
    excellentEdge:"🚀 Excellent edge!", positiveEdge:"✅ Positive edge", negativeEdge:"⚠️ Negative edge — review your strategy",
    alertObjectif:"⚠️ Monthly goal at risk", alertStreak:"🔥 Streak at risk",
    alertObjectifDesc:(p)=>`You're at ${p}% of your goal — push harder!`,
    alertStreakDesc:(s)=>`${s} day${s>1?"s":""} streak — don't stop now!`,
    badgeUnlocked:"🏅 Badge unlocked!",
    exported:"Exported on",
    generatedBy:"Generated by Chronicle · Trading Journal",
    on:"of",
  },
  es: {
    days: ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"],
    months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    journal:"Diario", dashboard:"Dashboard", compare:"Comparar",
    capital:"Capital", startCapital:"Capital inicial", current:"Actual", departure:"Inicio",
    month:"Mes", week:"Sem.", year:"Año", allTime:"Todo el tiempo",
    ytd:"YTD", streak:"racha",
    goal:"Objetivo", goalMonth:"Objetivo", noGoal:"Sin objetivo definido", achieved:"✅ ¡Logrado!",
    define:"+ Definir", modify:"Modificar", validate:"Guardar",
    pnl:"Ganancia / Pérdida (€)", winners:"Ganadores", losers:"Perdedores", breakeven:"Breakeven", rr:"RR Promedio",
    note:"Notas y análisis", mood:"Estado de ánimo", planRespected:"Plan seguido",
    yes:"✅ Sí", no:"❌ No", partial:"➖ Parcial",
    instrument:"Instrumento", setup:"Setup / Estrategia",
    entryHour:"Hora de entrada",
    instruments:["Forex","Índices","Cripto","Acciones","Materias primas","Bonos","Otro"],
    dailyEntry:"Entrada diaria", delete:"🗑 Borrar este día", save:"Guardar",
    tradesMonth:"Stats del mes", totalTrades:"Total operaciones", winRate:"Win Rate", avgRR:"RR Promedio",
    badges:"🏅 Trofeos & Badges", unlocked:"desbloqueados",
    analytics:"📊 Analytics avanzados", maxDD:"📉 Drawdown máx.", bestDay:"🏆 Mejor día", worstDay:"💀 Peor día",
    dowPerf:"📅 Rendimiento por día de la semana", wrEvol:"📈 Evolución del Win Rate",
    heatmap:"🕐 Heatmap de horas de trading",
    annualRecap:"Resumen anual",
    capitalCurve:"Curva de evolución del capital",
    hint:"Clic en 💰 para el capital · Clic en un día para introducir · El % se calcula automáticamente",
    noData:"Sin datos por ahora", startFilling:"¡Empieza a rellenar tu diario para ver tu dashboard!",
    notEnoughData:"Datos insuficientes", needTwoMonths:"¡Necesitas al menos 2 meses de datos para comparar!",
    monthlyHistory:"📊 Historial mensual completo",
    trophiesUnlocked:"🏅 Trofeos desbloqueados",
    compareTable:"⚖️ Comparación mes a mes",
    sameMonthYears:"📊 Mismo mes, años distintos",
    avgWinLoss:"💹 Ganancia media vs Pérdida media", avgWin:"Ganancia media / día verde", avgLoss:"Pérdida media / día rojo",
    personalRecords:"🏆 Récords personales", bestMonthStreak:"Mejor racha de meses verdes", bestDayEver:"Mejor día ever", worstDayEver:"Peor día ever",
    realRatio:"Ratio real", winMoreThanLose:"ganas más de lo que pierdes 🎯", loseMoreThanWin:"atención, tus pérdidas superan tus ganancias ⚠️",
    allTimeStats:"📊 Stats All Time", since:"desde el",
    totalPnl:"PnL Total", tradingDays:"Días operados", greenDays:"Días verdes", redDays:"Días rojos",
    esperance:"Esperanza", greenMonths:"Meses verdes", months:"meses",
    mathEsperance:"🧮 Esperanza matemática",
    excellentEdge:"🚀 ¡Excelente edge!", positiveEdge:"✅ Edge positivo", negativeEdge:"⚠️ Edge negativo — revisa tu estrategia",
    alertObjectif:"⚠️ Objetivo mensual en riesgo", alertStreak:"🔥 Racha en peligro",
    alertObjectifDesc:(p)=>`Estás al ${p}% de tu objetivo — ¡acelera!`,
    alertStreakDesc:(s)=>`Racha de ${s} día${s>1?"s":""} — ¡no pares ahora!`,
    badgeUnlocked:"🏅 ¡Badge desbloqueado!",
    exported:"Exportado el",
    generatedBy:"Generado por Chronicle · Trading Journal",
    on:"de",
  },
};

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function getKey(y, m, d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function compound(vals) { return (vals.reduce((a, v) => a * (1 + v / 100), 1) - 1) * 100; }
function fmtPct(v, dec=2) { if (v === null || v === undefined || isNaN(v)) return null; return (v >= 0 ? "+" : "") + v.toFixed(dec) + "%"; }
function fmtMoney(v) { if (v === null || v === undefined || isNaN(v)) return null; return (v >= 0 ? "+" : "−") + Math.abs(v).toLocaleString("fr-FR", {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " €"; }

function makeBgColor(dark) {
  return (pct) => {
    if (pct === null) return dark ? "#1e2130" : "#f8f9fb";
    const i = Math.min(Math.abs(pct) / 4, 1);
    return pct >= 0 ? `rgba(16,185,90,${0.07 + i * (dark ? 0.25 : 0.17)})` : `rgba(239,68,68,${0.07 + i * (dark ? 0.25 : 0.17)})`;
  };
}
function makeBdColor(dark) {
  return (pct) => {
    if (pct === null) return dark ? "#2a2f45" : "#e8ecf2";
    const i = Math.min(Math.abs(pct) / 4, 1);
    return pct >= 0 ? `rgba(16,185,90,${0.2 + i * 0.5})` : `rgba(239,68,68,${0.2 + i * 0.5})`;
  };
}

// ── PALETTES D'ACCENT ────────────────────────────────────────────
// ── FREEDOM INDUSTRIES — PALETTE OR/NOIR ─────────────────────────
const ACCENT_COLORS = {
  or:     { name:"Or",      hex:"#C9A84C", bg_l:"rgba(201,168,76,0.10)",  bg_d:"rgba(201,168,76,0.13)",  bdr_l:"rgba(201,168,76,0.4)",  bdr_d:"rgba(201,168,76,0.35)",  grad:"135deg,#C9A84C,#E8C96A" },
  argent: { name:"Argent",  hex:"#94a3b8", bg_l:"rgba(148,163,184,0.10)", bg_d:"rgba(148,163,184,0.13)", bdr_l:"rgba(148,163,184,0.4)", bdr_d:"rgba(148,163,184,0.3)",  grad:"135deg,#94a3b8,#cbd5e1" },
  cuivre: { name:"Cuivre",  hex:"#b87333", bg_l:"rgba(184,115,51,0.10)",  bg_d:"rgba(184,115,51,0.13)",  bdr_l:"rgba(184,115,51,0.4)",  bdr_d:"rgba(184,115,51,0.35)",  grad:"135deg,#b87333,#d4915a" },
  jade:   { name:"Jade",    hex:"#10b981", bg_l:"rgba(16,185,129,0.10)",  bg_d:"rgba(16,185,129,0.13)",  bdr_l:"rgba(16,185,129,0.4)",  bdr_d:"rgba(16,185,129,0.35)",  grad:"135deg,#10b981,#34d399" },
  rubis:  { name:"Rubis",   hex:"#e11d48", bg_l:"rgba(225,29,72,0.10)",   bg_d:"rgba(225,29,72,0.13)",   bdr_l:"rgba(225,29,72,0.4)",   bdr_d:"rgba(225,29,72,0.35)",   grad:"135deg,#e11d48,#fb7185" },
  saphir: { name:"Saphir",  hex:"#3b82f6", bg_l:"rgba(59,130,246,0.10)",  bg_d:"rgba(59,130,246,0.13)",  bdr_l:"rgba(59,130,246,0.4)",  bdr_d:"rgba(59,130,246,0.35)",  grad:"135deg,#3b82f6,#60a5fa" },
};

function makeTheme(dark, accentKey = "or") {
  const A = ACCENT_COLORS[accentKey] || ACCENT_COLORS.or;
  return {
    dark,
    accent:     A.hex,
    accentBg:   dark ? A.bg_d  : A.bg_l,
    accentBdr:  dark ? A.bdr_d : A.bdr_l,
    accentGrad: `linear-gradient(${A.grad})`,
    bg:        dark ? "#080808" : "#F5F0E8",
    card:      dark ? "#0e0e0e" : "#FFFFFF",
    card2:     dark ? "#141414" : "#FAF6EE",
    border:    dark ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.25)",
    border2:   dark ? "rgba(201,168,76,0.06)" : "rgba(201,168,76,0.08)",
    text:      dark ? "#F2EDE4" : "#1a1208",
    text2:     dark ? "#c9b99a" : "#3d2f1a",
    text3:     dark ? "#8a8078" : "#8a7560",
    text4:     dark ? "#2a2520" : "#e8e0d0",
    inputBg:   dark ? "#141414" : "#FAF6EE",
    inputBdr:  dark ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.35)",
    btnBg:     dark ? "#141414" : "#F0EAE0",
    btnText:   dark ? "#a09080" : "#6b5c40",
    green:     "#16a34a",
    greenBg:   dark ? "rgba(16,163,74,0.15)"  : "#dcfce7",
    greenBdr:  dark ? "rgba(16,163,74,0.3)"   : "#86efac",
    red:       "#dc2626",
    redBg:     dark ? "rgba(220,38,38,0.15)"  : "#fee2e2",
    redBdr:    dark ? "rgba(220,38,38,0.3)"   : "#fca5a5",
    blue:      dark ? "#60a5fa" : "#1d4ed8",
    blueBg:    dark ? "rgba(96,165,250,0.15)" : "#dbeafe",
    blueBdr:   dark ? "rgba(96,165,250,0.3)"  : "#93c5fd",
    purple:    A.hex,
    purpleBg:  dark ? A.bg_d : A.bg_l,
    shadow:    dark ? "0 2px 16px rgba(0,0,0,0.7)"  : "0 2px 12px rgba(0,0,0,0.08)",
    shadow2:   dark ? "0 1px 6px rgba(0,0,0,0.5)"   : "0 1px 4px rgba(0,0,0,0.07)",
    fontSerif: "'Cormorant Garamond', Georgia, serif",
    fontMono:  "'DM Mono', 'Courier New', monospace",
  };
}

export default function Chronicle() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // ── MULTI-COMPTE ─────────────────────────────────────────────────
  const [accounts, setAccounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chronicle_accounts") || '[{"id":"default","name":"Compte principal","color":"#6366f1"}]'); }
    catch { return [{ id:"default", name:"Compte principal", color:"#6366f1" }]; }
  });
  const [activeAccount, setActiveAccount] = useState(() => localStorage.getItem("chronicle_active_account") || "default");
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  // Import CSV broker
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importPreview, setImportPreview] = useState(null); // { rows, format, warnings }
  const [importLoading, setImportLoading] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null); // null | "new" | accountId
  const [inputAccountName, setInputAccountName] = useState("");
  const [inputAccountColor, setInputAccountColor] = useState("#6366f1");

  const acct = activeAccount; // alias court
  const pfx = k => `${k}_${acct}`; // préfixe clé localStorage par compte

  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(pfx("chronicle_data")) || "{}"); } catch { return {}; }
  });
  const [capital, setCapital] = useState(() => localStorage.getItem(pfx("chronicle_capital")) || "");
  const [capitalInput, setCapitalInput] = useState("");
  const [editingCapital, setEditingCapital] = useState(false);
  // Dépôts / Retraits
  const [editingCashflow, setEditingCashflow] = useState(null);
  const [inputCashflow, setInputCashflow] = useState("");
  const [cashflows, setCashflows] = useState(() => {
    try { return JSON.parse(localStorage.getItem(pfx("chronicle_cashflows")) || "{}"); }
    catch { return {}; }
  });
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem(pfx("chronicle_goals")) || "{}"); } catch { return {}; }
  });
  const [editingGoal, setEditingGoal] = useState(false);
  const [inputGoalPct, setInputGoalPct] = useState("");
  const [inputGoalPnl, setInputGoalPnl] = useState("");
  // Risk Management
  const [riskRules, setRiskRules] = useState(() => {
    try { return JSON.parse(localStorage.getItem(pfx("chronicle_risk")) || "{}"); } catch { return {}; }
  });
  const [showRiskPanel, setShowRiskPanel] = useState(false);
  const [inputMaxLossDay, setInputMaxLossDay] = useState("");
  const [inputMaxLossPct, setInputMaxLossPct] = useState("");
  const [inputMaxTrades, setInputMaxTrades] = useState("");
  const [inputMinRR, setInputMinRR] = useState("");
  const [editing, setEditing] = useState(null);
  const [inputPnl, setInputPnl] = useState("");
  const [inputWins, setInputWins] = useState("");
  const [inputLosses, setInputLosses] = useState("");
  const [inputBe, setInputBe] = useState("");
  const [inputRR, setInputRR] = useState("");
  const [inputNote, setInputNote] = useState("");
  const [inputMood, setInputMood] = useState("");
  const [inputPlan, setInputPlan] = useState("");
  const [inputInstrument, setInputInstrument] = useState("");
  const [inputSetup, setInputSetup] = useState("");
  const [inputHour, setInputHour] = useState("");
  // IA
  // Journal narratif IA
  const [narrativeText, setNarrativeText] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chronicle_narratives") || "{}"); } catch { return {}; }
  });
  const [narrativeLoading, setNarrativeLoading] = useState(null); // weekIndex en cours
  // Notifications
  const [notifTime, setNotifTime] = useState(() => localStorage.getItem("chronicle_notif_time") || "08:00");
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem("chronicle_notif") === "1");
  const [notifStatus, setNotifStatus] = useState("");
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef(null);
  // Dropdowns header
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("chronicle_dark");
    return saved === null ? true : saved === "1"; // noir par défaut
  });
  const [accent, setAccent] = useState(() => localStorage.getItem("chronicle_accent") || "or");
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("chronicle_lang");
    return (saved && I18N[saved]) ? saved : "fr";
  });
  const L = I18N[lang] ?? I18N.fr;
  const DAYS = L.days ?? _DAYS_FR;
  const MONTHS = Array.isArray(L.months) ? L.months : _MONTHS_FR;
  const [showAllTime, setShowAllTime] = useState(false);
  const [view, setView] = useState("journal"); // "journal" | "dashboard" | "compare"
  const [badgeAnim, setBadgeAnim] = useState(null); // id du badge en cours d'animation
  const prevBadgeIds = useRef(new Set());
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const M = isMobile;

  const T = useMemo(() => makeTheme(dark, accent), [dark, accent]);
  const bgColor = useMemo(() => makeBgColor(dark), [dark]);
  const bdColor = useMemo(() => makeBdColor(dark), [dark]);

  useEffect(() => { localStorage.setItem("chronicle_data", JSON.stringify(data)); localStorage.setItem(pfx("chronicle_data"), JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem("chronicle_capital", capital); localStorage.setItem(pfx("chronicle_capital"), capital); }, [capital]);
  useEffect(() => { localStorage.setItem(pfx("chronicle_goals"), JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem(pfx("chronicle_cashflows"), JSON.stringify(cashflows)); }, [cashflows]);
  useEffect(() => { localStorage.setItem(pfx("chronicle_risk"), JSON.stringify(riskRules)); }, [riskRules]);
  useEffect(() => { localStorage.setItem("chronicle_narratives", JSON.stringify(narrativeText)); }, [narrativeText]);
  useEffect(() => { localStorage.setItem("chronicle_accounts", JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem("chronicle_active_account", activeAccount); }, [activeAccount]);

  // Switch de compte — recharge toutes les données du nouveau compte
  function switchAccount(id) {
    setActiveAccount(id);
    try { setData(JSON.parse(localStorage.getItem(`chronicle_data_${id}`) || "{}")); } catch { setData({}); }
    setCapital(localStorage.getItem(`chronicle_capital_${id}`) || "");
    try { setCashflows(JSON.parse(localStorage.getItem(`chronicle_cashflows_${id}`) || "{}")); } catch { setCashflows({}); }
    try { setGoals(JSON.parse(localStorage.getItem(`chronicle_goals_${id}`) || "{}")); } catch { setGoals({}); }
    try { setRiskRules(JSON.parse(localStorage.getItem(`chronicle_risk_${id}`) || "{}")); } catch { setRiskRules({}); }
    setShowAccountPanel(false);
  }

  function saveAccount() {
    if (!inputAccountName.trim()) return;
    if (editingAccount === "new") {
      const id = "acct_" + Date.now();
      setAccounts(a => [...a, { id, name: inputAccountName.trim(), color: inputAccountColor }]);
      switchAccount(id);
    } else {
      setAccounts(a => a.map(ac => ac.id === editingAccount ? {...ac, name:inputAccountName.trim(), color:inputAccountColor} : ac));
    }
    setEditingAccount(null); setInputAccountName(""); setInputAccountColor("#6366f1");
  }

  function deleteAccount(id) {
    if (accounts.length <= 1) return;
    setAccounts(a => a.filter(ac => ac.id !== id));
    if (activeAccount === id) switchAccount(accounts.find(ac=>ac.id!==id).id);
  }
  useEffect(() => { localStorage.setItem("chronicle_dark", dark ? "1" : "0"); }, [dark]);
  useEffect(() => { localStorage.setItem("chronicle_accent", accent); }, [accent]);
  useEffect(() => { localStorage.setItem("chronicle_lang", lang); }, [lang]);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Ferme les dropdowns si clic ailleurs
  useEffect(() => {
    if (!showLangPicker && !showAccentPicker) return;
    const close = () => { setShowLangPicker(false); setShowAccentPicker(false); };
    const t = setTimeout(() => window.addEventListener("click", close), 10);
    return () => { clearTimeout(t); window.removeEventListener("click", close); };
  }, [showLangPicker, showAccentPicker]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const todayKey = getKey(today.getFullYear(), today.getMonth(), today.getDate());
  const capitalNum = parseFloat(String(capital).replace(",", ".")) || null;

  const rows = useMemo(() => {
    const cells = [...Array(firstDay).fill(null), ...Array.from({length: daysInMonth}, (_, i) => i + 1)];
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i+7).concat(Array(7).fill(null)).slice(0,7));
    return weeks;
  }, [year, month, daysInMonth, firstDay]);

  const dayStats = useMemo(() => {
    const result = {};
    if (!capitalNum) {
      for (let d = 1; d <= daysInMonth; d++) {
        const k = getKey(year, month, d);
        result[k] = { pnl: data[k]?.pnl ?? null, pct: null, capitalBefore: null };
      }
      return result;
    }
    let runCap = capitalNum;
    for (let d = 1; d <= daysInMonth; d++) {
      const k = getKey(year, month, d);
      // Applique dépôt/retrait avant le trade du jour
      const cf = cashflows[k];
      if (cf) runCap += cf;
      const pnl = data[k]?.pnl ?? null;
      const capBefore = runCap;
      const pct = pnl !== null && capBefore > 0 ? (pnl / capBefore) * 100 : null;
      result[k] = { pnl, pct, capitalBefore: capBefore };
      if (pnl !== null) runCap += pnl;
    }
    return result;
  }, [data, cashflows, year, month, daysInMonth, capitalNum]);

  const weeklyStats = useMemo(() => rows.map(row => {
    const days = row.filter(Boolean);
    const pcts = days.map(d => dayStats[getKey(year,month,d)]?.pct).filter(v => v !== null);
    const pnls = days.map(d => dayStats[getKey(year,month,d)]?.pnl).filter(v => v !== null);
    return { pct: pcts.length ? compound(pcts) : null, pnl: pnls.length ? pnls.reduce((a,b)=>a+b,0) : null };
  }), [rows, dayStats, year, month]);

  const monthlyStats = useMemo(() => {
    const pcts = [], pnls = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const s = dayStats[getKey(year, month, d)];
      if (s?.pct != null) pcts.push(s.pct);
      if (s?.pnl != null) pnls.push(s.pnl);
    }
    return { pct: pcts.length ? compound(pcts) : null, pnl: pnls.length ? pnls.reduce((a,b)=>a+b,0) : null };
  }, [dayStats, year, month, daysInMonth]);

  const yearlyStats = useMemo(() => {
    const pnls = [], monthPcts = [];
    let runCap = capitalNum;
    for (let m = 0; m < 12; m++) {
      const dim = getDaysInMonth(year, m);
      let mPnl = 0, has = false;
      for (let d = 1; d <= dim; d++) {
        const e = data[getKey(year, m, d)] || {};
        if (e.pnl != null) { mPnl += e.pnl; pnls.push(e.pnl); has = true; }
      }
      if (has && runCap > 0) { monthPcts.push((mPnl / runCap) * 100); runCap += mPnl; }
    }
    return { pct: monthPcts.length ? compound(monthPcts) : null, pnl: pnls.length ? pnls.reduce((a,b)=>a+b,0) : null };
  }, [data, year, capitalNum]);

  const allMonths = useMemo(() => {
    const result = [];
    let runCap = capitalNum;
    for (let m = 0; m < 12; m++) {
      const dim = getDaysInMonth(year, m);
      let mPnl = 0, has = false, pcts = [], localCap = runCap;
      for (let d = 1; d <= dim; d++) {
        const e = data[getKey(year, m, d)] || {};
        if (e.pnl != null) {
          if (localCap) pcts.push((e.pnl / localCap) * 100);
          mPnl += e.pnl;
          if (localCap) localCap += e.pnl;
          has = true;
        }
      }
      result.push({ pct: pcts.length ? compound(pcts) : null, pnl: has ? mPnl : null });
      if (has && runCap) runCap += mPnl;
    }
    return result;
  }, [data, year, capitalNum]);

  const chartPoints = useMemo(() => {
    if (!capitalNum) return [];
    const pts = [{ day: 0, capital: capitalNum }];
    let runCap = capitalNum;
    for (let d = 1; d <= daysInMonth; d++) {
      const k = getKey(year, month, d);
      const cf = cashflows[k];
      if (cf) runCap += cf;
      const e = data[k] || {};
      if (e.pnl != null) { runCap += e.pnl; pts.push({ day: d, capital: runCap }); }
      else if (cf) { pts.push({ day: d, capital: runCap }); } // point visible pour dépôt/retrait seul
    }
    return pts;
  }, [data, cashflows, year, month, daysInMonth, capitalNum]);

  // ── STREAK ───────────────────────────────────────────────────────
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date(today);
    for (let i = 0; i < 365; i++) {
      const dow = d.getDay(); // 0=dim, 6=sam
      const k = getKey(d.getFullYear(), d.getMonth(), d.getDate());
      const e = data[k];

      if (!e || e.pnl == null) {
        // Jour sans donnée : on saute si c'est weekend OU aujourd'hui
        if (dow === 0 || dow === 6 || i === 0) { d.setDate(d.getDate()-1); continue; }
        // Jour de semaine vide → streak terminé
        break;
      }

      if (e.pnl > 0) {
        count++;
      } else {
        // Jour rouge : si c'est aujourd'hui on l'ignore
        if (i === 0) { d.setDate(d.getDate()-1); continue; }
        break;
      }
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [data]);

  // ── OBJECTIF ─────────────────────────────────────────────────────
  const goalKey = `${year}-${String(month+1).padStart(2,"0")}`;
  const currentGoal = goals[goalKey] || null;

  const goalProgress = useMemo(() => {
    if (!currentGoal?.target) return null;
    const actual = currentGoal.type === "pct" ? monthlyStats.pct : monthlyStats.pnl;
    if (actual === null) return { pct: 0, actual: 0, target: currentGoal.target, type: currentGoal.type, done: false };
    const pct = Math.max(0, Math.min(Math.round((actual / currentGoal.target) * 100), 100));
    return { pct, actual, target: currentGoal.target, type: currentGoal.type, done: actual >= currentGoal.target };
  }, [currentGoal, monthlyStats]);

  function saveGoal() {
    const pct = parseFloat(inputGoalPct.replace(",","."));
    const pnl = parseFloat(inputGoalPnl.replace(",","."));
    if (!isNaN(pct)) setGoals(g => ({...g, [goalKey]: { type: "pct", target: pct }}));
    else if (!isNaN(pnl)) setGoals(g => ({...g, [goalKey]: { type: "pnl", target: pnl }}));
    setEditingGoal(false);
  }

  // ── ANALYTICS ────────────────────────────────────────────────────
  const drawdownStats = useMemo(() => {
    if (!capitalNum) return null;
    let peak = capitalNum, maxDD = 0, maxDDPct = 0, runCap = capitalNum;
    for (let d = 1; d <= daysInMonth; d++) {
      const e = data[getKey(year, month, d)] || {};
      if (e.pnl == null) continue;
      runCap += e.pnl;
      if (runCap > peak) peak = runCap;
      const dd = peak - runCap;
      if (dd > maxDD) { maxDD = dd; maxDDPct = peak > 0 ? (dd / peak) * 100 : 0; }
    }
    return { maxDD, maxDDPct };
  }, [data, year, month, daysInMonth, capitalNum]);

  const dayOfWeekStats = useMemo(() => {
    const stats = Array(5).fill(null).map(() => ({ pnl: 0, count: 0 }));
    for (let m = 0; m < 12; m++) {
      for (let d = 1; d <= getDaysInMonth(year, m); d++) {
        const e = data[getKey(year, m, d)] || {};
        if (e.pnl == null) continue;
        const dow = new Date(year, m, d).getDay();
        const idx = dow === 0 ? null : dow - 1;
        if (idx == null || idx > 4) continue;
        stats[idx].pnl += e.pnl; stats[idx].count++;
      }
    }
    return stats.map((s, i) => ({ day: DAYS[i], avg: s.count > 0 ? s.pnl / s.count : null, count: s.count }));
  }, [data, year]);

  const wrEvolution = useMemo(() => rows.map((row, wi) => {
    let wins = 0, total = 0;
    row.filter(Boolean).forEach(d => {
      const e = data[getKey(year, month, d)] || {};
      wins += e.wins || 0; total += (e.wins||0)+(e.losses||0)+(e.be||0);
    });
    return { week: wi+1, wr: total > 0 ? Math.round(wins/total*100) : null, total };
  }).filter(w => w.total > 0), [rows, data, year, month]);

  const bestWorstDay = useMemo(() => {
    let best = null, worst = null;
    for (let d = 1; d <= daysInMonth; d++) {
      const e = data[getKey(year, month, d)] || {};
      if (e.pnl == null) continue;
      if (!best || e.pnl > best.pnl) best = { day: d, pnl: e.pnl };
      if (!worst || e.pnl < worst.pnl) worst = { day: d, pnl: e.pnl };
    }
    return { best, worst };
  }, [data, year, month, daysInMonth]);

  // ── TRADES DU MOIS ───────────────────────────────────────────────
  const monthlyTrades = useMemo(() => {
    let wins = 0, losses = 0, be = 0, rrVals = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const e = data[getKey(year, month, d)] || {};
      wins += e.wins||0; losses += e.losses||0; be += e.be||0;
      if (e.rr) rrVals.push(e.rr);
    }
    const total = wins+losses+be;
    return { wins, losses, be, total, wr: total>0 ? Math.round(wins/total*100) : null, avgRR: rrVals.length ? (rrVals.reduce((a,b)=>a+b,0)/rrVals.length).toFixed(1) : null };
  }, [data, year, month, daysInMonth]);

  // ── CAPITAL COURANT (avant badges) ───────────────────────────────
  const currentCapital = useMemo(() => {
    if (!capitalNum) return null;
    let cap = capitalNum;
    for (let d = 1; d <= daysInMonth; d++) {
      const k = getKey(year, month, d);
      const cf = cashflows[k];
      if (cf) cap += cf;
      const e = data[k] || {};
      if (e.pnl != null) cap += e.pnl;
    }
    return cap;
  }, [data, cashflows, year, month, daysInMonth, capitalNum]);

  // ── BADGES (après currentCapital) ────────────────────────────────
  const badges = useMemo(() => {
    const list = [];
    if (streak >= 5)  list.push({ id:"streak5",  icon:"🔥", label:"En feu",          desc:"5 jours verts de suite",   col:"#f59e0b", bg:"#fef3c7", unlocked:true });
    if (streak >= 10) list.push({ id:"streak10", icon:"⚡", label:"Semaine parfaite", desc:"10 jours verts de suite",  col:"#8b5cf6", bg:"#ede9fe", unlocked:true });
    if (streak >= 21) list.push({ id:"streak21", icon:"🌟", label:"Machine",           desc:"21 jours verts de suite",  col:"#0ea5e9", bg:"#e0f2fe", unlocked:true });
    if (streak >= 30) list.push({ id:"streak30", icon:"👑", label:"Légende",           desc:"30 jours verts de suite",  col:"#d97706", bg:"#fef3c7", unlocked:true });
    if (goalProgress?.done) list.push({ id:"goal", icon:"🎯", label:"Objectif atteint", desc:`${(I18N[lang]??I18N.fr).months[month]} ${year}`, col:"#10b981", bg:"#d1fae5", unlocked:true });
    const filled = Array.from({length:daysInMonth},(_,i)=>data[getKey(year,month,i+1)]).filter(e=>e&&e.pnl!=null).length;
    if (filled >= 20) list.push({ id:"discipline", icon:"💎", label:"Discipline", desc:`${filled} jours remplis`, col:"#6366f1", bg:"#eef2ff", unlocked:true });
    else if (filled >= 5) list.push({ id:"discipline_p", icon:"📒", label:"Régulier", desc:`${filled}/20 jours`, col:"#6b7280", bg:"#f3f4f6", unlocked:false, progress:Math.round(filled/20*100) });
    const moodDays = Array.from({length:daysInMonth},(_,i)=>data[getKey(year,month,i+1)]).filter(e=>e?.mood).length;
    if (moodDays >= 10) list.push({ id:"psycho", icon:"🧠", label:"Maître de soi", desc:`Humeur ${moodDays} jours`, col:"#ec4899", bg:"#fdf2f8", unlocked:true });
    const reds = Array.from({length:daysInMonth},(_,i)=>data[getKey(year,month,i+1)]).filter(e=>e?.pnl!=null&&e.pnl<0).length;
    if (filled >= 10 && reds === 0) list.push({ id:"ironman", icon:"🛡️", label:"Ironman", desc:"Zéro jour rouge", col:"#0ea5e9", bg:"#e0f2fe", unlocked:true });
    const bigDay = capitalNum && Array.from({length:daysInMonth},(_,i)=>dayStats[getKey(year,month,i+1)]?.pct).some(p=>p!=null&&p>=5);
    if (bigDay) list.push({ id:"bigday", icon:"🚀", label:"Big Day", desc:"+5% en une journée", col:"#10b981", bg:"#d1fae5", unlocked:true });
    if (capitalNum && currentCapital && currentCapital >= capitalNum*2) list.push({ id:"x2", icon:"💰", label:"Doublé !", desc:"Capital × 2", col:"#d97706", bg:"#fef3c7", unlocked:true });
    // Verrouillés
    if (!goalProgress?.done && currentGoal) list.push({ id:"goal_l", icon:"🎯", label:"Objectif mensuel", desc:"Atteins ta cible", col:"#d1d5db", bg:"#f9fafb", unlocked:false, progress:goalProgress?.pct??0 });
    if (streak < 5)  list.push({ id:"streak5_l",  icon:"🔥", label:"En feu",          desc:`${streak}/5 jours`,  col:"#d1d5db", bg:"#f9fafb", unlocked:false, progress:Math.round(streak/5*100) });
    if (streak >= 5 && streak < 10) list.push({ id:"streak10_l", icon:"⚡", label:"Semaine parfaite", desc:`${streak}/10 jours`, col:"#d1d5db", bg:"#f9fafb", unlocked:false, progress:Math.round(streak/10*100) });
    return list;
  }, [streak, goalProgress, daysInMonth, data, year, month, capitalNum, currentCapital, dayStats, currentGoal, lang]);

  // ── SON & ANIMATION BADGE ─────────────────────────────────────────
  useEffect(() => {
    if (!badges.length) return;
    const currentIds = new Set(badges.filter(b=>b.unlocked).map(b=>b.id));
    const newlyUnlocked = [...currentIds].filter(id => !prevBadgeIds.current.has(id));
    if (newlyUnlocked.length > 0 && prevBadgeIds.current.size > 0) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = "sine";
          const t = ctx.currentTime + i * 0.12;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.start(t); osc.stop(t + 0.35);
        });
      } catch(e) {}
      setBadgeAnim(newlyUnlocked[0]);
      setTimeout(() => setBadgeAnim(null), 2800);
    }
    prevBadgeIds.current = currentIds;
  }, [badges]);

  // ── EDIT HELPERS ─────────────────────────────────────────────────
  function openEdit(day) {
    const k = getKey(year, month, day);
    const e = data[k] || {};
    setEditing(k);
    setInputPnl(e.pnl != null ? String(e.pnl) : "");
    setInputWins(e.wins != null ? String(e.wins) : "");
    setInputLosses(e.losses != null ? String(e.losses) : "");
    setInputBe(e.be != null ? String(e.be) : "");
    setInputRR(e.rr != null ? String(e.rr) : "");
    setInputNote(e.note || ""); setInputMood(e.mood || ""); setInputPlan(e.plan || "");
    setInputInstrument(e.instrument || ""); setInputSetup(e.setup || ""); setInputHour(e.hour || "");
  }

  function saveEdit() {
    if (!editing) return;
    const pnl = parseFloat(inputPnl.replace(",",".")), wins = parseInt(inputWins), losses = parseInt(inputLosses), be = parseInt(inputBe), rr = parseFloat(inputRR.replace(",","."));
    const entry = {};
    if (!isNaN(pnl)) entry.pnl = pnl; if (!isNaN(wins)) entry.wins = wins; if (!isNaN(losses)) entry.losses = losses;
    if (!isNaN(be)) entry.be = be; if (!isNaN(rr)) entry.rr = rr;
    if (inputNote.trim()) entry.note = inputNote.trim(); if (inputMood) entry.mood = inputMood; if (inputPlan) entry.plan = inputPlan;
    if (inputInstrument) entry.instrument = inputInstrument;
    if (inputSetup.trim()) entry.setup = inputSetup.trim();
    if (inputHour) entry.hour = inputHour;
    if (Object.keys(entry).length > 0) setData(d => ({...d, [editing]: entry}));
    else setData(d => { const nd={...d}; delete nd[editing]; return nd; });
    setEditing(null);
  }

  function toggleDayOff(day) {
    const k = getKey(year, month, day);
    setData(d => {
      const cur = d[k] || {};
      if (cur.off) {
        const nd = {...d, [k]: {...cur}};
        delete nd[k].off;
        if (!Object.keys(nd[k]).length) delete nd[k];
        return nd;
      }
      return {...d, [k]: {...cur, off: true}};
    });
  }

  function saveCashflow() {
    if (!editingCashflow) return;
    const { key, type } = editingCashflow;
    const amount = parseFloat(inputCashflow.replace(",", "."));
    if (!isNaN(amount) && amount !== 0) {
      const signed = type === "depot" ? Math.abs(amount) : -Math.abs(amount);
      setCashflows(c => ({ ...c, [key]: signed }));
    } else {
      setCashflows(c => { const nc = { ...c }; delete nc[key]; return nc; });
    }
    setEditingCashflow(null);
    setInputCashflow("");
  }

  function saveCapital() { setCapital(capitalInput); setEditingCapital(false); }

  // ── IMPORT CSV BROKER ─────────────────────────────────────────────
  function detectFormat(headers) {
    const h = headers.map(x => x.toLowerCase().trim());
    const has = (...keys) => keys.every(k => h.some(x => x.includes(k)));
    if (has("ticket") && has("symbol") && has("profit")) return "mt4";
    if (has("position") && has("symbol") && has("profit")) return "mt5";
    if (has("position id") && has("symbol") && has("p&l")) return "ctrader";
    if (has("trade id") && has("instrument") && has("profit")) return "generic";
    if (has("date") && (has("pnl") || has("gain") || has("profit") || has("result"))) return "chronicle";
    return "unknown";
  }

  function parseRow(row, headers, format) {
    const get = (...keys) => {
      for (const k of keys) {
        const idx = headers.findIndex(h => h.toLowerCase().includes(k.toLowerCase()));
        if (idx !== -1 && row[idx] !== undefined) return String(row[idx]).trim();
      }
      return "";
    };

    let date = "", pnl = null, symbol = "", type = "", lots = "", openTime = "";

    if (format === "mt4" || format === "mt5") {
      openTime = get("open time", "time", "open");
      date = openTime.slice(0, 10).replace(/\//g, "-");
      if (date.length === 10 && date[4] !== "-") {
        // DD.MM.YYYY -> YYYY-MM-DD
        const parts = date.split(/[.\/-]/);
        if (parts[0].length === 2) date = `${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`;
      }
      pnl = parseFloat(get("profit", "p&l", "gain").replace(",", "."));
      symbol = get("symbol", "instrument");
      type = get("type", "direction");
      lots = get("lots", "volume", "size");
    } else if (format === "ctrader") {
      openTime = get("open time", "time", "entry time");
      date = openTime.slice(0, 10).replace(/\//g, "-");
      pnl = parseFloat(get("p&l", "profit", "net profit").replace(",", "."));
      symbol = get("symbol", "instrument", "pair");
      type = get("direction", "type", "side");
      lots = get("volume", "lots", "quantity");
    } else {
      // Chronicle ou générique
      const rawDate = get("date", "day", "jour");
      if (rawDate.includes("/")) {
        const p = rawDate.split("/");
        date = p[2]?.length === 4 ? `${p[2]}-${p[1].padStart(2,"0")}-${p[0].padStart(2,"0")}` : rawDate;
      } else {
        date = rawDate.slice(0, 10);
      }
      pnl = parseFloat(get("pnl", "profit", "gain", "result", "p&l").replace(",", ".").replace(" €",""));
      symbol = get("instrument", "symbol", "pair");
      type = get("type", "direction", "side");
    }

    // Validation date YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    if (isNaN(pnl)) return null;

    return { date, pnl, symbol: symbol.toUpperCase(), type: type.toLowerCase(), lots };
  }

  function groupByDay(trades) {
    const days = {};
    trades.forEach(t => {
      if (!days[t.date]) days[t.date] = { pnl: 0, wins: 0, losses: 0, be: 0, instruments: new Set() };
      days[t.date].pnl += t.pnl;
      if (t.pnl > 0) days[t.date].wins++;
      else if (t.pnl < 0) days[t.date].losses++;
      else days[t.date].be++;
      if (t.symbol) days[t.date].instruments.add(t.symbol);
    });
    return days;
  }

  // ── PARSER HTML MT4/MT5/cTrader ───────────────────────────────────
  function parseHTMLReport(html) {
    // MT5 "Rapport d'historique de trading" — encodage UTF-16 lu comme texte
    // Structure : Heure | Position | Symbole | Type | [hidden colspan=8] | Volume | Prix | S/L | T/P | Heure close | Prix close | Commission | Swap | Profit
    const isMT5History = html.includes("Rapport d’historique de trading") || 
                         html.includes("Rapport d'historique") ||
                         html.includes("ReportHistory") ||
                         html.includes("client terminal");

    if (isMT5History) {
      const warnings = [];
      const trades = [];
      const skipTypes = ["balance","deposit","withdrawal","credit","correction"];

      // MT5 HTML has 2 tables: "Positions" (with P&L) and "Ordres" (orders only)
      // We must parse ONLY the Positions table (before "Ordres" section)
      const ordresIdx = html.search(/<b>Ordres<\/b>/i);
      const positionsHtml = ordresIdx > 0 ? html.slice(0, ordresIdx) : html;

      // Match only colored trade rows (not headers)
      const rowRe = /<tr[^>]*bgcolor="(?:#FFFFFF|#F7F7F7)"[^>]*>([\s\S]*?)<\/tr>/gi;
      let rowMatch;
      while ((rowMatch = rowRe.exec(positionsHtml)) !== null) {
        const row = rowMatch[0];
        // Remove hidden cells (volume placeholder)
        const cleaned = row.replace(/<td[^>]*class="hidden"[^>]*>[\s\S]*?<\/td>/gi, "");
        // Extract td text values
        const tds = [];
        const tdRe = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        let m2;
        while ((m2 = tdRe.exec(cleaned)) !== null) {
          tds.push(m2[1].replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&#160;/g," ").trim());
        }
        if (tds.length < 13) continue;

        const dm = tds[0].match(/(\d{4})\.(\d{2})\.(\d{2})/);
        if (!dm) continue;
        const date   = `${dm[1]}-${dm[2]}-${dm[3]}`;
        const symbol = tds[2];
        const type   = tds[3].toLowerCase();
        if (!symbol || skipTypes.includes(type)) continue;

        // Columns: [0]date [1]posId [2]symbol [3]type [4]vol [5]priceOpen [6]sl [7]tp [8]dateClose [9]priceClose [10]commission [11]swap [12]profitGross
        const commission  = parseFloat((tds[10]||"0").replace(/\s/g,"").replace(",",".")) || 0;
        const swap        = parseFloat((tds[11]||"0").replace(/\s/g,"").replace(",",".")) || 0;
        const profitGross = parseFloat((tds[12]||"0").replace(/\s/g,"").replace(",","."));
        if (isNaN(profitGross)) continue;

        // TRUE NET = gross profit + commission + swap
        const pnl  = profitGross + commission + swap;
        const lots = parseFloat((tds[4]||"0").replace(",",".")) || 0;
        const sl   = parseFloat((tds[6]||"0").replace(",",".")) || 0;
        const tp   = parseFloat((tds[7]||"0").replace(",",".")) || 0;

        trades.push({ date, pnl, symbol: symbol.toUpperCase(), type, lots, sl, tp });
      }

      if (trades.length > 0) {
        return { trades, format: "html-mt5", warnings };
      }
      warnings.push("Structure MT5 non reconnue — tentative générique");
      return { trades: [], format: "html-mt5-failed", warnings };
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const trades = [];
    const warnings = [];
    let format = "html-unknown";

    // Detect broker format by title or table headers
    const title = doc.title || doc.querySelector('title')?.textContent || "";
    const bodyText = doc.body?.textContent || "";
    const isMT5 = title.includes("MetaTrader 5") || bodyText.includes("MetaTrader 5") || doc.querySelector('.trade') !== null;
    const isMT4 = title.includes("MetaTrader 4") || bodyText.includes("MetaTrader 4");
    const isCTrader = title.includes("cTrader") || bodyText.includes("cTrader");

    if (isMT5) format = "html-mt5";
    else if (isMT4) format = "html-mt4";
    else if (isCTrader) format = "html-ctrader";
    else format = "html-generic";

    // Find all tables in the document
    const tables = doc.querySelectorAll("table");

    tables.forEach(table => {
      const rows = table.querySelectorAll("tr");
      if (rows.length < 2) return;

      // Get headers from first row
      const headerRow = rows[0];
      const headers = Array.from(headerRow.querySelectorAll("td,th")).map(td =>
        td.textContent.trim().toLowerCase()
      );

      // Check if this table has trade data
      const hasTime = headers.some(h => h.includes("time") || h.includes("heure") || h.includes("open"));
      const hasProfit = headers.some(h => h.includes("profit") || h.includes("bénéfice") || h.includes("p&l") || h.includes("gain"));
      const hasSymbol = headers.some(h => h.includes("symbol") || h.includes("symbole") || h.includes("instrument") || h.includes("pair"));

      if (!hasProfit) return; // not a trades table

      // Map column indices
      const idx = {
        time:   headers.findIndex(h => h.includes("time") || h.includes("open") || h.includes("heure")),
        profit: headers.findIndex(h => h.includes("profit") || h.includes("bénéfice") || h.includes("p&l") || h.includes("gain")),
        symbol: headers.findIndex(h => h.includes("symbol") || h.includes("symbole") || h.includes("instrument")),
        type:   headers.findIndex(h => h === "type" || h === "direction" || h === "side"),
        lots:   headers.findIndex(h => h.includes("lots") || h.includes("volume") || h.includes("size") || h.includes("qty")),
      };

      // Parse data rows
      for (let i = 1; i < rows.length; i++) {
        const cells = Array.from(rows[i].querySelectorAll("td,th")).map(td =>
          td.textContent.trim()
        );
        if (cells.length < 2) continue;

        // Get profit value
        const profitStr = idx.profit >= 0 ? cells[idx.profit] : "";
        const profit = parseFloat(profitStr.replace(/\s/g, "").replace(",", "."));
        if (isNaN(profit)) continue;

        // Get date from time column
        let date = "";
        if (idx.time >= 0 && cells[idx.time]) {
          const timeStr = cells[idx.time];
          // Formats: "2025.03.15 10:22:33" or "2025-03-15 10:22" or "15/03/2025"
          const m1 = timeStr.match(/(\d{4})[.\/-](\d{2})[.\/-](\d{2})/);
          const m2 = timeStr.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
          if (m1) date = `${m1[1]}-${m1[2]}-${m1[3]}`;
          else if (m2) date = `${m2[3]}-${m2[2]}-${m2[1]}`;
        }

        // Skip summary/total rows
        if (!date && profit !== 0) {
          // Some MT4 reports don't have dates on every row - skip
          continue;
        }
        if (!date) continue;

        const symbol = idx.symbol >= 0 ? cells[idx.symbol].toUpperCase() : "";
        const type   = idx.type   >= 0 ? cells[idx.type].toLowerCase()   : "";
        const lots   = idx.lots   >= 0 ? parseFloat(cells[idx.lots].replace(",",".")) || 0 : 0;

        trades.push({ date, pnl: profit, symbol, type, lots });
      }
    });

    if (!trades.length) {
      // Fallback: try to find data in divs/spans (some cTrader reports)
      warnings.push("Structure HTML non standard — tentative de parsing alternatif");
      const rows2 = doc.querySelectorAll("tr");
      rows2.forEach(row => {
        const cells = Array.from(row.querySelectorAll("td")).map(td => td.textContent.trim());
        if (cells.length < 4) return;
        // Look for date pattern and number pattern
        const dateCell = cells.find(c => /\d{4}[.\/-]\d{2}[.\/-]\d{2}/.test(c) || /\d{2}[\/\-]\d{2}[\/\-]\d{4}/.test(c));
        const numCell  = cells.find(c => /^-?\d+[.,]\d{2}$/.test(c.replace(/\s/g,"")));
        if (!dateCell || !numCell) return;
        const m1 = dateCell.match(/(\d{4})[.\/-](\d{2})[.\/-](\d{2})/);
        const m2 = dateCell.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
        let date = "";
        if (m1) date = `${m1[1]}-${m1[2]}-${m1[3]}`;
        else if (m2) date = `${m2[3]}-${m2[2]}-${m2[1]}`;
        const pnl = parseFloat(numCell.replace(",",".").replace(/\s/g,""));
        if (date && !isNaN(pnl)) trades.push({ date, pnl, symbol: "", type: "", lots: 0 });
      });
    }

    return { trades, format, warnings };
  }

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImportLoading(true);

    const isPDF = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";

    if (isPDF) {
      // ── PDF via PDF.js ──────────────────────────────────────────
      const loadPdfJs = () => new Promise((resolve, reject) => {
        if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(window.pdfjsLib);
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });

      const reader = new FileReader();
      reader.onload = async ev => {
        try {
          const pdfjsLib = await loadPdfJs();
          const pdfData = new Uint8Array(ev.target.result);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

          // Extract all text from all pages
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            // Group items by Y position to reconstruct rows
            const items = content.items.map(item => ({
              text: item.str,
              x: Math.round(item.transform[4]),
              y: Math.round(item.transform[5]),
            }));
            // Sort by Y desc then X asc to get reading order
            items.sort((a,b) => b.y - a.y || a.x - b.x);
            // Group by Y position (same line = within 3px)
            const lines = [];
            let currentY = null, currentLine = [];
            items.forEach(item => {
              if (currentY === null || Math.abs(item.y - currentY) > 3) {
                if (currentLine.length) lines.push(currentLine.map(i=>i.text).join(" "));
                currentLine = [item];
                currentY = item.y;
              } else {
                currentLine.push(item);
              }
            });
            if (currentLine.length) lines.push(currentLine.map(i=>i.text).join(" "));
            fullText += lines.join("\n") + "\n";
          }

          // Parse extracted text — look for date + profit patterns
          const trades = [];
          const warnings = ["Format PDF — parsing automatique du texte"];
          const dateRe = /(\d{4})[.\/-](\d{2})[.\/-](\d{2})|(\d{2})[\/\-](\d{2})[\/\-](\d{4})/;
          const numRe  = /^-?\d{1,6}[.,]\d{2}$/;
          const skipTypes = ["balance","deposit","withdrawal","credit","solde","dépôt","retrait"];

          const lines2 = fullText.split("\n").filter(l => l.trim());
          lines2.forEach(line => {
            const dm1 = line.match(/(\d{4})[.\/-](\d{2})[.\/-](\d{2})/);
            const dm2 = line.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
            let date = "";
            if (dm1) date = `${dm1[1]}-${dm1[2]}-${dm1[3]}`;
            else if (dm2) date = `${dm2[3]}-${dm2[2]}-${dm2[1]}`;
            if (!date) return;

            const lc = line.toLowerCase();
            if (skipTypes.some(s => lc.includes(s))) return;

            // Find profit — last number on the line
            const numbers = line.match(/-?\d{1,6}[.,]\d{2}/g);
            if (!numbers || numbers.length < 1) return;
            const profit = parseFloat(numbers[numbers.length-1].replace(",","."));
            if (isNaN(profit)) return;

            // Try to get symbol
            const symbolM = line.match(/\b([A-Z]{3,10}(?:USD|EUR|GBP|JPY|\.r)?)\b/);
            const symbol = symbolM ? symbolM[1] : "";
            const typeM = line.match(/\b(buy|sell|long|short)\b/i);
            const type = typeM ? typeM[1].toLowerCase() : "";

            trades.push({ date, pnl: profit, symbol, type, lots: 0 });
          });

          if (!trades.length) {
            setImportPreview({ rows: [], format: "pdf", warnings: ["Aucun trade trouvé dans le PDF. Le format de ce broker n'est pas encore supporté. Essaie de convertir en HTML ou CSV depuis l'app bureau."] });
            setImportLoading(false);
            return;
          }

          const grouped = groupByDay(trades);
          const rows = Object.entries(grouped).sort(([a],[b])=>a.localeCompare(b)).map(([date,d])=>({
            date, pnl: parseFloat(d.pnl.toFixed(2)),
            wins: d.wins, losses: d.losses, be: d.be,
            instrument: [...d.instruments].slice(0,3).join(", "),
            existing: !!data[date],
          }));
          if (trades.length > rows.length * 3)
            warnings.push(`${trades.length} trades regroupés en ${rows.length} journées`);
          setImportPreview({ rows, format: "pdf", warnings, totalTrades: trades.length });
        } catch (err) {
          setImportPreview({ rows: [], format: "pdf-error", warnings: ["Erreur lecture PDF : " + err.message] });
        }
        setImportLoading(false);
      };
      reader.readAsArrayBuffer(file);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const text = ev.target.result;
        const isHTML = file.name.toLowerCase().endsWith(".htm") ||
                       file.name.toLowerCase().endsWith(".html") ||
                       text.trimStart().startsWith("<!") ||
                       text.trimStart().startsWith("<html") ||
                       /<table/i.test(text.slice(0, 2000));

        let trades = [], format = "", warnings = [];

        if (isHTML) {
          // ── HTML report (MT4/MT5/cTrader export) ──
          const result = parseHTMLReport(text);
          trades   = result.trades;
          format   = result.format;
          warnings = result.warnings;
        } else {
          // ── CSV ──
          const firstLine = text.split("\n")[0];
          const sep = firstLine.includes(";") ? ";" : ",";
          const lines = text.split("\n").filter(l => l.trim());
          const headers = lines[0].split(sep).map(h => h.replace(/^"|"$/g, "").trim());
          format = detectFormat(headers);
          if (format === "unknown") warnings.push("Format non reconnu — tentative de parsing générique");
          for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(sep).map(v => v.replace(/^"|"$/g, "").trim());
            if (row.length < 3) continue;
            const parsed = parseRow(row, headers, format);
            if (parsed) trades.push(parsed);
          }
        }

        if (!trades.length) {
          warnings.push("Aucun trade valide trouvé. Vérifie le format du fichier.");
          setImportPreview({ rows: [], format, warnings });
          setImportLoading(false);
          return;
        }

        const grouped = groupByDay(trades);
        const rows = Object.entries(grouped).sort(([a],[b]) => a.localeCompare(b)).map(([date, d]) => ({
          date,
          pnl: parseFloat(d.pnl.toFixed(2)),
          wins: d.wins,
          losses: d.losses,
          be: d.be,
          instrument: [...d.instruments].slice(0,3).join(", "),
          existing: !!data[date],
        }));

        if (trades.length > rows.length * 3)
          warnings.push(`${trades.length} trades regroupés en ${rows.length} journées`);

        setImportPreview({ rows, format, warnings, totalTrades: trades.length });
      } catch (err) {
        setImportPreview({ rows: [], format: "error", warnings: ["Erreur de lecture : " + err.message] });
      }
      setImportLoading(false);
    };
    // MT5 exports in UTF-16 — try to detect and re-read if needed
    const sniff = new FileReader();
    sniff.onload = ev => {
      const bytes = new Uint8Array(ev.target.result.slice(0, 4));
      // BOM for UTF-16 LE: 0xFF 0xFE, UTF-16 BE: 0xFE 0xFF
      const isUTF16 = (bytes[0] === 0xFF && bytes[1] === 0xFE) || (bytes[0] === 0xFE && bytes[1] === 0xFF);
      reader.readAsText(file, isUTF16 ? "UTF-16" : "UTF-8");
    };
    sniff.readAsArrayBuffer(file.slice(0, 4));
    e.target.value = "";
  }

  function confirmImport(mode) {
    // mode: "merge" (garde existant) | "replace" (écrase)
    if (!importPreview?.rows?.length) return;
    const newData = { ...data };
    importPreview.rows.forEach(row => {
      if (mode === "merge" && newData[row.date]) return; // skip existing
      newData[row.date] = {
        pnl: row.pnl,
        wins: row.wins,
        losses: row.losses,
        be: row.be,
        ...(row.instrument ? { instrument: row.instrument } : {}),
        ...(newData[row.date] || {}), // keep existing notes/mood if merge
        pnl: row.pnl, // always update pnl
      };
      if (mode === "replace") {
        newData[row.date] = { pnl: row.pnl, wins: row.wins, losses: row.losses, be: row.be };
        if (row.instrument) newData[row.date].instrument = row.instrument;
      }
    });
    setData(newData);
    setImportPreview(null);
    setShowImportPanel(false);
  }

  // ── NOTIFICATION SCHEDULER ────────────────────────────────────────
  useEffect(() => {
    if (notifRef.current) clearInterval(notifRef.current);
    if (!notifEnabled || Notification.permission !== "granted") return;
    const check = () => {
      const now = new Date();
      const [hh, mm] = notifTime.split(":").map(Number);
      if (now.getHours() === hh && now.getMinutes() === mm) {
        const todayFilled = data[getKey(now.getFullYear(), now.getMonth(), now.getDate())];
        if (!todayFilled || todayFilled.pnl == null) {
          new Notification("Chronicle 📈", { body: (I18N[lang] ?? I18N.fr).notifMsg, icon: "https://fav.farm/📈" });
        }
      }
    };
    notifRef.current = setInterval(check, 60000);
    return () => clearInterval(notifRef.current);
  }, [notifEnabled, notifTime, data, lang]);

  useEffect(() => { localStorage.setItem("chronicle_notif", notifEnabled ? "1" : "0"); }, [notifEnabled]);
  useEffect(() => { localStorage.setItem("chronicle_notif_time", notifTime); }, [notifTime]);

  async function enableNotif() {
    if (!("Notification" in window)) { setNotifStatus("denied"); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") { setNotifEnabled(true); setNotifStatus("granted"); }
    else { setNotifStatus("denied"); }
  }
  function disableNotif() { setNotifEnabled(false); setNotifStatus(""); }

  // ── JOURNAL NARRATIF IA ───────────────────────────────────────────
  async function generateNarrative(wi) {
    if (!apiKey) { setShowAI(true); setAiText("__NO_KEY__"); return; }
    const row = rows[wi];
    const days = row.filter(Boolean);
    if (!days.length) return;
    setNarrativeLoading(wi);
    const weekData = days.map(d => {
      const k = getKey(year, month, d);
      const e = data[k] || {};
      const s = dayStats[k] || {};
      return { jour: d, pnl: e.pnl, pct: s.pct?.toFixed(2), humeur: e.mood, plan: e.plan, setup: e.setup, note: e.note, rr: e.rr };
    }).filter(x => x.pnl != null);
    if (!weekData.length) { setNarrativeLoading(null); return; }
    const totalW = weekData.reduce((a,x)=>a+x.pnl,0);
    const prompt = `Tu es un coach de trading. En 3-4 phrases max, rédige un résumé narratif et humain de cette semaine de trading. Sois direct, bienveillant, cite des chiffres concrets. Données : ${JSON.stringify(weekData)}. PnL semaine : ${totalW.toFixed(0)}€. Réponds en ${lang==="en"?"anglais":lang==="es"?"espagnol":"français"}.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-allow-browser":"true"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:300,
          system:"Tu es un coach de trading concis et bienveillant. 3-4 phrases max, pas de titre.",
          messages:[{role:"user",content:prompt}]})
      });
      const json = await res.json();
      const txt = json.content?.map(b=>b.text||"").join("") || "Erreur de génération.";
      setNarrativeText(n => ({...n, [`${year}-${month}-${wi}`]: txt}));
    } catch (e) { setNarrativeText(n => ({...n, [`${year}-${month}-${wi}`]: "Erreur : " + e.message})); }
    setNarrativeLoading(null);
  }


  // ── EXPORT CSV ───────────────────────────────────────────────────
  function exportCSV() {
    const acName = accounts.find(a=>a.id===activeAccount)?.name || "Chronicle";
    const headers = ["Date","Jour","PnL (€)","PnL (%)","Capital avant","Gagnants","Perdants","BE","Win Rate (%)","RR","Humeur","Plan respecté","Setup","Instrument","Heure","Note","Dépôt/Retrait (€)"];
    const rows = Object.keys(data).sort().map(k => {
      const e = data[k] || {};
      const s = dayStats[k] || {};
      const [y,m,d] = k.split("-");
      const date = new Date(parseInt(y),parseInt(m)-1,parseInt(d));
      const jour = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"][date.getDay()];
      const total = (e.wins||0)+(e.losses||0)+(e.be||0);
      const wr = total > 0 ? Math.round((e.wins||0)/total*100) : "";
      const cf = cashflows[k] || "";
      return [
        `${d}/${m}/${y}`,
        jour,
        e.pnl != null ? e.pnl.toFixed(2) : "",
        s.pct != null ? s.pct.toFixed(2) : "",
        s.capitalBefore != null ? s.capitalBefore.toFixed(2) : "",
        e.wins ?? "",
        e.losses ?? "",
        e.be ?? "",
        wr,
        e.rr ?? "",
        e.mood ?? "",
        e.plan ?? "",
        (e.setup ?? "").replace(/,/g, ";"),
        (e.instrument ?? "").replace(/,/g, ";"),
        e.hour ?? "",
        (e.note ?? "").replace(/,/g, ";").replace(/\n/g, " "),
        cf !== "" ? cf.toFixed(2) : "",
      ];
    });

    // Also add cashflow-only days (deposits/withdrawals without trades)
    Object.keys(cashflows).filter(k => !data[k]).sort().forEach(k => {
      const [y,m,d] = k.split("-");
      const cf = cashflows[k];
      rows.push([`${d}/${m}/${y}`,"","","","","","","","","","","","","","","",cf.toFixed(2)]);
    });

    rows.sort((a,b) => a[0].split("/").reverse().join("").localeCompare(b[0].split("/").reverse().join("")));

    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
    const encoded = "data:text/csv;charset=utf-8," + encodeURIComponent("\uFEFF" + csv);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = `${acName}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── ALL TIME STATS ────────────────────────────────────────────────
  const allTimeStats = useMemo(() => {
    const keys = Object.keys(data).sort();
    if (!keys.length) return null;
    let totalPnl = 0, totalWins = 0, totalLosses = 0, totalBe = 0, rrVals = [];
    let greenDays = 0, redDays = 0, tradingDays = 0;
    let bestDay = null, worstDay = null;
    const monthlyPnls = {};

    for (const k of keys) {
      const e = data[k];
      if (!e || e.pnl == null) continue;
      tradingDays++;
      totalPnl += e.pnl;
      if (e.pnl > 0) greenDays++;
      else if (e.pnl < 0) redDays++;
      if (!bestDay || e.pnl > bestDay.pnl) bestDay = { key: k, pnl: e.pnl };
      if (!worstDay || e.pnl < worstDay.pnl) worstDay = { key: k, pnl: e.pnl };
      if (e.wins) totalWins += e.wins;
      if (e.losses) totalLosses += e.losses;
      if (e.be) totalBe += e.be;
      if (e.rr) rrVals.push(e.rr);
      const mKey = k.slice(0, 7);
      if (!monthlyPnls[mKey]) monthlyPnls[mKey] = 0;
      monthlyPnls[mKey] += e.pnl;
    }

    const totalTrades = totalWins + totalLosses + totalBe;
    const wr = totalTrades > 0 ? (totalWins / totalTrades) * 100 : null;
    const avgRR = rrVals.length ? rrVals.reduce((a,b)=>a+b,0)/rrVals.length : null;
    // Espérance = WR × RR − (1−WR)
    const esperance = (wr !== null && avgRR !== null) ? (wr/100 * avgRR) - (1 - wr/100) : null;

    const mPnlVals = Object.values(monthlyPnls);
    const bestMonth = mPnlVals.length ? Math.max(...mPnlVals) : null;
    const worstMonth = mPnlVals.length ? Math.min(...mPnlVals) : null;
    const bestMonthKey = bestMonth !== null ? Object.keys(monthlyPnls).find(k => monthlyPnls[k] === bestMonth) : null;
    const worstMonthKey = worstMonth !== null ? Object.keys(monthlyPnls).find(k => monthlyPnls[k] === worstMonth) : null;
    const greenMonths = mPnlVals.filter(v => v > 0).length;
    const redMonths = mPnlVals.filter(v => v < 0).length;

    // Max drawdown all time
    let maxDD = 0, maxDDPct = 0;
    if (capitalNum) {
      let runCap = capitalNum, peak = capitalNum;
      for (const k of keys) {
        const e = data[k];
        if (!e || e.pnl == null) continue;
        runCap += e.pnl;
        if (runCap > peak) peak = runCap;
        const dd = peak - runCap;
        if (dd > maxDD) { maxDD = dd; maxDDPct = peak > 0 ? (dd / peak) * 100 : 0; }
      }
    }

    return {
      totalPnl, tradingDays, greenDays, redDays,
      totalWins, totalLosses, totalBe, totalTrades,
      wr, avgRR, esperance,
      bestDay, worstDay,
      bestMonthKey, worstMonthKey, bestMonth, worstMonth,
      greenMonths, redMonths, totalMonths: mPnlVals.length,
      maxDD, maxDDPct,
      firstDate: keys[0], lastDate: keys[keys.length-1],
    };
  }, [data, capitalNum, lang]);

  // ── COMPARAISON MOIS ──────────────────────────────────────────────
  const compareData = useMemo(() => {
    // Génère stats pour tous les mois de toutes les années dans data
    const result = [];
    const years = [...new Set(Object.keys(data).map(k => k.slice(0,4)))].sort();
    for (const y of years) {
      let runCap = capitalNum;
      for (let m = 0; m < 12; m++) {
        const dim = getDaysInMonth(parseInt(y), m);
        let pnl = 0, wins = 0, losses = 0, be = 0, hasDays = false;
        let localCap = runCap;
        const pcts = [];
        for (let d = 1; d <= dim; d++) {
          const e = data[getKey(parseInt(y), m, d)] || {};
          if (e.pnl != null) {
            hasDays = true;
            pnl += e.pnl;
            if (localCap) { pcts.push((e.pnl/localCap)*100); localCap += e.pnl; }
            if (e.wins) wins += e.wins;
            if (e.losses) losses += e.losses;
            if (e.be) be += e.be;
          }
        }
        if (hasDays) {
          const total = wins+losses+be;
          result.push({
            year: parseInt(y), month: m,
            label: `${(I18N[lang]??I18N.fr).months[m].slice(0,4)} ${y}`,
            pnl, pct: pcts.length ? pcts.reduce((a,b)=>a*(1+b/100),1)*100-100 : null,
            wr: total>0 ? Math.round(wins/total*100) : null,
            wins, losses, be, total,
          });
          if (runCap) runCap += pnl;
        }
      }
    }
    return result;
  }, [data, capitalNum, lang]);

  // ── DASHBOARD DATA ────────────────────────────────────────────────
  const dashboardData = useMemo(() => {
    if (!allTimeStats) return null;
    // Meilleure série de mois verts consécutifs
    let bestStreak = 0, curStreak = 0;
    for (const m of compareData) {
      if (m.pnl > 0) { curStreak++; bestStreak = Math.max(bestStreak, curStreak); }
      else curStreak = 0;
    }
    // Ratio risk/reward global
    const avgWin = allTimeStats.totalWins > 0 ? (compareData.flatMap(m => {
      const days = [];
      for (let d=1;d<=getDaysInMonth(m.year,m.month);d++){
        const e=data[getKey(m.year,m.month,d)]||{};
        if(e.pnl!=null&&e.pnl>0) days.push(e.pnl);
      }
      return days;
    }).reduce((a,b)=>a+b,0) / allTimeStats.greenDays) : 0;
    const avgLoss = allTimeStats.redDays > 0 ? (compareData.flatMap(m => {
      const days = [];
      for (let d=1;d<=getDaysInMonth(m.year,m.month);d++){
        const e=data[getKey(m.year,m.month,d)]||{};
        if(e.pnl!=null&&e.pnl<0) days.push(Math.abs(e.pnl));
      }
      return days;
    }).reduce((a,b)=>a+b,0) / allTimeStats.redDays) : 0;
    return { bestMonthStreak: bestStreak, avgWin, avgLoss };
  }, [allTimeStats, compareData, data]);

  // ── HEATMAP HEURES ────────────────────────────────────────────────
  const heatmapData = useMemo(() => {
    // heures 0-23, on compte pnl et nombre de trades
    const hours = Array.from({length:24}, (_,i) => ({ hour:i, pnl:0, count:0, wins:0 }));
    for (const k of Object.keys(data)) {
      const e = data[k];
      if (!e || e.pnl == null || !e.hour) continue;
      const h = parseInt(e.hour);
      if (isNaN(h) || h < 0 || h > 23) continue;
      hours[h].pnl += e.pnl;
      hours[h].count++;
      if (e.pnl > 0) hours[h].wins++;
    }
    return hours.filter(h => h.count > 0);
  }, [data]);

  // ── COURBE PNL CUMULÉ ALL-TIME ────────────────────────────────────
  const allTimeCurve = useMemo(() => {
    const keys = Object.keys(data).sort();
    if (keys.length < 2) return [];
    let cumPnl = 0;
    const pts = [{ date: keys[0], cumPnl: 0, idx: 0 }];
    keys.forEach((k, i) => {
      const e = data[k];
      if (!e || e.pnl == null) return;
      cumPnl += e.pnl;
      pts.push({ date: k, cumPnl, idx: i + 1 });
    });
    return pts;
  }, [data]);

  // ── CORRÉLATION HUMEUR / PERF ─────────────────────────────────────
  const moodPerfData = useMemo(() => {
    const moods = { "😊":[], "🙂":[], "😐":[], "😤":[], "😰":[] };
    Object.values(data).forEach(e => {
      if (e.mood && e.pnl != null && moods[e.mood]) moods[e.mood].push(e.pnl);
    });
    return Object.entries(moods).map(([mood, pnls]) => ({
      mood,
      avg: pnls.length ? pnls.reduce((a,b)=>a+b,0)/pnls.length : null,
      count: pnls.length,
      wr: pnls.length ? Math.round(pnls.filter(p=>p>0).length/pnls.length*100) : null,
    })).filter(x => x.count > 0);
  }, [data]);

  // ── SUIVI PAR SETUP ───────────────────────────────────────────────
  const setupStats = useMemo(() => {
    const s = {};
    Object.values(data).forEach(e => {
      if (!e.setup || e.pnl == null) return;
      if (!s[e.setup]) s[e.setup] = { pnl:0, trades:0, wins:0, losses:0, rrs:[] };
      s[e.setup].pnl += e.pnl;
      s[e.setup].trades++;
      if (e.pnl > 0) s[e.setup].wins++;
      else if (e.pnl < 0) s[e.setup].losses++;
      if (e.rr) s[e.setup].rrs.push(e.rr);
    });
    return Object.entries(s).map(([name, v]) => ({
      name,
      pnl: v.pnl,
      trades: v.trades,
      wr: Math.round(v.wins / v.trades * 100),
      avgRR: v.rrs.length ? v.rrs.reduce((a,b)=>a+b,0)/v.rrs.length : null,
      wins: v.wins, losses: v.losses,
    })).sort((a,b) => b.pnl - a.pnl);
  }, [data]);

  // ── VIOLATIONS RISK MANAGEMENT ────────────────────────────────────
  const riskViolations = useMemo(() => {
    const v = [];
    if (!riskRules.maxLossDay && !riskRules.maxLossPct && !riskRules.maxTrades && !riskRules.minRR) return v;
    for (let d = 1; d <= daysInMonth; d++) {
      const k = getKey(year, month, d);
      const e = data[k] || {};
      if (e.pnl == null) continue;
      const capBefore = dayStats[k]?.capitalBefore;
      // Max perte € / jour
      if (riskRules.maxLossDay && e.pnl < 0 && Math.abs(e.pnl) > riskRules.maxLossDay)
        v.push({ day: d, rule: "maxLossDay", msg: `Perte de ${Math.abs(e.pnl).toFixed(0)} € > limite ${riskRules.maxLossDay} €` });
      // Max perte % / jour
      if (riskRules.maxLossPct && e.pnl < 0 && capBefore) {
        const pct = Math.abs(e.pnl) / capBefore * 100;
        if (pct > riskRules.maxLossPct)
          v.push({ day: d, rule: "maxLossPct", msg: `Perte de ${pct.toFixed(1)}% > limite ${riskRules.maxLossPct}%` });
      }
      // Max trades / jour
      const tot = (e.wins||0)+(e.losses||0)+(e.be||0);
      if (riskRules.maxTrades && tot > riskRules.maxTrades)
        v.push({ day: d, rule: "maxTrades", msg: `${tot} trades > limite ${riskRules.maxTrades}` });
      // RR minimum
      if (riskRules.minRR && e.rr && e.rr < riskRules.minRR)
        v.push({ day: d, rule: "minRR", msg: `RR ${e.rr} < minimum ${riskRules.minRR}` });
    }
    return v;
  }, [data, riskRules, year, month, daysInMonth, dayStats]);

  // ── SIMULATION PROJECTION ─────────────────────────────────────────
  const projection = useMemo(() => {
    if (!allTimeStats || !capitalNum || allTimeStats.tradingDays < 5) return null;
    const avgDailyPnl = allTimeStats.totalPnl / allTimeStats.tradingDays;
    const tradingDaysPerMonth = 20;
    const months = [1, 3, 6, 12];
    return months.map(m => ({
      months: m,
      optimiste: capitalNum + avgDailyPnl * 1.2 * tradingDaysPerMonth * m,
      realiste: capitalNum + avgDailyPnl * tradingDaysPerMonth * m,
      pessimiste: capitalNum + avgDailyPnl * 0.7 * tradingDaysPerMonth * m,
    }));
  }, [allTimeStats, capitalNum]);


  // ── ALERTES ───────────────────────────────────────────────────────
  const alerts = useMemo(() => {
    const list = [];
    // Alerte objectif en danger : entre 50% et 85% de progression, mois en cours, >20j écoulés
    if (goalProgress && !goalProgress.done && goalProgress.pct >= 30 && goalProgress.pct < 85) {
      const daysLeft = daysInMonth - new Date().getDate();
      if (year === today.getFullYear() && month === today.getMonth() && daysLeft <= 10)
        list.push({ type:"goal", color:"#f59e0b", bg:"#fef3c7", bdr:"#fbbf24", icon:"⚠️", title:L.alertObjectif, desc:L.alertObjectifDesc(goalProgress.pct) });
    }
    // Alerte streak : streak ≥ 3, aujourd'hui pas encore rempli
    if (streak >= 3) {
      const todayEntry = data[todayKey];
      if (!todayEntry || todayEntry.pnl == null) {
        list.push({ type:"streak", color:"#ef4444", bg:"#fee2e2", bdr:"#fca5a5", icon:"🔥", title:L.alertStreak, desc:L.alertStreakDesc(streak) });
      }
    }
    // Violations risk management du jour
    if (riskViolations.length > 0) {
      const todayViol = riskViolations.filter(v => v.day === today.getDate() && year === today.getFullYear() && month === today.getMonth());
      if (todayViol.length > 0) {
        list.push({ type:"risk", color:"#7c3aed", bg:"#ede9fe", bdr:"#c4b5fd", icon:"⚠️", title:"Règle de risk dépassée", desc: todayViol.map(v=>v.msg).join(" · ") });
      }
    }
    return list;
  }, [goalProgress, streak, data, todayKey, daysInMonth, year, month, today, L, riskViolations]);

  const color = v => v >= 0 ? T.green : T.red;
  const lbl = { display:"block", fontSize:10, fontWeight:700, color:T.text3, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:5 };
  const iS = (x={}) => ({ width:"100%", border:`1px solid ${T.inputBdr}`, borderRadius:8, background:T.inputBg, fontSize:13, fontWeight:600, padding:"8px 10px", outline:"none", color:T.text, boxSizing:"border-box", ...x });

  // ── EXPORT CSV ────────────────────────────────────────────────────
  function exportCSV() {
    const acName = accounts.find(a=>a.id===activeAccount)?.name || "Chronicle";
    const rows = [];
    // Header
    rows.push(["Date","PnL (€)","% Capital","Capital avant","Gagnants","Perdants","BE","Win Rate","RR","Humeur","Plan respecté","Setup","Instrument","Note","Heure","Dépôt/Retrait"].join(";"));
    // Data — toutes les entrées triées par date
    const allKeys = [...new Set([...Object.keys(data), ...Object.keys(cashflows)])].sort();
    allKeys.forEach(k => {
      const e = data[k] || {};
      const cf = cashflows[k] || 0;
      // Skip days with nothing
      if (!e.pnl && e.pnl !== 0 && !cf) return;
      const [y,m,d] = k.split("-");
      const date = `${d}/${m}/${y}`;
      const capBefore = (() => {
        try {
          const allKeys2 = Object.keys(data).sort();
          const idx = allKeys2.indexOf(k);
          if (!capitalNum) return "";
          let cap = capitalNum;
          for (let i=0; i<idx; i++) {
            const ek = allKeys2[i];
            if (cashflows[ek]) cap += cashflows[ek];
            if (data[ek]?.pnl != null) cap += data[ek].pnl;
          }
          if (cashflows[k]) cap += cashflows[k];
          return cap.toFixed(2);
        } catch { return ""; }
      })();
      const total = (e.wins||0)+(e.losses||0)+(e.be||0);
      const wr = total>0?Math.round((e.wins||0)/total*100)+"%" :"";
      const pct = e.pnl!=null && capBefore ? ((e.pnl/parseFloat(capBefore))*100).toFixed(2)+"%" : "";
      rows.push([
        date,
        e.pnl!=null ? e.pnl.toFixed(2) : "",
        pct,
        capBefore,
        e.wins||"",
        e.losses||"",
        e.be||"",
        wr,
        e.rr||"",
        e.mood||"",
        e.plan||"",
        (e.setup||"").replace(/;/g,","),
        (e.instrument||"").replace(/;/g,","),
        (e.note||"").replace(/;/g,",").replace(/\n/g," "),
        e.hour||"",
        cf ? cf.toFixed(2) : "",
      ].join(";"));
    });
    const csv = "\uFEFF" + rows.join("\n"); // BOM pour Excel FR
    // data URI — compatible CodeSandbox + tous navigateurs
    const encoded = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = `${acName.replace(/\s+/g,"_")}_${year}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── EXPORT PDF ────────────────────────────────────────────────────
  function exportPDF() {
    const ms = monthlyStats;
    const fmtKey = k => { const [y,m,d]=k.split("-"); return `${parseInt(d)} ${MONTHS[parseInt(m)-1].slice(0,3)} ${y}`; };
    const cellBg = pct => pct===null?"#f8f9fb":pct>=0?`rgba(16,185,90,${0.07+Math.min(Math.abs(pct)/4,1)*0.2})`:`rgba(239,68,68,${0.07+Math.min(Math.abs(pct)/4,1)*0.2})`;
    const cellBd = pct => pct===null?"#e8ecf2":pct>=0?`rgba(16,185,90,${0.3+Math.min(Math.abs(pct)/4,1)*0.5})`:`rgba(239,68,68,${0.3+Math.min(Math.abs(pct)/4,1)*0.5})`;

    // Build calendar HTML
    const calRows = rows.map(row => {
      const cells = row.map((day, di) => {
        if (!day) {
          if (di === firstDay - 1) return `<td style="border:1px dashed #93c5fd;border-radius:6px;background:#eff6ff;padding:6px;text-align:center;font-size:9px;color:#1d4ed8;min-width:70px;min-height:60px;vertical-align:top">${capitalNum ? `<div style="font-weight:800">${capitalNum.toLocaleString('fr-FR')} €</div>` : '💰'}</td>`;
          return '<td></td>';
        }
        const k = getKey(year, month, day);
        const s = dayStats[k] || {};
        const e = data[k] || {};
        const pct = s.pct;
        const pnl = s.pnl;
        const isToday = k === todayKey;
        return `<td style="border:1.5px solid ${isToday?'#6366f1':cellBd(pct)};border-radius:6px;background:${cellBg(pct)};padding:6px;vertical-align:top;min-width:70px;min-height:60px">
          <div style="font-size:9px;color:${isToday?'#6366f1':'#9ca3af'};font-weight:${isToday?700:500};margin-bottom:3px">${day}</div>
          ${pct!==null?`<div style="font-size:12px;font-weight:800;color:${pct>=0?'#16a34a':'#dc2626'};text-align:center">${pct>=0?'+':''}${pct.toFixed(2)}%</div>`:''}
          ${pnl!==null?`<div style="font-size:9px;font-weight:700;color:${pnl>=0?'#1d4ed8':'#dc2626'};text-align:center;margin-top:2px">${pnl>=0?'+':'−'}${Math.abs(pnl).toFixed(0)} €</div>`:''}
          ${e.mood?`<div style="text-align:center;font-size:11px;margin-top:2px">${e.mood}</div>`:''}
        </td>`;
      });
      const ws = weeklyStats[rows.indexOf(row)];
      cells.push(`<td style="border:1px solid #e8ecf2;border-radius:6px;background:${ws.pct!==null?cellBg(ws.pct):'#f8f9fb'};padding:4px;text-align:center;font-size:9px;min-width:52px">
        ${ws.pct!==null?`<div style="font-weight:800;color:${ws.pct>=0?'#16a34a':'#dc2626'}">${ws.pct>=0?'+':''}${ws.pct.toFixed(1)}%</div>`:''}
        ${ws.pnl!==null?`<div style="color:${ws.pnl>=0?'#1d4ed8':'#dc2626'}">${ws.pnl>=0?'+':'−'}${Math.abs(ws.pnl).toFixed(0)}€</div>`:''}
      </td>`);
      return `<tr>${cells.join('')}</tr>`;
    }).join('');

    // Stats HTML
    const statsHtml = monthlyTrades.total > 0 ? `
      <div style="display:flex;gap:12px;margin-top:16px;padding:12px;background:#f8f9fb;border-radius:8px">
        ${[
          ['Total trades', monthlyTrades.total, '#374151'],
          ['✅ Gagnants', monthlyTrades.wins, '#16a34a'],
          ['❌ Perdants', monthlyTrades.losses, '#dc2626'],
          ['Win Rate', monthlyTrades.wr!==null?`${monthlyTrades.wr}%`:'—', monthlyTrades.wr>=50?'#16a34a':'#dc2626'],
          ['RR Moyen', monthlyTrades.avgRR!==null?`${monthlyTrades.avgRR}R`:'—', '#6366f1'],
        ].map(([label, val, col]) => `<div style="flex:1;text-align:center"><div style="font-size:9px;color:#9ca3af;margin-bottom:3px">${label}</div><div style="font-size:16px;font-weight:800;color:${col}">${val}</div></div>`).join('<div style="width:1px;background:#e5e7eb"></div>')}
      </div>` : '';

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Chronicle — ${MONTHS[month]} ${year}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1d2e; background: white; }
  table { border-collapse: separate; border-spacing: 3px; width: 100%; }
</style></head>
<body>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #f3f4f6">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#10b95a,#0ea5e9);display:flex;align-items:center;justify-content:center;font-size:16px">📈</div>
      <div>
        <div style="font-size:18px;font-weight:800;letter-spacing:-0.03em">Chronicle</div>
        <div style="font-size:9px;color:#9ca3af;letter-spacing:0.1em;text-transform:uppercase">Trading Journal</div>
      </div>
    </div>
    <div style="text-align:right">
      <div style="font-size:18px;font-weight:800">${MONTHS[month]} ${year}</div>
      <div style="font-size:11px;color:#9ca3af">Exporté le ${new Date().toLocaleDateString('fr-FR')}</div>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      ${ms.pct!==null?`<div style="padding:6px 12px;border-radius:8px;background:${ms.pct>=0?'#dcfce7':'#fee2e2'};border:1px solid ${ms.pct>=0?'#86efac':'#fca5a5'}"><span style="font-size:9px;color:#9ca3af">MOIS </span><span style="font-size:14px;font-weight:800;color:${ms.pct>=0?'#16a34a':'#dc2626'}">${ms.pct>=0?'+':''}${ms.pct.toFixed(2)}%</span></div>`:''}
      ${ms.pnl!==null?`<div style="padding:6px 12px;border-radius:8px;background:${ms.pnl>=0?'#dbeafe':'#fee2e2'};border:1px solid ${ms.pnl>=0?'#93c5fd':'#fca5a5'}"><span style="font-size:14px;font-weight:800;color:${ms.pnl>=0?'#1d4ed8':'#dc2626'}">${ms.pnl>=0?'+':'−'}${Math.abs(ms.pnl).toLocaleString('fr-FR',{minimumFractionDigits:2})} €</span></div>`:''}
      ${capitalNum?`<div style="padding:6px 12px;border-radius:8px;background:#f8f9fb;border:1px solid #e8ecf2"><span style="font-size:9px;color:#9ca3af">Capital </span><span style="font-size:12px;font-weight:700;color:#374151">${capitalNum.toLocaleString('fr-FR')} €</span></div>`:''}
    </div>
  </div>

  <table>
    <thead><tr>
      ${DAYS.map(d=>`<th style="text-align:center;font-size:9px;color:#9ca3af;letter-spacing:0.08em;text-transform:uppercase;padding-bottom:6px">${d}</th>`).join('')}
      <th style="text-align:center;font-size:9px;color:#c4c9d4;padding-bottom:6px">SEM.</th>
    </tr></thead>
    <tbody>${calRows}</tbody>
  </table>
  ${statsHtml}

  ${allTimeStats && allTimeStats.tradingDays > 0 ? `
  <div style="margin-top:16px;padding:12px 16px;background:#f8f9fb;border-radius:8px;border:1px solid #e8ecf2">
    <div style="font-size:9px;font-weight:700;color:#9ca3af;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px">📊 Stats All Time</div>
    <div style="display:flex;gap:12px">
      ${[
        ['PnL Total', allTimeStats.totalPnl>=0?`+${allTimeStats.totalPnl.toFixed(0)} €`:`−${Math.abs(allTimeStats.totalPnl).toFixed(0)} €`, allTimeStats.totalPnl>=0?'#16a34a':'#dc2626'],
        ['Jours tradés', allTimeStats.tradingDays, '#374151'],
        ['Win Rate', allTimeStats.wr!==null?`${allTimeStats.wr.toFixed(1)}%`:'—', allTimeStats.wr>=50?'#16a34a':'#dc2626'],
        ['Espérance', allTimeStats.esperance!==null?`${allTimeStats.esperance.toFixed(2)}R`:'—', allTimeStats.esperance>=0?'#16a34a':'#dc2626'],
        ['Mois verts', `${allTimeStats.greenMonths}/${allTimeStats.totalMonths}`, '#16a34a'],
        ['Max DD', allTimeStats.maxDD>0?`-${allTimeStats.maxDDPct.toFixed(1)}%`:'0%', allTimeStats.maxDD>0?'#dc2626':'#16a34a'],
      ].map(([label, val, col]) => `<div style="flex:1;text-align:center"><div style="font-size:8px;color:#9ca3af;margin-bottom:2px">${label}</div><div style="font-size:14px;font-weight:800;color:${col}">${val}</div></div>`).join('<div style="width:1px;background:#e5e7eb"></div>')}
    </div>
  </div>` : ''}

  <div style="margin-top:10px;text-align:center;font-size:8px;color:#d1d5db">Généré par Chronicle · Trading Journal · ${new Date().toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
</body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 400);
  }

  // ── RENDER ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:T.fontMono, padding:M?8:24, transition:"background 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        *{font-family:'DM Mono','Courier New',monospace}
        body{background:${T.bg}!important}
        .dc{transition:transform .12s,box-shadow .12s}
        .dc:hover{transform:scale(1.03);box-shadow:0 6px 20px rgba(0,0,0,.2)!important;z-index:5}
        .dc:hover .note-tip{opacity:1!important}
        .nb:hover{background:${T.dark?"#1a1a1a":"#E8E0D0"}!important}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
        .mp:hover{background:${T.dark?"#141414":"#EDE5D8"}!important}
        .bc{transition:transform .15s,box-shadow .15s}
        .bc:hover{transform:scale(1.04);box-shadow:0 6px 20px rgba(0,0,0,.2)}
        textarea{color:${T.text}!important;background:${T.inputBg}!important}
        ::placeholder{color:${T.text3}!important;opacity:0.6}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        .pills-scroll{display:flex;gap:4px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px}
        .pills-scroll::-webkit-scrollbar{display:none}
        ::selection{background:rgba(201,168,76,0.25);color:${T.text}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.3);border-radius:2px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(201,168,76,0.6)}
        @media(max-width:640px){
          .grid-kpi{grid-template-columns:repeat(2,1fr)!important}
          .week-col{display:none!important}
          .hide-mobile{display:none!important}
          .cal-day{min-height:52px!important;padding:4px 3px!important;border-radius:8px!important}
          .cal-day-num{font-size:9px!important}
          .cal-day-pct{font-size:11px!important}
          .annual-grid{grid-template-columns:repeat(6,1fr)!important}
          .modal-sheet{border-radius:20px 20px 0 0!important;max-height:92vh!important}
        }
      `}</style>

      {/* HEADER */}
      <div style={{ maxWidth:960, margin:`0 auto ${M?8:20}px`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:M?6:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, border:`1px solid ${T.accentBdr}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:T.accent, fontFamily:T.fontMono, fontWeight:500, letterSpacing:"0.05em" }}>FI</div>
          <div>
            <div style={{ fontSize:M?17:22, fontWeight:300, color:T.text, letterSpacing:"-0.01em", fontFamily:T.fontSerif, fontStyle:"italic" }}>Chronicle</div>
            {!M && <div style={{ fontSize:9, color:T.accent, letterSpacing:"0.3em", textTransform:"uppercase", marginTop:-2, fontFamily:T.fontMono }}>Freedom Industries</div>}
          </div>
        </div>

        {/* ── DESKTOP HEADER ── */}
        {!M && (
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            {streak > 0 && (
              <div style={{ padding:"6px 14px", borderRadius:3, background:T.dark?"rgba(245,158,11,0.15)":"#fef3c7", border:`1px solid ${T.dark?"rgba(245,158,11,0.3)":"#fbbf24"}` }}>
                <span style={{ fontSize:14 }}>🔥</span>
                <span style={{ fontSize:14, fontWeight:800, color:"#f59e0b", marginLeft:5 }}>{streak} jour{streak>1?"s":""}</span>
                <span style={{ fontSize:10, color:"#b45309", marginLeft:4 }}>streak</span>
              </div>
            )}
            {yearlyStats.pct !== null && (
              <div style={{ padding:"6px 14px", borderRadius:3, background:yearlyStats.pct>=0?T.greenBg:T.redBg, border:`1px solid ${yearlyStats.pct>=0?T.greenBdr:T.redBdr}` }}>
                <span style={{ fontSize:11, color:T.text3, marginRight:5 }}>YTD %</span>
                <span style={{ fontSize:14, fontWeight:800, color:color(yearlyStats.pct) }}>{fmtPct(yearlyStats.pct)}</span>
              </div>
            )}
            {yearlyStats.pnl !== null && (
              <div style={{ padding:"6px 14px", borderRadius:3, background:yearlyStats.pnl>=0?T.blueBg:T.redBg, border:`1px solid ${yearlyStats.pnl>=0?T.blueBdr:T.redBdr}` }}>
                <span style={{ fontSize:11, color:T.text3, marginRight:5 }}>YTD €</span>
                <span style={{ fontSize:14, fontWeight:800, color:yearlyStats.pnl>=0?T.blue:T.red }}>{fmtMoney(yearlyStats.pnl)}</span>
              </div>
            )}
            <button onClick={()=>setDark(d=>!d)} style={{ background:T.btnBg, border:`1px solid ${T.border}`, borderRadius:3, padding:"7px 13px", cursor:"pointer", fontSize:18 }}>{dark?"☀️":"🌙"}</button>
            {/* ACCENT DROPDOWN */}
            <div style={{ position:"relative" }}>
              <button onClick={()=>{ setShowAccentPicker(p=>!p); setShowLangPicker(false); }}
                style={{ width:36, height:36, borderRadius:3, background:T.btnBg, border:`1px solid ${T.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" fill="none" stroke={T.text2} strokeWidth="1.5"/>
                  <circle cx="6.5" cy="11.5" r="1.5" fill="#C9A84C"/>
                  <circle cx="8.5" cy="7.5" r="1.5" fill="#10b981"/>
                  <circle cx="12" cy="6" r="1.5" fill="#3b82f6"/>
                  <circle cx="15.5" cy="7.5" r="1.5" fill="#e11d48"/>
                </svg>
              </button>
              {showAccentPicker && (
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:T.card, borderRadius:4, padding:"16px", boxShadow:"0 8px 40px rgba(0,0,0,.6)", border:`1px solid ${T.border}`, zIndex:500, display:"flex", flexDirection:"column", gap:10, minWidth:160 }}>
                  <div style={{ fontSize:8, fontWeight:500, color:T.accent, textTransform:"uppercase", letterSpacing:"0.3em", fontFamily:T.fontMono }}>Accent</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {Object.entries(ACCENT_COLORS).map(([key, a]) => (
                      <button key={key} onClick={()=>{ setAccent(key); setShowAccentPicker(false); }} title={a.name}
                        style={{ width:26, height:26, borderRadius:"50%", background:a.hex, border:accent===key?`2px solid ${T.text}`:"2px solid transparent", cursor:"pointer", outline:"none", transition:"transform .15s", transform:accent===key?"scale(1.2)":"scale(1)" }} />
                    ))}
                  </div>
                  <div style={{ fontSize:9, color:T.accent, fontFamily:T.fontMono, letterSpacing:"0.15em" }}>{ACCENT_COLORS[accent]?.name}</div>
                </div>
              )}
            </div>
            {/* LANGUE DROPDOWN */}
            <div style={{ position:"relative" }}>
              <button onClick={()=>{ setShowLangPicker(p=>!p); setShowAccentPicker(false); }}
                style={{ background:T.btnBg, border:`1px solid ${T.border}`, borderRadius:3, padding:"7px 11px", cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:16, lineHeight:1 }}>{lang==="fr"?"🇫🇷":lang==="en"?"🇬🇧":"🇪🇸"}</span>
                <span style={{ fontSize:11, color:T.text, fontFamily:T.fontMono, fontWeight:500 }}>{lang.toUpperCase()}</span>
                <span style={{ fontSize:8, color:T.text2 }}>▾</span>
              </button>
              {showLangPicker && (
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:T.card, borderRadius:4, padding:"8px", boxShadow:"0 8px 40px rgba(0,0,0,.7)", border:`1px solid ${T.border}`, zIndex:500, display:"flex", flexDirection:"column", gap:4, minWidth:130 }}>
                  {[["fr","🇫🇷","Français"],["en","🇬🇧","English"],["es","🇪🇸","Español"]].map(([l,flag,label]) => (
                    <button key={l} onClick={()=>{ setLang(l); setShowLangPicker(false); }}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:3, border:"none", cursor:"pointer", background:lang===l?T.accentBg:T.btnBg, fontWeight:lang===l?600:400, color:lang===l?T.accent:T.text, fontSize:13, textAlign:"left", fontFamily:T.fontMono, letterSpacing:"0.05em" }}>
                      <span style={{ fontSize:18 }}>{flag}</span> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={()=>setShowNotifPanel(p=>!p)} style={{ background:notifEnabled?"linear-gradient(135deg,#f59e0b,#f97316)":T.btnBg, border:`1px solid ${notifEnabled?"#f97316":T.border}`, borderRadius:3, padding:"7px 13px", cursor:"pointer", fontSize:16 }}>🔔</button>
            <button onClick={()=>setShowRiskPanel(p=>!p)} title="Risk Management" style={{ background:riskViolations.length>0?"linear-gradient(135deg,#7c3aed,#9333ea)":T.btnBg, border:`1px solid ${riskViolations.length>0?"#7c3aed":T.border}`, borderRadius:3, padding:"7px 13px", cursor:"pointer", fontSize:16, position:"relative" }}>
              ⚠️{riskViolations.length>0&&<span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"#fff", fontSize:9, fontWeight:800, borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center" }}>{riskViolations.length}</span>}
            </button>
            {/* COMPTE ACTIF */}
            <button onClick={()=>setShowAccountPanel(p=>!p)} style={{ display:"flex", alignItems:"center", gap:6, background:T.btnBg, border:`1px solid ${T.border}`, borderRadius:3, padding:"6px 12px", cursor:"pointer" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:accounts.find(a=>a.id===activeAccount)?.color||T.accent, flexShrink:0 }} />
              <span style={{ fontSize:12, fontWeight:700, color:T.text2, maxWidth:90, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {accounts.find(a=>a.id===activeAccount)?.name||"Compte"}
              </span>
              <span style={{ fontSize:9, color:T.text3 }}>▾</span>
            </button>
            <button onClick={()=>setShowImportPanel(true)} style={{ background:T.btnBg, border:`1px solid ${T.accentBdr}`, borderRadius:3, padding:"7px 13px", cursor:"pointer", fontSize:12, fontWeight:700, color:T.accent, display:"flex", alignItems:"center", gap:5, fontFamily:T.fontMono, letterSpacing:"0.05em" }}>⬆ Import</button>
            <button onClick={exportCSV} style={{ background:T.btnBg, border:`1px solid ${T.border}`, borderRadius:3, padding:"7px 13px", cursor:"pointer", fontSize:12, fontWeight:700, color:T.text2, display:"flex", alignItems:"center", gap:5 }}>📊 CSV</button>
            <button onClick={exportPDF} style={{ background:"linear-gradient(135deg,#10b95a,#0ea5e9)", border:"none", borderRadius:3, padding:"7px 13px", cursor:"pointer", fontSize:12, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", gap:5 }}>🖨️ PDF</button>
            <button className="nb" onClick={()=>setYear(y=>y-1)} style={{ background:T.btnBg, border:"none", borderRadius:8, padding:"7px 13px", cursor:"pointer", fontSize:16, color:T.btnText }}>‹</button>
            <span style={{ fontSize:15, fontWeight:700, color:T.text2, minWidth:40, textAlign:"center" }}>{year}</span>
            <button className="nb" onClick={()=>setYear(y=>y+1)} style={{ background:T.btnBg, border:"none", borderRadius:8, padding:"7px 13px", cursor:"pointer", fontSize:16, color:T.btnText }}>›</button>
          </div>
        )}

        {/* ── MOBILE HEADER ── */}
        {M && (
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            {streak > 0 && (
              <div style={{ padding:"5px 10px", borderRadius:3, background:T.dark?"rgba(245,158,11,0.15)":"#fef3c7", border:`1px solid ${T.dark?"rgba(245,158,11,0.3)":"#fbbf24"}`, display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ fontSize:13 }}>🔥</span>
                <span style={{ fontSize:13, fontWeight:800, color:"#f59e0b" }}>{streak}j</span>
              </div>
            )}
            {yearlyStats.pct !== null && (
              <div style={{ padding:"5px 10px", borderRadius:3, background:yearlyStats.pct>=0?T.greenBg:T.redBg, border:`1px solid ${yearlyStats.pct>=0?T.greenBdr:T.redBdr}` }}>
                <span style={{ fontSize:12, fontWeight:800, color:color(yearlyStats.pct) }}>{fmtPct(yearlyStats.pct,1)}</span>
              </div>
            )}
            <button onClick={()=>setDark(d=>!d)} style={{ background:T.btnBg, border:`1px solid ${T.border}`, borderRadius:9, padding:"6px 10px", cursor:"pointer", fontSize:16 }}>{dark?"☀️":"🌙"}</button>
            <button onClick={()=>setShowMobileMenu(v=>!v)} style={{ background:T.btnBg, border:`1px solid ${T.border}`, borderRadius:9, padding:"6px 11px", cursor:"pointer", fontSize:18, color:T.text2, fontWeight:700 }}>☰</button>
          </div>
        )}
      </div>

      {/* ── MOBILE MENU DRAWER ── */}
      {M && showMobileMenu && (
        <div style={{ position:"fixed", inset:0, zIndex:3000, background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)" }} onClick={()=>setShowMobileMenu(false)}>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:T.card, borderRadius:"20px 20px 0 0", padding:"20px 16px 32px", animation:"slideUp .25s ease" }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:36, height:4, borderRadius:2, background:T.border, margin:"0 auto 20px" }} />
            {/* Année */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, padding:"10px 14px", background:T.card2, borderRadius:3 }}>
              <span style={{ fontSize:13, fontWeight:700, color:T.text2 }}>Année</span>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={()=>setYear(y=>y-1)} style={{ background:T.btnBg, border:"none", borderRadius:8, padding:"5px 12px", cursor:"pointer", fontSize:18, color:T.btnText }}>‹</button>
                <span style={{ fontSize:16, fontWeight:800, color:T.text, minWidth:44, textAlign:"center" }}>{year}</span>
                <button onClick={()=>setYear(y=>y+1)} style={{ background:T.btnBg, border:"none", borderRadius:8, padding:"5px 12px", cursor:"pointer", fontSize:18, color:T.btnText }}>›</button>
              </div>
            </div>
            {/* Langue */}
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {["fr","en","es"].map(l => (
                <button key={l} onClick={()=>{ setLang(l); setShowMobileMenu(false); }} style={{ flex:1, padding:"12px", border:`1px solid ${lang===l?T.accent:T.border}`, borderRadius:3, cursor:"pointer", fontSize:22, background:lang===l?T.accentBg:T.btnBg }}>
                  {l==="fr"?"🇫🇷":l==="en"?"🇬🇧":"🇪🇸"}
                </button>
              ))}
            </div>
            {/* Couleurs accent */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>🎨 Couleur</div>
              <div style={{ display:"flex", gap:10, justifyContent:"space-between" }}>
                {Object.entries(ACCENT_COLORS).map(([key, a]) => (
                  <button key={key} onClick={()=>setAccent(key)} title={a.name}
                    style={{ flex:1, height:32, borderRadius:8, background:a.hex, border:accent===key?`3px solid ${T.text}`:"3px solid transparent", cursor:"pointer", outline:"none" }} />
                ))}
              </div>
            </div>
            {/* Comptes */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>🌍 Comptes</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {accounts.map(ac => (
                  <button key={ac.id} onClick={()=>switchAccount(ac.id)}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px", borderRadius:3, border:`1.5px solid ${activeAccount===ac.id?T.accent:T.border}`, background:activeAccount===ac.id?T.accentBg:"transparent", cursor:"pointer" }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:ac.color, flexShrink:0 }} />
                    <span style={{ fontSize:13, fontWeight:activeAccount===ac.id?700:500, color:activeAccount===ac.id?T.accent:T.text2, flex:1, textAlign:"left" }}>{ac.name}</span>
                    {activeAccount===ac.id && <span style={{ fontSize:10, color:T.accent }}>✓</span>}
                  </button>
                ))}
                <button onClick={()=>{ setShowMobileMenu(false); setShowAccountPanel(true); setEditingAccount("new"); setInputAccountName(""); }}
                  style={{ padding:"9px 12px", borderRadius:3, border:`1px dashed ${T.border}`, background:T.btnBg, cursor:"pointer", fontSize:12, color:T.text3, fontWeight:600 }}>
                  + Nouveau compte
                </button>
              </div>
            </div>
            {/* Actions */}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>{ setShowNotifPanel(true); setShowMobileMenu(false); }} style={{ flex:1, padding:"13px", borderRadius:3, background:notifEnabled?T.accentGrad:T.card2, border:`1px solid ${T.border}`, cursor:"pointer", fontSize:13, fontWeight:700, color:notifEnabled?"#fff":T.text2 }}>🔔 Rappels</button>
              <button onClick={()=>{ setShowImportPanel(true); setShowMobileMenu(false); }} style={{ flex:1, padding:"13px", borderRadius:3, background:T.card2, border:`1px solid ${T.accentBdr}`, cursor:"pointer", fontSize:13, fontWeight:700, color:T.accent }}>⬆ Import</button>
              <button onClick={()=>{ exportCSV(); setShowMobileMenu(false); }} style={{ flex:1, padding:"13px", borderRadius:3, background:T.card2, border:`1px solid ${T.border}`, cursor:"pointer", fontSize:13, fontWeight:700, color:T.text2 }}>📊 CSV</button>
              <button onClick={()=>{ exportPDF(); setShowMobileMenu(false); }} style={{ flex:1, padding:"13px", borderRadius:3, background:"linear-gradient(135deg,#10b95a,#0ea5e9)", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, color:"#fff" }}>🖨️ PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV TABS */}
      <div style={{ maxWidth:960, margin:`0 auto ${M?8:16}px`, display:"flex", gap:0, background:T.card, borderRadius:0, padding:"0 4px", borderBottom:`1px solid ${T.border}` }}>
        {[
          { id:"journal", icon:"📅", label:L.journal },
          { id:"dashboard", icon:"🏠", label:L.dashboard },
          { id:"compare", icon:"⚖️", label:L.compare },
        ].map(tab => (
          <button key={tab.id} onClick={()=>setView(tab.id)} style={{ flex:1, padding:M?"10px 4px":"10px 12px", borderRadius:2, border:"none", borderBottom:view===tab.id?`1px solid ${T.accent}`:"1px solid transparent", cursor:"pointer", fontSize:M?10:11, fontWeight:500, letterSpacing:"0.15em", textTransform:"uppercase", background:"transparent", color:view===tab.id?T.accent:T.text3, display:"flex", alignItems:"center", justifyContent:"center", gap:M?3:6, transition:"all .2s", fontFamily:T.fontMono }}>
            <span style={{ fontSize:M?16:13 }}>{tab.icon}</span>
            {M ? null : tab.label}
          </button>
        ))}
      </div>

      {/* BADGE TOAST */}
      {badgeAnim && (()=>{
        const b = badges.find(x=>x.id===badgeAnim);
        if (!b) return null;
        return (
          <div style={{ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)", zIndex:9999, animation:"badgeIn .4s cubic-bezier(.34,1.56,.64,1)" }}>
            <style>{`@keyframes badgeIn{from{opacity:0;transform:translateX(-50%) scale(.5) translateY(-20px)}to{opacity:1;transform:translateX(-50%) scale(1) translateY(0)}}`}</style>
            <div style={{ background:dark?"#1e2436":"#fff", borderRadius:4, padding:"16px 28px", boxShadow:"0 8px 40px rgba(0,0,0,.3)", border:`2px solid ${b.col}`, display:"flex", alignItems:"center", gap:14, minWidth:280 }}>
              <div style={{ fontSize:42, filter:"drop-shadow(0 2px 8px rgba(0,0,0,.2))", animation:"spin .6s ease" }}>{b.icon}</div>
              <div>
                <div style={{ fontSize:11, color:b.col, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" }}>🏅 Badge débloqué !</div>
                <div style={{ fontSize:18, fontWeight:800, color:dark?"#e2e8f0":"#1a1d2e", marginTop:2 }}>{b.label}</div>
                <div style={{ fontSize:12, color:dark?"#64748b":"#9ca3af", marginTop:2 }}>{b.desc}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PANEL IMPORT CSV */}
      {showImportPanel && (
        <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.85)", backdropFilter:"blur(8px)", padding:M?8:24 }} onClick={()=>{ setShowImportPanel(false); setImportPreview(null); }}>
          <div style={{ background:T.card, border:`1px solid ${T.accentBdr}`, borderRadius:4, padding:M?"20px 16px":"32px", width:"100%", maxWidth:620, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.8)" }} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
              <div>
                <div style={{ fontSize:20, fontWeight:300, color:T.text, fontFamily:T.fontSerif, fontStyle:"italic", marginBottom:4 }}>Import de trades</div>
                <div style={{ fontSize:10, color:T.accent, fontFamily:T.fontMono, letterSpacing:"0.2em" }}>MT4 · MT5 · CTRADER · PDF · CSV</div>
              </div>
              <button onClick={()=>{ setShowImportPanel(false); setImportPreview(null); }} style={{ background:"none", border:"none", color:T.text3, cursor:"pointer", fontSize:20 }}>✕</button>
            </div>

            {!importPreview && !importLoading && (
              <>
                {/* Drop zone */}
                <label style={{ display:"block", border:`1px dashed ${T.accentBdr}`, borderRadius:3, padding:"40px 24px", textAlign:"center", cursor:"pointer", transition:"border-color .2s" }}
                  onDragOver={e=>{ e.preventDefault(); e.currentTarget.style.borderColor=T.accent; }}
                  onDragLeave={e=>{ e.currentTarget.style.borderColor=T.accentBdr; }}
                  onDrop={e=>{ e.preventDefault(); e.currentTarget.style.borderColor=T.accentBdr; const f=e.dataTransfer.files[0]; if(f) handleImportFile({target:{files:e.dataTransfer.files, value:""}}); }}>
                  <input type="file" accept=".csv,.txt,.htm,.html,.pdf" onChange={handleImportFile} style={{ display:"none" }} />
                  <div style={{ fontSize:32, marginBottom:12 }}>⬆</div>
                  <div style={{ fontSize:14, color:T.text, marginBottom:6, fontFamily:T.fontMono }}>Glisse ton fichier ou clique pour choisir</div>
                  <div style={{ fontSize:11, color:T.text3, fontFamily:T.fontMono }}>Formats acceptés : .htm · .html · .pdf · .csv · .txt</div>
                </label>

                {/* Tutos par broker */}
                <div style={{ marginTop:20 }}>
                  <div style={{ fontSize:9, color:T.accent, fontFamily:T.fontMono, letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:12 }}>Comment exporter depuis ton broker</div>
                  {[
                    {
                      name:"MetaTrader 5",
                      tag:"MT5",
                      steps:[
                        "Ouvre MT5 → onglet Historique (en bas)",
                        "Clic droit dans la liste des trades",
                        "Rapport → Complet (ou Détaillé)",
                        "Dans le rapport : Fichier → Enregistrer sous",
                        "Choisir le format CSV → Importer ici",
                      ]
                    },
                    {
                      name:"MetaTrader 4",
                      tag:"MT4",
                      steps:[
                        "Ouvre MT4 → onglet Compte (en bas)",
                        "Clic droit → Rapport → Rapport détaillé",
                        "Clic droit sur le rapport → Enregistrer en tant que rapport détaillé",
                        "Sélectionner format CSV → Importer ici",
                      ]
                    },
                    {
                      name:"cTrader",
                      tag:"cTrader",
                      steps:[
                        "Ouvre cTrader → Historique",
                        "Filtre la période souhaitée",
                        "Clique sur l'icône Export (flèche vers le bas)",
                        "Choisir CSV → Importer ici",
                      ]
                    },
                    {
                      name:"App mobile — Relevé PDF",
                      tag:"PDF",
                      steps:[
                        "Ouvre l'app mobile de ton broker",
                        "Va dans Historique ou Transactions",
                        "Exporte / Télécharge le relevé en PDF",
                        "Ouvre Chronicle sur mobile → Import → glisse le PDF",
                        "Chronicle lit automatiquement les trades du PDF",
                        "⚠ Si le résultat est incorrect, contacte le support — chaque broker a son format",
                      ]
                    },
                    {
                      name:"Autre broker / CSV maison",
                      tag:"Générique",
                      steps:[
                        "Ton fichier doit avoir au minimum : Date + PnL",
                        "Colonnes reconnues : Date, Profit, Gain, P&L, Result",
                        "Séparateur : virgule ou point-virgule",
                        "Format date : DD/MM/YYYY ou YYYY-MM-DD",
                      ]
                    },
                  ].map((broker, bi) => {
                    const [open, setOpen] = [false, ()=>{}]; // static display
                    return (
                      <details key={broker.tag} style={{ marginBottom:6 }}>
                        <summary style={{ padding:"10px 14px", background:T.card2, border:`1px solid ${T.border}`, borderRadius:3, cursor:"pointer", display:"flex", alignItems:"center", gap:10, listStyle:"none", userSelect:"none" }}>
                          <span style={{ fontSize:9, color:T.accent, fontFamily:T.fontMono, letterSpacing:"0.2em", border:`1px solid ${T.accentBdr}`, padding:"2px 8px" }}>{broker.tag}</span>
                          <span style={{ fontSize:12, color:T.text, fontFamily:T.fontMono }}>{broker.name}</span>
                          <span style={{ marginLeft:"auto", fontSize:10, color:T.text3 }}>▾</span>
                        </summary>
                        <div style={{ padding:"12px 14px", background:T.card2, borderTop:`1px solid ${T.border}`, border:`1px solid ${T.border}`, borderTop:"none", borderRadius:"0 0 3px 3px" }}>
                          {broker.steps.map((step, si) => (
                            <div key={si} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:si<broker.steps.length-1?8:0 }}>
                              <span style={{ fontSize:9, color:T.accent, fontFamily:T.fontMono, minWidth:18, marginTop:1, fontWeight:600 }}>{si+1}.</span>
                              <span style={{ fontSize:11, color:T.text3, lineHeight:1.6 }}>{step}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </>
            )}

            {importLoading && (
              <div style={{ textAlign:"center", padding:"48px 0" }}>
                <div style={{ fontSize:28, animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</div>
                <div style={{ fontSize:12, color:T.text3, marginTop:12, fontFamily:T.fontMono, letterSpacing:"0.1em" }}>Analyse du fichier…</div>
              </div>
            )}

            {importPreview && !importLoading && (
              <>
                {/* Warnings */}
                {importPreview.warnings?.map((w,i) => (
                  <div key={i} style={{ background:"rgba(201,168,76,0.08)", border:`1px solid ${T.accentBdr}`, borderRadius:3, padding:"8px 12px", marginBottom:8, fontSize:11, color:T.accent, fontFamily:T.fontMono }}>
                    ⚠ {w}
                  </div>
                ))}

                {/* Résumé */}
                {importPreview.rows.length > 0 && (
                  <>
                    <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap" }}>
                      <div style={{ fontSize:11, color:T.text3, fontFamily:T.fontMono }}>
                        Format détecté : <span style={{ color:T.accent }}>{importPreview.format?.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize:11, color:T.text3, fontFamily:T.fontMono }}>
                        {importPreview.totalTrades} trades → <span style={{ color:T.accent }}>{importPreview.rows.length} journées</span>
                      </div>
                      <div style={{ fontSize:11, fontFamily:T.fontMono, color:importPreview.rows.filter(r=>r.existing).length>0?T.red:T.green }}>
                        {importPreview.rows.filter(r=>r.existing).length} jours déjà existants
                      </div>
                    </div>

                    {/* Aperçu table */}
                    <div style={{ maxHeight:280, overflowY:"auto", border:`1px solid ${T.border}`, borderRadius:3, marginBottom:20 }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, fontFamily:T.fontMono }}>
                        <thead>
                          <tr style={{ background:T.card2, position:"sticky", top:0 }}>
                            {["Date","PnL €","W","L","BE","Instrument","Statut"].map(h=>(
                              <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:9, color:T.accent, letterSpacing:"0.2em", textTransform:"uppercase", borderBottom:`1px solid ${T.border}`, fontWeight:500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {importPreview.rows.map((row,i) => (
                            <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, background:row.existing?"rgba(239,68,68,0.04)":"transparent" }}>
                              <td style={{ padding:"7px 10px", color:T.text2 }}>{row.date.split("-").reverse().join("/")}</td>
                              <td style={{ padding:"7px 10px", color:row.pnl>=0?T.green:T.red, fontWeight:600 }}>{row.pnl>=0?"+":""}{row.pnl.toFixed(2)}</td>
                              <td style={{ padding:"7px 10px", color:T.green }}>{row.wins}</td>
                              <td style={{ padding:"7px 10px", color:T.red }}>{row.losses}</td>
                              <td style={{ padding:"7px 10px", color:T.text3 }}>{row.be}</td>
                              <td style={{ padding:"7px 10px", color:T.text3, maxWidth:100, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.instrument||"—"}</td>
                              <td style={{ padding:"7px 10px" }}>
                                <span style={{ fontSize:9, padding:"2px 6px", borderRadius:2, background:row.existing?"rgba(239,68,68,0.12)":"rgba(16,185,129,0.12)", color:row.existing?T.red:T.green }}>
                                  {row.existing?"Existe":"Nouveau"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Actions */}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      <button onClick={()=>confirmImport("merge")}
                        style={{ flex:1, padding:"13px", background:T.accentGrad, border:"none", borderRadius:3, color:"#000", fontFamily:T.fontMono, fontSize:11, letterSpacing:"0.15em", cursor:"pointer", fontWeight:600 }}>
                        FUSIONNER — Garder l'existant
                      </button>
                      <button onClick={()=>confirmImport("replace")}
                        style={{ flex:1, padding:"13px", background:T.card2, border:`1px solid ${T.border}`, borderRadius:3, color:T.text2, fontFamily:T.fontMono, fontSize:11, letterSpacing:"0.15em", cursor:"pointer" }}>
                        REMPLACER — Écraser l'existant
                      </button>
                    </div>
                    <button onClick={()=>setImportPreview(null)} style={{ width:"100%", marginTop:8, padding:"9px", background:"none", border:"none", color:T.text3, fontFamily:T.fontMono, fontSize:10, cursor:"pointer", letterSpacing:"0.1em" }}>
                      ← Choisir un autre fichier
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* PANEL COMPTES */}
      {showAccountPanel && (
        <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-start", justifyContent:"flex-end", padding:"70px 24px 0", background:"rgba(0,0,0,.7)", backdropFilter:"blur(8px)" }} onClick={()=>{ setShowAccountPanel(false); setEditingAccount(null); }}>
          <div style={{ background:T.card, borderRadius:4, padding:24, width:300, boxShadow:"0 16px 60px rgba(0,0,0,.3)", border:`1px solid ${T.border}`, maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:18, fontWeight:300, color:T.text, fontFamily:T.fontSerif, fontStyle:"italic" }}>Chronicle — Comptes</div>
              <button onClick={()=>setShowAccountPanel(false)} style={{ background:T.btnBg, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16, color:T.btnText }}>✕</button>
            </div>
            {/* Liste comptes */}
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              {accounts.map(ac => {
                // Calcul stats depuis localStorage de ce compte
                let acPnl = null, acWr = null, acDays = 0;
                try {
                  const acData = JSON.parse(localStorage.getItem(`chronicle_data_${ac.id}`) || "{}");
                  const entries = Object.values(acData).filter(e => e.pnl != null);
                  if (entries.length > 0) {
                    acPnl = entries.reduce((s, e) => s + e.pnl, 0);
                    acDays = entries.length;
                    const wins = entries.filter(e => e.pnl > 0).length;
                    acWr = Math.round(wins / entries.length * 100);
                  }
                } catch {}
                return (
                  <div key={ac.id} style={{ borderRadius:3, background:activeAccount===ac.id?T.accentBg:T.card2, border:`1.5px solid ${activeAccount===ac.id?T.accent:T.border}`, cursor:"pointer", overflow:"hidden" }}
                    onClick={()=>switchAccount(ac.id)}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px" }}>
                      <div style={{ width:12, height:12, borderRadius:"50%", background:ac.color, flexShrink:0 }} />
                      <span style={{ flex:1, fontSize:13, fontWeight:activeAccount===ac.id?700:500, color:activeAccount===ac.id?T.accent:T.text }}>{ac.name}</span>
                      {activeAccount===ac.id && <span style={{ fontSize:10, color:T.accent, fontWeight:700 }}>✓ Actif</span>}
                      {accounts.length>1&&<button onClick={e=>{e.stopPropagation();if(confirm(`Supprimer "${ac.name}" ?`))deleteAccount(ac.id);}} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:T.text3, padding:"2px 4px" }}>🗑</button>}
                      <button onClick={e=>{e.stopPropagation();setEditingAccount(ac.id);setInputAccountName(ac.name);setInputAccountColor(ac.color);}} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:T.text3, padding:"2px 4px" }}>✏️</button>
                    </div>
                    {acPnl !== null && (
                      <div style={{ display:"flex", gap:8, padding:"6px 12px 10px", borderTop:`1px solid ${activeAccount===ac.id?T.accentBdr:T.border}` }}>
                        <span style={{ fontSize:11, fontWeight:700, color:acPnl>=0?T.green:T.red, background:acPnl>=0?T.greenBg:T.redBg, padding:"2px 8px", borderRadius:6 }}>
                          {acPnl>=0?"+":"-"}{Math.abs(acPnl).toLocaleString("fr-FR",{maximumFractionDigits:0})} €
                        </span>
                        <span style={{ fontSize:11, color:T.text3 }}>{acWr}% WR</span>
                        <span style={{ fontSize:11, color:T.text3 }}>{acDays}j</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Formulaire nouveau / édition */}
            {editingAccount ? (
              <div style={{ padding:"14px", borderRadius:3, background:T.card2, border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", marginBottom:10 }}>
                  {editingAccount==="new"?"Nouveau compte":"Modifier"}
                </div>
                <input value={inputAccountName} onChange={e=>setInputAccountName(e.target.value)}
                  placeholder="Nom du compte" autoFocus
                  style={{ width:"100%", border:`1px solid ${T.inputBdr}`, borderRadius:8, background:T.inputBg, fontSize:13, fontWeight:600, padding:"8px 10px", outline:"none", color:T.text, boxSizing:"border-box", marginBottom:10 }} />
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:"uppercase", marginBottom:6 }}>Couleur</div>
                  <div style={{ display:"flex", gap:8 }}>
                    {["#6366f1","#10b981","#f59e0b","#ef4444","#0ea5e9","#ec4899"].map(col=>(
                      <button key={col} onClick={()=>setInputAccountColor(col)} style={{ width:28, height:28, borderRadius:"50%", background:col, border:inputAccountColor===col?"3px solid "+T.text:"3px solid transparent", cursor:"pointer", outline:"none" }} />
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={saveAccount} style={{ flex:1, padding:"10px", borderRadius:9, background:T.accentGrad, color:"#fff", fontWeight:700, fontSize:13, border:"none", cursor:"pointer" }}>
                    {editingAccount==="new"?"Créer":"Enregistrer"}
                  </button>
                  <button onClick={()=>{setEditingAccount(null);setInputAccountName("");}} style={{ padding:"10px 14px", borderRadius:9, background:T.card, border:`1px solid ${T.border}`, color:T.text2, fontWeight:600, fontSize:13, cursor:"pointer" }}>Annuler</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>{setEditingAccount("new");setInputAccountName("");setInputAccountColor("#6366f1");}}
                style={{ width:"100%", padding:"11px", borderRadius:3, background:T.card2, border:`1.5px dashed ${T.border}`, color:T.text3, fontWeight:700, fontSize:13, cursor:"pointer" }}>
                + Nouveau compte
              </button>
            )}
          </div>
        </div>
      )}

      {/* PANEL RISK MANAGEMENT */}
      {showRiskPanel && (
        <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-start", justifyContent:"flex-end", padding:"70px 24px 0", background:"rgba(0,0,0,.7)", backdropFilter:"blur(8px)" }} onClick={()=>setShowRiskPanel(false)}>
          <div style={{ background:T.card, borderRadius:4, padding:24, width:320, boxShadow:"0 16px 60px rgba(0,0,0,.3)", border:`1px solid ${T.border}`, maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:18, fontWeight:300, color:T.text, fontFamily:T.fontSerif, fontStyle:"italic" }}>⚠️ Risk Management</div>
              <button onClick={()=>setShowRiskPanel(false)} style={{ background:T.btnBg, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16, color:T.btnText }}>✕</button>
            </div>
            <p style={{ fontSize:11, color:T.text3, marginBottom:16, lineHeight:1.5 }}>Définis tes règles de gestion du risque. Une alerte s'affichera si une règle est dépassée.</p>
            {[
              { key:"maxLossDay", label:"Perte max / jour (€)", placeholder:"ex: 200", state:inputMaxLossDay, set:setInputMaxLossDay, icon:"💸" },
              { key:"maxLossPct", label:"Perte max / jour (%)", placeholder:"ex: 2", state:inputMaxLossPct, set:setInputMaxLossPct, icon:"📉" },
              { key:"maxTrades", label:"Trades max / jour", placeholder:"ex: 5", state:inputMaxTrades, set:setInputMaxTrades, icon:"🔢" },
              { key:"minRR", label:"RR minimum par trade", placeholder:"ex: 1.5", state:inputMinRR, set:setInputMinRR, icon:"⚖️" },
            ].map(({ key, label, placeholder, state, set, icon }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:10, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>
                  {icon} {label}
                </label>
                <div style={{ display:"flex", gap:6 }}>
                  <input type="number" step="0.1" value={state !== "" ? state : (riskRules[key] ?? "")}
                    onChange={e=>set(e.target.value)}
                    placeholder={placeholder}
                    style={{ flex:1, border:`1px solid ${T.inputBdr}`, borderRadius:8, background:T.inputBg, fontSize:13, fontWeight:600, padding:"8px 10px", outline:"none", color:T.text }} />
                  {riskRules[key] && <button onClick={()=>{ setRiskRules(r=>{const nr={...r};delete nr[key];return nr;}); set(""); }}
                    style={{ padding:"8px 10px", borderRadius:8, background:T.redBg, border:"none", color:T.red, cursor:"pointer", fontSize:13 }}>✕</button>}
                </div>
                {riskRules[key] && <div style={{ fontSize:10, color:T.green, marginTop:3 }}>✓ Actif : {riskRules[key]}{key.includes("Pct")?"%":key==="maxTrades"?" trades":key==="minRR"?"R":" €"}</div>}
              </div>
            ))}
            <button onClick={()=>{
              const nr = {...riskRules};
              if(inputMaxLossDay) nr.maxLossDay=parseFloat(inputMaxLossDay); else if(inputMaxLossDay==="") delete nr.maxLossDay;
              if(inputMaxLossPct) nr.maxLossPct=parseFloat(inputMaxLossPct); else if(inputMaxLossPct==="") delete nr.maxLossPct;
              if(inputMaxTrades) nr.maxTrades=parseInt(inputMaxTrades); else if(inputMaxTrades==="") delete nr.maxTrades;
              if(inputMinRR) nr.minRR=parseFloat(inputMinRR); else if(inputMinRR==="") delete nr.minRR;
              [inputMaxLossDay,inputMaxLossPct,inputMaxTrades,inputMinRR].forEach((v,i)=>{ if(v) [setInputMaxLossDay,setInputMaxLossPct,setInputMaxTrades,setInputMinRR][i](""); });
              setRiskRules(nr); setShowRiskPanel(false);
            }} style={{ width:"100%", padding:"12px", borderRadius:3, background:"linear-gradient(135deg,#7c3aed,#9333ea)", color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:"pointer", marginTop:4 }}>
              Enregistrer les règles
            </button>
            {/* Violations du mois */}
            {riskViolations.length > 0 && (
              <div style={{ marginTop:16, padding:"12px 14px", borderRadius:3, background:"rgba(124,58,237,0.08)", border:"1px solid rgba(124,58,237,0.2)" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#7c3aed", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>
                  🚨 {riskViolations.length} violation{riskViolations.length>1?"s":""} ce mois
                </div>
                {riskViolations.slice(0,5).map((v,i)=>(
                  <div key={i} style={{ fontSize:11, color:T.text2, marginBottom:4, display:"flex", gap:6 }}>
                    <span style={{ color:"#7c3aed", fontWeight:700 }}>Jour {v.day}</span> {v.msg}
                  </div>
                ))}
                {riskViolations.length>5&&<div style={{ fontSize:10, color:T.text3 }}>+{riskViolations.length-5} autres…</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PANEL NOTIFICATIONS */}
      {showNotifPanel && (
        <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-start", justifyContent:"flex-end", padding:"70px 24px 0", background:"rgba(0,0,0,.7)", backdropFilter:"blur(8px)" }} onClick={()=>setShowNotifPanel(false)}>
          <div style={{ background:T.card, borderRadius:4, padding:24, width:300, boxShadow:"0 16px 60px rgba(0,0,0,.3)", border:`1px solid ${T.border}` }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:18, fontWeight:300, color:T.text, fontFamily:T.fontSerif, fontStyle:"italic" }}>{L.notifTitle}</div>
              <button onClick={()=>setShowNotifPanel(false)} style={{ background:T.btnBg, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16, color:T.btnText }}>✕</button>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:10, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{L.notifHour}</label>
              <input type="time" value={notifTime} onChange={e=>setNotifTime(e.target.value)} style={{ width:"100%", border:`1px solid ${T.inputBdr}`, borderRadius:8, background:T.inputBg, fontSize:16, fontWeight:700, padding:"10px 12px", outline:"none", color:T.text, boxSizing:"border-box", textAlign:"center" }} />
            </div>
            {notifStatus==="granted" && <div style={{ padding:"8px 12px", borderRadius:8, background:T.greenBg, color:T.green, fontSize:12, fontWeight:600, marginBottom:12 }}>{L.notifGranted}</div>}
            {notifStatus==="denied" && <div style={{ padding:"8px 12px", borderRadius:8, background:T.redBg, color:T.red, fontSize:12, fontWeight:600, marginBottom:12 }}>{L.notifDenied}</div>}
            {!notifEnabled
              ? <button onClick={enableNotif} style={{ width:"100%", padding:"12px", borderRadius:3, background:"linear-gradient(135deg,#f59e0b,#f97316)", color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>{L.notifEnable}</button>
              : <button onClick={disableNotif} style={{ width:"100%", padding:"12px", borderRadius:3, background:T.redBg, color:T.red, fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>{L.notifDisable}</button>
            }
            <p style={{ fontSize:11, color:T.text3, marginTop:12, lineHeight:1.5 }}>Le rappel s'affiche si tu n'as pas encore saisi ta journée à l'heure choisie.</p>
          </div>
        </div>
      )}


      <div style={{ maxWidth:960, margin:"0 auto", display:"flex", flexDirection:"column", gap:M?8:16 }}>

        {/* ═══════════ VUE JOURNAL ═══════════ */}
        {view === "journal" && (<>

        {/* ALERTES */}
        {alerts.map((a,i) => (
          <div key={i} style={{ background:a.bg, borderRadius:4, padding:"14px 20px", border:`1px solid ${a.bdr}`, display:"flex", alignItems:"center", gap:14, boxShadow:T.shadow2 }}>
            <span style={{ fontSize:24 }}>{a.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:800, color:a.color }}>{a.title}</div>
              <div style={{ fontSize:11, color:a.color, marginTop:2, opacity:.85 }}>{a.desc}</div>
            </div>
          </div>
        ))}

        {/* ALL TIME PANEL */}
        {showAllTime && allTimeStats && (
          <div style={{ background:T.card, borderRadius:4, padding:24, boxShadow:T.shadow, border:`1px solid ${T.purple}40` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:300, color:T.text, fontFamily:T.fontSerif, fontStyle:"italic" }}>{L.allTimeStats}</div>
              {allTimeStats.firstDate && <div style={{ fontSize:11, color:T.text3 }}>{L.since} {allTimeStats.firstDate.split("-").reverse().join("/")}</div>}
            </div>

            {/* KPIs row 1 */}
            <div className="grid-kpi" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:M?8:12, marginBottom:14 }}>
              {[
                { icon:"💰", label:"PnL Total", value:allTimeStats.totalPnl>=0?`+${allTimeStats.totalPnl.toFixed(0)} €`:`−${Math.abs(allTimeStats.totalPnl).toFixed(0)} €`, col:allTimeStats.totalPnl>=0?T.green:T.red, bg:allTimeStats.totalPnl>=0?T.greenBg:T.redBg, bdr:allTimeStats.totalPnl>=0?T.greenBdr:T.redBdr },
                { icon:"📅", label:"Jours tradés", value:allTimeStats.tradingDays, col:T.text2, bg:T.card2, bdr:T.border },
                { icon:"✅", label:"Jours verts", value:`${allTimeStats.greenDays} / ${allTimeStats.tradingDays}`, col:T.green, bg:T.greenBg, bdr:T.greenBdr },
                { icon:"❌", label:"Jours rouges", value:`${allTimeStats.redDays} / ${allTimeStats.tradingDays}`, col:T.red, bg:T.redBg, bdr:T.redBdr },
              ].map((item,i) => (
                <div key={i} style={{ background:item.bg, borderRadius:3, padding:"14px 16px", border:`1px solid ${item.bdr}` }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{item.icon}</div>
                  <div style={{ fontSize:9, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>{item.label}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:item.col, fontFamily:"monospace" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* KPIs row 2 - trades */}
            {allTimeStats.totalTrades > 0 && (
              <div className="grid-kpi" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:M?8:12, marginBottom:14 }}>
                {[
                  { icon:"🎯", label:"Win Rate", value:`${allTimeStats.wr.toFixed(1)}%`, col:allTimeStats.wr>=50?T.green:T.red, bg:allTimeStats.wr>=50?T.greenBg:T.redBg, bdr:allTimeStats.wr>=50?T.greenBdr:T.redBdr },
                  { icon:"⚖️", label:"RR Moyen", value:allTimeStats.avgRR!==null?`${allTimeStats.avgRR.toFixed(2)}R`:"—", col:T.purple, bg:T.purpleBg, bdr:`${T.purple}40` },
                  { icon:"🧮", label:"Espérance", value:allTimeStats.esperance!==null?`${allTimeStats.esperance.toFixed(2)}R`:"—", col:allTimeStats.esperance>=0?T.green:T.red, bg:allTimeStats.esperance>=0?T.greenBg:T.redBg, bdr:allTimeStats.esperance>=0?T.greenBdr:T.redBdr,
                    tooltip:`WR × RR − (1−WR) = ${allTimeStats.wr!==null?(allTimeStats.wr/100).toFixed(2):'?'} × ${allTimeStats.avgRR!==null?allTimeStats.avgRR.toFixed(2):'?'} − ${allTimeStats.wr!==null?((1-allTimeStats.wr/100).toFixed(2)):'?'}` },
                  { icon:"📦", label:"Total trades", value:allTimeStats.totalTrades, col:T.text2, bg:T.card2, bdr:T.border },
                ].map((item,i) => (
                  <div key={i} style={{ background:item.bg, borderRadius:3, padding:"14px 16px", border:`1px solid ${item.bdr}` }} title={item.tooltip||""}>
                    <div style={{ fontSize:18, marginBottom:4 }}>{item.icon}</div>
                    <div style={{ fontSize:9, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>{item.label}</div>
                    <div style={{ fontSize:20, fontWeight:800, color:item.col, fontFamily:"monospace" }}>{item.value}</div>
                    {item.tooltip && <div style={{ fontSize:9, color:T.text3, marginTop:3, fontFamily:"monospace" }}>{item.tooltip}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Mois + drawdown */}
            <div className="grid-kpi" style={{ display:"grid", gridTemplateColumns:M?"repeat(2,1fr)":"repeat(3,1fr)", gap:M?8:12 }}>
              <div style={{ background:T.greenBg, borderRadius:3, padding:"14px 16px", border:`1px solid ${T.greenBdr}` }}>
                <div style={{ fontSize:9, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>🏆 Meilleur mois</div>
                {allTimeStats.bestMonthKey ? (<>
                  <div style={{ fontSize:20, fontWeight:800, color:T.green, fontFamily:"monospace" }}>+{allTimeStats.bestMonth.toFixed(0)} €</div>
                  <div style={{ fontSize:11, color:T.green, marginTop:3 }}>{(() => { const [y,m]=allTimeStats.bestMonthKey.split("-"); return `${MONTHS[parseInt(m)-1]} ${y}`; })()}</div>
                </>) : <div style={{ fontSize:14, color:T.text3 }}>—</div>}
              </div>
              <div style={{ background:T.redBg, borderRadius:3, padding:"14px 16px", border:`1px solid ${T.redBdr}` }}>
                <div style={{ fontSize:9, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>💀 Pire mois</div>
                {allTimeStats.worstMonthKey ? (<>
                  <div style={{ fontSize:20, fontWeight:800, color:T.red, fontFamily:"monospace" }}>{allTimeStats.worstMonth>=0?"+":"-"}{Math.abs(allTimeStats.worstMonth).toFixed(0)} €</div>
                  <div style={{ fontSize:11, color:T.red, marginTop:3 }}>{(() => { const [y,m]=allTimeStats.worstMonthKey.split("-"); return `${MONTHS[parseInt(m)-1]} ${y}`; })()}</div>
                </>) : <div style={{ fontSize:14, color:T.text3 }}>—</div>}
              </div>
              <div style={{ background:allTimeStats.maxDD>0?T.redBg:T.greenBg, borderRadius:3, padding:"14px 16px", border:`1px solid ${allTimeStats.maxDD>0?T.redBdr:T.greenBdr}` }}>
                <div style={{ fontSize:9, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>📉 Drawdown max</div>
                <div style={{ fontSize:20, fontWeight:800, color:allTimeStats.maxDD>0?T.red:T.green, fontFamily:"monospace" }}>{allTimeStats.maxDD>0?`-${allTimeStats.maxDDPct.toFixed(2)}%`:"0%"}</div>
                {allTimeStats.maxDD>0 && <div style={{ fontSize:11, color:T.red, marginTop:3 }}>−{allTimeStats.maxDD.toFixed(0)} € depuis le pic</div>}
              </div>
            </div>

            {/* Espérance explainer */}
            {allTimeStats.esperance !== null && (
              <div style={{ marginTop:14, padding:"10px 14px", background:T.card2, borderRadius:3, border:`1px solid ${T.border}` }}>
                <span style={{ fontSize:10, color:T.text3, fontWeight:700 }}>🧮 Espérance mathématique : </span>
                <span style={{ fontSize:10, color:T.text2, fontFamily:"monospace" }}>
                  WR ({allTimeStats.wr.toFixed(1)}%) × RR ({allTimeStats.avgRR.toFixed(2)}) − (1 − WR) = <strong style={{ color:allTimeStats.esperance>=0?T.green:T.red }}>{allTimeStats.esperance.toFixed(3)}R</strong>
                </span>
                <span style={{ fontSize:10, color:T.text3, marginLeft:8 }}>
                  {allTimeStats.esperance > 0.5 ? "🚀 Excellent edge !" : allTimeStats.esperance > 0 ? "✅ Edge positif" : "⚠️ Edge négatif — revois ta stratégie"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* MONTH PILLS */}
        <div className="pills-scroll" style={{ background:T.card, borderRadius:4, padding:10, boxShadow:T.shadow2, flexWrap:M?"nowrap":"wrap" }}>
          {MONTHS.map((m,i) => {
            const s = allMonths[i], active = i===month;
            return (
              <button key={i} className="mp" onClick={()=>setMonth(i)} style={{ padding:M?"7px 10px":"5px 10px", borderRadius:9, border:"none", cursor:"pointer", fontSize:11, fontWeight:active?700:500, background:active?(s.pct!=null?(s.pct>=0?T.greenBg:T.redBg):"#e8ecf4"):"transparent", color:active?(s.pct!=null?color(s.pct):"#374151"):"#9ca3af", outline:active?`2px solid ${s.pct!=null?(s.pct>=0?T.greenBdr:T.redBdr):"#d1d5db"}`:"none", outlineOffset:-2, whiteSpace:"nowrap", flexShrink:0 }}>
                {m.slice(0,4)}
                {s.pct!=null&&<span style={{marginLeft:4}}>{fmtPct(s.pct,1)}</span>}
                {!M&&s.pnl!=null&&<span style={{marginLeft:3,opacity:.7}}>{s.pnl>=0?"+":"−"}{Math.abs(s.pnl).toFixed(0)}€</span>}
              </button>
            );
          })}
        </div>

        {/* OBJECTIF MENSUEL */}
        <div style={{ background:T.card, borderRadius:4, padding:M?"14px 16px":"18px 22px", boxShadow:T.shadow2 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:goalProgress?14:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18 }}>🎯</span>
              <div>
                <div style={{ fontSize:M?11:12, fontWeight:700, color:T.text2 }}>
                  Objectif {MONTHS[month]}
                  {goalProgress?.done&&<span style={{ marginLeft:8, fontSize:11, background:T.greenBg, color:T.green, borderRadius:6, padding:"2px 8px", fontWeight:700 }}>✅ Atteint !</span>}
                </div>
                {currentGoal
                  ? <div style={{ fontSize:11, color:T.text3 }}>Cible : <strong style={{ color:T.text2 }}>{currentGoal.type==="pct"?`+${currentGoal.target}%`:`+${currentGoal.target.toLocaleString("fr-FR")} €`}</strong></div>
                  : <div style={{ fontSize:11, color:T.text4 }}>Aucun objectif défini</div>
                }
              </div>
            </div>
            <button onClick={()=>{setEditingGoal(true);setInputGoalPct(currentGoal?.type==="pct"?String(currentGoal.target):"");setInputGoalPnl(currentGoal?.type==="pnl"?String(currentGoal.target):"");}} style={{ background:T.btnBg, border:"none", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:600, color:T.btnText }}>
              {currentGoal?"Modifier":"+ Définir"}
            </button>
          </div>
          {goalProgress && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:11, color:T.text3 }}>{goalProgress.type==="pct"?`${fmtPct(goalProgress.actual)||"0%"} sur +${goalProgress.target}%`:`${fmtMoney(goalProgress.actual)||"0 €"} sur +${goalProgress.target.toLocaleString("fr-FR")} €`}</span>
                <span style={{ fontSize:13, fontWeight:800, color:goalProgress.done?"#16a34a":"#6366f1" }}>{goalProgress.pct}%</span>
              </div>
              <div style={{ height:10, borderRadius:3, background:T.btnBg, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:3, width:`${goalProgress.pct}%`, transition:"width .6s ease", background:goalProgress.done?"linear-gradient(90deg,#10b981,#06d6a0)":goalProgress.pct>=75?T.accentGrad:goalProgress.pct>=40?"linear-gradient(90deg,#f59e0b,#fbbf24)":"linear-gradient(90deg,#ef4444,#f87171)" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                {[25,50,75,100].map(m=><span key={m} style={{ fontSize:9, color:goalProgress.pct>=m?"#6366f1":"#d1d5db", fontWeight:600 }}>{m}%</span>)}
              </div>
            </div>
          )}
        </div>

        {/* CALENDAR */}
        <div style={{ background:T.card, borderRadius:4, padding:M?12:22, boxShadow:T.shadow }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:M?12:18, flexWrap:"wrap" }}>
            <button className="nb" onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);}} style={{ background:T.btnBg, border:"none", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:16, color:T.btnText }}>‹</button>
            <h2 style={{ fontSize:M?16:20, fontWeight:800, color:T.text, letterSpacing:"-0.03em", flex:1 }}>{MONTHS[month]} <span style={{ color:T.text4 }}>{year}</span></h2>
            <button className="nb" onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);}} style={{ background:T.btnBg, border:"none", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:16, color:T.btnText }}>›</button>
            {monthlyStats.pct!==null&&<div style={{ padding:"5px 10px", borderRadius:3, background:monthlyStats.pct>=0?T.greenBg:T.redBg, border:`1px solid ${monthlyStats.pct>=0?T.greenBdr:T.redBdr}` }}><span style={{ fontSize:M?13:16, fontWeight:800, color:color(monthlyStats.pct) }}>{fmtPct(monthlyStats.pct,M?1:2)}</span></div>}
            {monthlyStats.pnl!==null&&<div style={{ padding:"5px 10px", borderRadius:3, background:monthlyStats.pnl>=0?T.blueBg:T.redBg, border:`1px solid ${monthlyStats.pnl>=0?T.blueBdr:T.redBdr}` }}><span style={{ fontSize:M?12:16, fontWeight:800, color:monthlyStats.pnl>=0?T.blue:T.red }}>{M?(monthlyStats.pnl>=0?"+":"−")+Math.abs(monthlyStats.pnl).toFixed(0)+"€":fmtMoney(monthlyStats.pnl)}</span></div>}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:M?"repeat(7,1fr)":"repeat(7,1fr) 84px", gap:M?2:5 }}>
            {DAYS.map(d=><div key={d} style={{ textAlign:"center", fontSize:M?8:10, fontWeight:700, color:T.text3, paddingBottom:M?5:8, letterSpacing:"0.08em", textTransform:"uppercase" }}>{M?d.slice(0,1):d}</div>)}
            {!M&&<div style={{ textAlign:"center", fontSize:10, fontWeight:700, color:T.text4, paddingBottom:8 }}>SEM.</div>}

            {rows.map((row,wi) => {
              const ws = weeklyStats[wi];
              return [
                ...row.map((day,di) => {
                  if (!day) {
                    if (wi===0 && di===firstDay-1) return (
                      <div key={`cap-${di}`} style={{ minHeight:M?52:90, borderRadius:M?8:12, background:dark?"rgba(14,165,233,0.12)":"linear-gradient(135deg,#eff6ff,#f0fdf4)", border:`1.5px dashed ${dark?"#0ea5e9":"#93c5fd"}`, padding:M?"5px 4px":"8px 7px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}
                        onClick={()=>{setEditingCapital(true);setCapitalInput(String(capital));}}>
                        {editingCapital?(
                          <div style={{ width:"100%" }} onClick={e=>e.stopPropagation()}>
                            <input autoFocus type="number" step="0.01" value={capitalInput} onChange={e=>setCapitalInput(e.target.value)} onBlur={saveCapital} onKeyDown={e=>{if(e.key==="Enter")saveCapital();if(e.key==="Escape")setEditingCapital(false);}} placeholder="Capital" style={{ width:"100%", border:`1px solid ${T.blueBdr}`, borderRadius:7, background:T.card, fontSize:11, fontWeight:700, textAlign:"center", padding:"4px", outline:"none", color:T.text, boxSizing:"border-box" }} />
                          </div>
                        ):capitalNum?(
                          <>
                            <span style={{ fontSize:9, fontWeight:700, color:T.btnText, textTransform:"uppercase" }}>Capital</span>
                            <span style={{ fontSize:12, fontWeight:800, color:T.blue }}>{capitalNum.toLocaleString("fr-FR")} €</span>
                            {currentCapital!==null&&currentCapital!==capitalNum&&<span style={{ fontSize:10, fontWeight:700, color:currentCapital>capitalNum?T.green:T.red }}>→ {currentCapital.toLocaleString("fr-FR",{maximumFractionDigits:0})} €</span>}
                          </>
                        ):(
                          <>
                            <span style={{ fontSize:16 }}>💰</span>
                            <span style={{ fontSize:9, fontWeight:700, color:"#93c5fd", textAlign:"center", lineHeight:1.3 }}>Capital de départ</span>
                          </>
                        )}
                      </div>
                    );
                    return <div key={`e${wi}${di}`} />;
                  }

                  const k = getKey(year,month,day);
                  const s = dayStats[k]||{pct:null,pnl:null};
                  const entry = data[k]||{};
                  const isToday = k===todayKey;
                  const isOff = !!entry.off;
                  const cf = cashflows[k] || 0;
                  const total = (entry.wins||0)+(entry.losses||0)+(entry.be||0);
                  const wr = total>0?Math.round((entry.wins||0)/total*100):null;

                  return (
                    <div key={k} className="dc" onClick={()=>{ if(!isOff) openEdit(day); }} onDoubleClick={()=>toggleDayOff(day)} style={{ minHeight:M?52:90, borderRadius:M?8:12, position:"relative", background:isOff?(dark?"rgba(100,116,139,.12)":"#f1f5f9"):bgColor(s.pct??(s.pnl!==null?(s.pnl>=0?.1:-.1):null)), border:`1.5px solid ${isOff?(dark?"#334155":"#cbd5e1"):isToday?T.accent:bdColor(s.pct??(s.pnl!==null?(s.pnl>=0?.1:-.1):null))}`, padding:M?"4px 3px":"7px 6px", cursor:"pointer", display:"flex", flexDirection:"column", gap:2, boxShadow:isToday?`0 0 0 3px ${T.accentBg}`:"none", opacity:isOff?.6:1 }}>
                      <span style={{ fontSize:11, fontWeight:isToday?800:500, color:isToday?T.accent:"#9ca3af", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        {day}
                        {entry.note&&!isOff&&<span style={{ width:6, height:6, borderRadius:"50%", background:T.accent, display:"inline-block" }} />}
                      </span>
                      {/* NOTE TOOLTIP */}
                      {entry.note&&!isOff&&!M&&(
                        <div className="note-tip" style={{ position:"absolute", bottom:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)", zIndex:100, background:dark?"#1e2436":"#1a1d2e", color:"#e2e8f0", fontSize:10, fontWeight:500, borderRadius:8, padding:"6px 10px", maxWidth:160, lineHeight:1.4, whiteSpace:"pre-wrap", wordBreak:"break-word", boxShadow:"0 4px 16px rgba(0,0,0,.3)", pointerEvents:"none", opacity:0, transition:"opacity .15s" }}>
                          {entry.note.length > 80 ? entry.note.slice(0,80)+"…" : entry.note}
                          <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)", width:8, height:8, background:dark?"#1e2436":"#1a1d2e", clipPath:"polygon(0 0,100% 0,50% 100%)" }} />
                        </div>
                      )}
                      {isOff ? (
                        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <span style={{ fontSize:M?10:12, color:dark?"#64748b":"#94a3b8", fontWeight:700 }}>{M?"🏖️":"🏖️ OFF"}</span>
                        </div>
                      ) : (
                      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:2 }}>
                        {s.pct!==null&&<span style={{ fontSize:M?11:13, fontWeight:800, color:color(s.pct), lineHeight:1, textAlign:"center" }}>{fmtPct(s.pct,M?1:2)}</span>}
                        {s.pnl!==null&&!M&&<span style={{ fontSize:10, fontWeight:700, color:s.pnl>=0?T.blue:T.red, background:s.pnl>=0?T.blueBg:T.redBg, padding:"1px 4px", borderRadius:4, textAlign:"center" }}>{s.pnl>=0?"+":"−"}{Math.abs(s.pnl).toFixed(0)} €</span>}
                        {total>0&&(
                          <div style={{ display:"flex", gap:2, justifyContent:"center", flexWrap:"wrap", marginTop:2 }}>
                            <span style={{ fontSize:9, fontWeight:700, color:T.green, background:T.greenBg, padding:"1px 4px", borderRadius:3 }}>{entry.wins||0}W</span>
                            <span style={{ fontSize:9, fontWeight:700, color:T.red, background:T.redBg, padding:"1px 4px", borderRadius:3 }}>{entry.losses||0}L</span>
                            {(entry.be||0)>0&&<span style={{ fontSize:9, fontWeight:700, color:T.btnText, background:T.btnBg, padding:"1px 4px", borderRadius:3 }}>{entry.be}BE</span>}
                          </div>
                        )}
                        {wr!==null&&<span style={{ fontSize:9, fontWeight:700, textAlign:"center", color:wr>=50?T.green:T.red }}>{wr}% WR{entry.rr?` · ${entry.rr}R`:""}</span>}
                        {(entry.mood||entry.plan)&&(
                          <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:3, marginTop:2 }}>
                            {entry.mood&&<span style={{ fontSize:12 }}>{entry.mood}</span>}
                            {entry.plan==="Oui"&&<span style={{ fontSize:9, background:T.greenBg, color:T.green, borderRadius:3, padding:"1px 3px", fontWeight:700 }}>✓</span>}
                            {entry.plan==="Non"&&<span style={{ fontSize:9, background:T.redBg, color:T.red, borderRadius:3, padding:"1px 3px", fontWeight:700 }}>✗</span>}
                            {entry.plan==="Partiel"&&<span style={{ fontSize:9, background:T.btnBg, color:T.btnText, borderRadius:3, padding:"1px 3px", fontWeight:700 }}>~</span>}
                          </div>
                        )}
                        {s.pct===null&&s.pnl===null&&total===0&&!entry.mood&&!cf&&<span style={{ fontSize:M?14:20, color:T.border, textAlign:"center" }}>+</span>}
                        {cf!==0&&!M&&(
                          <span style={{ fontSize:9, fontWeight:700, textAlign:"center", padding:"1px 4px", borderRadius:4,
                            background:cf>0?T.blueBg:T.redBg, color:cf>0?T.blue:T.red }}>
                            {cf>0?"↓":"↑"}{Math.abs(cf).toFixed(0)}€
                          </span>
                        )}
                      </div>
                      )}
                    </div>
                  );
                }),
                <div key={`w${wi}`} style={{ borderRadius:3, background:ws.pct!==null?bgColor(ws.pct):T.card2, border:`1.5px solid ${ws.pct!==null?bdColor(ws.pct):T.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:"6px 4px" }}>
                  {(ws.pct!==null||ws.pnl!==null)?(
                    <>
                      <span style={{ fontSize:9, color:T.text3, fontWeight:600 }}>SEM.</span>
                      {ws.pct!==null&&<span style={{ fontSize:12, fontWeight:800, color:color(ws.pct), lineHeight:1 }}>{fmtPct(ws.pct,1)}</span>}
                      {ws.pnl!==null&&<span style={{ fontSize:10, fontWeight:700, color:ws.pnl>=0?T.blue:T.red, background:ws.pnl>=0?T.blueBg:T.redBg, padding:"1px 5px", borderRadius:5 }}>{ws.pnl>=0?"+":"−"}{Math.abs(ws.pnl).toFixed(0)} €</span>}
                    </>
                  ):<span style={{ fontSize:18, color:T.border }}>·</span>}
                </div>
              ];
            })}
          </div>
        </div>

        {/* JOURNAL NARRATIF IA PAR SEMAINE */}
        {rows.some(row => row.filter(Boolean).some(d => data[getKey(year,month,d)]?.pnl != null)) && (
          <div style={{ background:T.card, borderRadius:4, padding:M?"14px 16px":"18px 20px", boxShadow:T.shadow2 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:16 }}>📓</span>
              <span style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em" }}>Journal narratif — {MONTHS[month]} {year}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {rows.map((row, wi) => {
                const days = row.filter(Boolean);
                const hasTrades = days.some(d => data[getKey(year,month,d)]?.pnl != null);
                if (!hasTrades) return null;
                const ws = weeklyStats[wi];
                const narKey = `${year}-${month}-${wi}`;
                const narText = narrativeText[narKey];
                const isLoading = narrativeLoading === wi;
                return (
                  <div key={wi} style={{ borderRadius:3, border:`1px solid ${T.border}`, overflow:"hidden" }}>
                    {/* Header semaine */}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:T.card2 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:T.text3 }}>Semaine {wi+1}</span>
                        {ws.pct !== null && <span style={{ fontSize:12, fontWeight:800, color:ws.pct>=0?T.green:T.red }}>{fmtPct(ws.pct,1)}</span>}
                        {ws.pnl !== null && <span style={{ fontSize:11, fontWeight:700, color:ws.pnl>=0?T.blue:T.red }}>{ws.pnl>=0?"+":"−"}{Math.abs(ws.pnl).toFixed(0)} €</span>}
                      </div>
                      {!narText && !isLoading && (
                        <button onClick={()=>generateNarrative(wi)}
                          style={{ fontSize:11, fontWeight:700, color:T.accent, background:T.accentBg, border:`1px solid ${T.accentBdr}`, borderRadius:8, padding:"5px 10px", cursor:"pointer" }}>
                          🤖 Générer
                        </button>
                      )}
                      {narText && (
                        <button onClick={()=>generateNarrative(wi)}
                          style={{ fontSize:10, color:T.text3, background:"none", border:"none", cursor:"pointer" }}>↺</button>
                      )}
                    </div>
                    {/* Contenu narratif */}
                    {isLoading && (
                      <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:8, color:T.text3, fontSize:12 }}>
                        <span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>🤖</span> Génération du résumé…
                      </div>
                    )}
                    {narText && !isLoading && (
                      <div style={{ padding:"12px 14px", fontSize:13, color:T.text2, lineHeight:1.7, fontStyle:"italic" }}>
                        {narText}
                      </div>
                    )}
                    {!narText && !isLoading && (
                      <div style={{ padding:"10px 14px", fontSize:11, color:T.text4 }}>
                        Clique sur "Générer" pour obtenir un résumé IA de cette semaine.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RÉCAP DÉPÔTS / RETRAITS DU MOIS */}
        {(() => {
          const monthCfs = Array.from({length:daysInMonth},(_,i)=>{ const k=getKey(year,month,i+1); return {k,v:cashflows[k]||0,d:i+1}; }).filter(x=>x.v!==0);
          if (!monthCfs.length) return null;
          const totalDepots = monthCfs.filter(x=>x.v>0).reduce((a,x)=>a+x.v,0);
          const totalRetraits = monthCfs.filter(x=>x.v<0).reduce((a,x)=>a+Math.abs(x.v),0);
          return (
            <div style={{ background:T.card, borderRadius:4, padding:M?"12px 14px":"16px 20px", boxShadow:T.shadow2 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.text3, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
                💳 Mouvements de capital
              </div>
              <div style={{ display:"flex", gap:M?8:16, marginBottom:12, flexWrap:"wrap" }}>
                {totalDepots>0&&<div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:9, background:T.blueBg, border:`1px solid ${T.blueBdr}` }}>
                  <span style={{ fontSize:13, color:T.blue, fontWeight:800 }}>↓</span>
                  <div>
                    <div style={{ fontSize:9, color:T.text3, fontWeight:700, textTransform:"uppercase" }}>Dépôts</div>
                    <div style={{ fontSize:14, fontWeight:800, color:T.blue, fontFamily:"monospace" }}>+{totalDepots.toLocaleString("fr-FR")} €</div>
                  </div>
                </div>}
                {totalRetraits>0&&<div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:9, background:T.redBg, border:`1px solid ${T.redBdr}` }}>
                  <span style={{ fontSize:13, color:T.red, fontWeight:800 }}>↑</span>
                  <div>
                    <div style={{ fontSize:9, color:T.text3, fontWeight:700, textTransform:"uppercase" }}>Retraits</div>
                    <div style={{ fontSize:14, fontWeight:800, color:T.red, fontFamily:"monospace" }}>−{totalRetraits.toLocaleString("fr-FR")} €</div>
                  </div>
                </div>}
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {monthCfs.map(({k,v,d})=>(
                  <button key={k} onClick={()=>{ setEditingCashflow({key:k,type:v>0?"depot":"retrait"}); setInputCashflow(String(Math.abs(v))); }}
                    style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 9px", borderRadius:7, border:`1px solid ${v>0?T.blueBdr:T.redBdr}`, background:v>0?T.blueBg:T.redBg, cursor:"pointer", fontSize:11, fontWeight:700, color:v>0?T.blue:T.red }}>
                    {v>0?"↓":"↑"} {d} {MONTHS[month].slice(0,3)} · {Math.abs(v).toLocaleString("fr-FR")} €
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* STATS TRADES DU MOIS */}
        {monthlyTrades.total > 0 && (
          <div style={{ background:T.card, borderRadius:4, padding:M?"12px 14px":"16px 20px", boxShadow:T.shadow2 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.text3, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>{L.tradesMonth}</div>
            <div style={{ display:M?"grid":"flex", gridTemplateColumns:M?"repeat(3,1fr)":"none", flexWrap:M?"none":"wrap", gap:M?8:0 }}>
            {[
              { label:"Total trades", value:monthlyTrades.total, col:"#374151" },
              { label:"✅ Gagnants", value:monthlyTrades.wins, col:"#16a34a" },
              { label:"❌ Perdants", value:monthlyTrades.losses, col:"#dc2626" },
              { label:"➖ Breakeven", value:monthlyTrades.be, col:"#6b7280" },
              { label:"Win Rate", value:monthlyTrades.wr!==null?`${monthlyTrades.wr}%`:"—", col:monthlyTrades.wr>=50?T.green:T.red },
              { label:"RR Moyen", value:monthlyTrades.avgRR!==null?`${monthlyTrades.avgRR}R`:"—", col:"#6366f1" },
            ].map((item,i,arr)=>(
              <div key={i} style={{ flex:1, minWidth:M?0:80, textAlign:"center", padding:M?"8px 4px":"0 12px", borderRight:!M&&i<arr.length-1?"1px solid #f3f4f6":"none", background:M?T.card2:"transparent", borderRadius:M?8:0 }}>
                <div style={{ fontSize:M?8:10, color:T.text3, fontWeight:600, marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:M?16:20, fontWeight:800, color:item.col }}>{item.value}</div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* BADGES */}
        {badges.length > 0 && (
          <div style={{ background:T.card, borderRadius:4, padding:24, boxShadow:T.shadow }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.text3, letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"inherit" }}>{L.badges}</div>
              <div style={{ fontSize:11, color:T.text3 }}>{badges.filter(b=>b.unlocked).length} / {badges.length} débloqués</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:M?"repeat(auto-fill,minmax(90px,1fr))":"repeat(auto-fill,minmax(130px,1fr))", gap:M?8:10 }}>
              {badges.map(b=>(
                <div key={b.id} className="bc" style={{ borderRadius:4, padding:"14px 12px", textAlign:"center", background:b.unlocked?b.bg:"#f9fafb", border:`1.5px solid ${b.unlocked?b.col+"55":"#e5e7eb"}`, opacity:b.unlocked?1:.65, position:"relative", overflow:"hidden" }}>
                  {b.unlocked&&<div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 50% 0%,${b.col}18,transparent 70%)`, pointerEvents:"none" }} />}
                  <div style={{ fontSize:28, marginBottom:6, filter:b.unlocked?"none":"grayscale(1)" }}>{b.icon}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:b.unlocked?b.col:"#9ca3af", marginBottom:3 }}>{b.label}</div>
                  <div style={{ fontSize:10, color:T.text3, lineHeight:1.3 }}>{b.desc}</div>
                  {!b.unlocked&&b.progress!=null&&(
                    <div style={{ marginTop:8 }}>
                      <div style={{ height:4, borderRadius:4, background:T.border, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${b.progress}%`, borderRadius:4, background:T.accentGrad, transition:"width .5s" }} />
                      </div>
                      <div style={{ fontSize:9, color:T.text3, marginTop:3 }}>{b.progress}%</div>
                    </div>
                  )}
                  {!b.unlocked&&b.progress==null&&<div style={{ fontSize:10, color:T.text4, marginTop:6 }}>🔒</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS AVANCÉS */}
        {(drawdownStats||dayOfWeekStats.some(d=>d.count>0)||wrEvolution.length>0)&&(
          <div style={{ background:T.card, borderRadius:4, padding:24, boxShadow:T.shadow, display:"flex", flexDirection:"column", gap:24 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.text3, letterSpacing:"0.1em", textTransform:"uppercase" }}>{L.analytics}</div>

            <div className="grid-kpi" style={{ display:"grid", gridTemplateColumns:M?"repeat(2,1fr)":"1fr 1fr 1fr", gap:M?8:14 }}>
              {drawdownStats&&(
                <div style={{ background:drawdownStats.maxDD>0?"#fff5f5":"#f0fdf4", borderRadius:4, padding:M?"12px 12px":"16px 18px", border:`1px solid ${drawdownStats.maxDD>0?"#fecaca":"#bbf7d0"}` }}>
                  <div style={{ fontSize:10, color:T.text3, fontWeight:700, textTransform:"uppercase", marginBottom:8 }}>📉 Drawdown max</div>
                  <div style={{ fontSize:24, fontWeight:800, color:drawdownStats.maxDD>0?"#dc2626":"#16a34a", fontFamily:"monospace" }}>{drawdownStats.maxDD>0?`-${drawdownStats.maxDDPct.toFixed(2)}%`:"0%"}</div>
                  <div style={{ fontSize:11, color:drawdownStats.maxDD>0?"#ef4444":"#16a34a", marginTop:4 }}>{drawdownStats.maxDD>0?`−${drawdownStats.maxDD.toFixed(0)} € depuis le pic`:"Aucune perte depuis le pic 🎉"}</div>
                </div>
              )}
              {bestWorstDay.best&&(
                <div style={{ background:T.greenBg, borderRadius:4, padding:"16px 18px", border:`1px solid ${T.greenBdr}` }}>
                  <div style={{ fontSize:10, color:T.text3, fontWeight:700, textTransform:"uppercase", marginBottom:8 }}>🏆 Meilleur jour</div>
                  <div style={{ fontSize:24, fontWeight:800, color:T.green, fontFamily:"monospace" }}>+{bestWorstDay.best.pnl.toFixed(0)} €</div>
                  <div style={{ fontSize:11, color:T.green, marginTop:4 }}>Le {bestWorstDay.best.day} {MONTHS[month]}</div>
                </div>
              )}
              {bestWorstDay.worst&&bestWorstDay.worst.pnl<0&&(
                <div style={{ background:T.redBg, borderRadius:4, padding:"16px 18px", border:`1px solid ${T.redBdr}` }}>
                  <div style={{ fontSize:10, color:T.text3, fontWeight:700, textTransform:"uppercase", marginBottom:8 }}>💀 Pire jour</div>
                  <div style={{ fontSize:24, fontWeight:800, color:T.red, fontFamily:"monospace" }}>{bestWorstDay.worst.pnl.toFixed(0)} €</div>
                  <div style={{ fontSize:11, color:T.red, marginTop:4 }}>Le {bestWorstDay.worst.day} {MONTHS[month]}</div>
                </div>
              )}
            </div>

            {dayOfWeekStats.some(d=>d.count>0)&&(
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.btnText, marginBottom:12 }}>📅 Performance par jour de la semaine ({year})</div>
                <div style={{ display:"flex", gap:8 }}>
                  {dayOfWeekStats.map((d,i)=>{
                    const maxAbs = Math.max(...dayOfWeekStats.filter(x=>x.avg!==null).map(x=>Math.abs(x.avg)),1);
                    const barH = d.avg!==null?Math.round((Math.abs(d.avg)/maxAbs)*60):0;
                    const isPos = d.avg!==null&&d.avg>=0;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                        {d.avg!==null&&<span style={{ fontSize:10, fontWeight:700, color:isPos?T.green:T.red, fontFamily:"monospace" }}>{isPos?"+":""}{d.avg.toFixed(0)}€</span>}
                        <div style={{ width:"100%", height:70, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
                          <div style={{ width:"70%", height:barH||3, borderRadius:6, background:d.avg===null?"#f3f4f6":isPos?"linear-gradient(180deg,#34d399,#10b981)":"linear-gradient(180deg,#f87171,#ef4444)", transition:"height .4s ease" }} />
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:T.text2 }}>{d.day}</span>
                        <span style={{ fontSize:9, color:T.text3 }}>{d.count>0?`${d.count}j`:"—"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {wrEvolution.length>1&&(
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.btnText, marginBottom:12 }}>{L.wrEvol} — {MONTHS[month]}</div>
                <div style={{ display:"flex", gap:8 }}>
                  {wrEvolution.map((w,i)=>(
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <span style={{ fontSize:11, fontWeight:800, color:w.wr>=50?T.green:T.red }}>{w.wr}%</span>
                      <div style={{ width:"100%", height:8, borderRadius:8, background:T.card2, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${w.wr}%`, borderRadius:8, background:w.wr>=50?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#ef4444,#f87171)", transition:"width .5s ease" }} />
                      </div>
                      <span style={{ fontSize:10, color:T.text3 }}>S{w.week}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HEATMAP HEURES */}
            {heatmapData.length > 0 && (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.btnText, marginBottom:12 }}>{L.heatmap}</div>
                <div style={{ display:"grid", gridTemplateColumns:M?"repeat(8,1fr)":"repeat(12,1fr)", gap:M?3:4 }}>
                  {Array.from({length:24},(_,h)=>{
                    const slot = heatmapData.find(x=>x.hour===h);
                    const maxPnl = Math.max(...heatmapData.map(x=>Math.abs(x.pnl)),1);
                    const intensity = slot ? Math.min(Math.abs(slot.pnl)/maxPnl, 1) : 0;
                    const isPos = slot && slot.pnl >= 0;
                    const bg = !slot ? T.card2
                      : isPos ? `rgba(16,185,90,${0.1+intensity*0.8})`
                      : `rgba(239,68,68,${0.1+intensity*0.8})`;
                    return (
                      <div key={h} title={slot?`${h}h — ${slot.pnl>=0?"+":"−"}${Math.abs(slot.pnl).toFixed(0)}€ (${slot.count} jour${slot.count>1?"s":""})`:`${h}h — aucun trade`}
                        style={{ borderRadius:8, padding:"8px 4px", background:bg, border:`1px solid ${slot?(isPos?"rgba(16,185,90,.3)":"rgba(239,68,68,.3)"):T.border}`, textAlign:"center", cursor:"default" }}>
                        <div style={{ fontSize:9, color:T.text3, fontWeight:600 }}>{h}h</div>
                        {slot&&<div style={{ fontSize:9, fontWeight:700, color:isPos?T.green:T.red, marginTop:2, fontFamily:"monospace" }}>{isPos?"+":"−"}{Math.abs(slot.pnl)>=1000?`${(Math.abs(slot.pnl)/1000).toFixed(1)}k`:`${Math.abs(slot.pnl).toFixed(0)}`}</div>}
                        {slot&&<div style={{ fontSize:8, color:T.text3 }}>{slot.count}j</div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", gap:16, marginTop:8, flexWrap:"wrap" }}>
                  {heatmapData.sort((a,b)=>b.pnl-a.pnl).slice(0,3).map(s=>(
                    <div key={s.hour} style={{ fontSize:10, color:T.green }}>{s.pnl>=0?"🏆":"💀"} {s.hour}h : {s.pnl>=0?"+":"−"}{Math.abs(s.pnl).toFixed(0)}€ ({s.count}j)</div>
                  ))}
                </div>
              </div>
            )}

            {/* CORRÉLATION HUMEUR / PERF */}
            {moodPerfData.length > 0 && (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.btnText, marginBottom:12 }}>😊 Corrélation humeur / performance</div>
                <div style={{ display:"flex", gap:M?6:10, flexWrap:"wrap" }}>
                  {["😊","🙂","😐","😤","😰"].map(mood => {
                    const d = moodPerfData.find(x=>x.mood===mood);
                    if (!d) return null;
                    const isPos = d.avg >= 0;
                    return (
                      <div key={mood} style={{ flex:"1 0 80px", background:isPos?T.greenBg:d.avg<-10?T.redBg:T.card2, borderRadius:3, padding:"12px 10px", border:`1px solid ${isPos?T.greenBdr:d.avg<-10?T.redBdr:T.border}`, textAlign:"center" }}>
                        <div style={{ fontSize:24, marginBottom:4 }}>{mood}</div>
                        <div style={{ fontSize:13, fontWeight:800, color:isPos?T.green:T.red, fontFamily:"monospace" }}>
                          {isPos?"+":""}{d.avg.toFixed(0)} €
                        </div>
                        <div style={{ fontSize:9, color:T.text3, marginTop:2 }}>{d.wr}% WR</div>
                        <div style={{ fontSize:9, color:T.text3 }}>{d.count}j</div>
                      </div>
                    );
                  })}
                </div>
                {moodPerfData.length > 0 && (() => {
                  const best = moodPerfData.reduce((a,b)=>b.avg>a.avg?b:a);
                  const worst = moodPerfData.reduce((a,b)=>b.avg<a.avg?b:a);
                  return (
                    <div style={{ marginTop:10, display:"flex", gap:8, flexWrap:"wrap" }}>
                      <div style={{ fontSize:11, color:T.green, background:T.greenBg, padding:"4px 10px", borderRadius:7, border:`1px solid ${T.greenBdr}` }}>
                        🏆 Tu trades mieux avec {best.mood} (+{best.avg.toFixed(0)} € moy.)
                      </div>
                      {worst.avg < 0 && <div style={{ fontSize:11, color:T.red, background:T.redBg, padding:"4px 10px", borderRadius:7, border:`1px solid ${T.redBdr}` }}>
                        ⚠️ Évite de trader avec {worst.mood} ({worst.avg.toFixed(0)} € moy.)
                      </div>}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SUIVI PAR SETUP */}
            {setupStats.length > 0 && (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.btnText, marginBottom:12 }}>📊 Performance par setup</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {setupStats.map((s,i) => {
                    const maxPnl = Math.max(...setupStats.map(x=>Math.abs(x.pnl)),1);
                    const barW = Math.round(Math.abs(s.pnl)/maxPnl*100);
                    const isPos = s.pnl >= 0;
                    return (
                      <div key={i} style={{ background:T.card2, borderRadius:3, padding:"10px 14px", border:`1px solid ${T.border}` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:11, fontWeight:700, color:T.text }}>{s.name}</span>
                            <span style={{ fontSize:9, color:T.text3 }}>{s.trades} trade{s.trades>1?"s":""}</span>
                          </div>
                          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                            {s.avgRR && <span style={{ fontSize:10, fontWeight:700, color:T.accent }}>RR {s.avgRR.toFixed(1)}</span>}
                            <span style={{ fontSize:10, fontWeight:700, color:isPos?T.green:T.red }}>{s.wr}% WR</span>
                            <span style={{ fontSize:12, fontWeight:800, color:isPos?T.green:T.red, fontFamily:"monospace", minWidth:70, textAlign:"right" }}>
                              {isPos?"+":"−"}{Math.abs(s.pnl).toFixed(0)} €
                            </span>
                          </div>
                        </div>
                        <div style={{ height:5, borderRadius:5, background:T.border, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${barW}%`, borderRadius:5, background:isPos?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#ef4444,#f87171)", transition:"width .5s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* RÉCAP ANNUEL */}
        <div style={{ background:T.card, borderRadius:4, padding:M?12:18, boxShadow:T.shadow2 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.text3, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>{L.annualRecap}</div>
          <div className="annual-grid" style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:M?3:5 }}>
            {allMonths.map((s,i)=>(
              <div key={i} onClick={()=>setMonth(i)} style={{ borderRadius:M?6:10, padding:M?"7px 2px":"10px 5px", textAlign:"center", cursor:"pointer", background:bgColor(s.pct), border:`1.5px solid ${bdColor(s.pct)}`, outline:i===month?`2px solid ${T.accent}`:"none", outlineOffset:2 }}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{ fontSize:10, color:T.text3, fontWeight:600, marginBottom:4 }}>{MONTHS[i].slice(0,3)}</div>
                {s.pct!==null&&<div style={{ fontSize:12, fontWeight:800, color:color(s.pct) }}>{fmtPct(s.pct,1)}</div>}
                {s.pnl!==null&&<div style={{ fontSize:10, fontWeight:700, color:s.pnl>=0?T.blue:T.red, marginTop:2 }}>{s.pnl>=0?"+":"−"}{Math.abs(s.pnl).toFixed(0)}€</div>}
                {s.pct===null&&s.pnl===null&&<div style={{ fontSize:16, color:T.text4 }}>—</div>}
              </div>
            ))}
          </div>
        </div>

        {/* COURBE CAPITAL */}
        {capitalNum&&chartPoints.length>1&&(
          <div style={{ background:T.card, borderRadius:4, padding:24, boxShadow:T.shadow }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.text3, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>{L.capitalCurve}</div>
                <div style={{ fontSize:13, color:T.btnText }}>{MONTHS[month]} {year}</div>
              </div>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:T.text3 }}>Départ</div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.text2, fontFamily:"monospace" }}>{capitalNum.toLocaleString("fr-FR")} €</div>
                </div>
                <div style={{ width:1, height:32, background:T.border }} />
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:T.text3 }}>Actuel</div>
                  <div style={{ fontSize:14, fontWeight:700, color:chartPoints[chartPoints.length-1].capital>=capitalNum?T.green:T.red, fontFamily:"monospace" }}>
                    {chartPoints[chartPoints.length-1].capital.toLocaleString("fr-FR",{maximumFractionDigits:0})} €
                  </div>
                </div>
              </div>
            </div>
            <CapitalChart points={chartPoints} capitalNum={capitalNum} />
          </div>
        )}

        <p style={{ textAlign:"center", fontSize:11, color:T.text4 }}>
          Clique sur 💰 pour ton capital · Clique sur un jour pour saisir · Le % est calculé automatiquement
        </p>
        </>)}

        {/* ═══════════ VUE DASHBOARD ═══════════ */}
        {view === "dashboard" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {!allTimeStats ? (
              <div style={{ textAlign:"center", padding:60, color:T.text3 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
                <div style={{ fontSize:16, fontWeight:700 }}>Aucune donnée pour l'instant</div>
                <div style={{ fontSize:13, marginTop:6 }}>Commence à remplir ton journal pour voir ton dashboard !</div>
              </div>
            ) : (<>
              {/* KPIs principaux */}
              <div className="grid-kpi" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:M?8:12 }}>
                {[
                  { icon:"💰", label:"PnL Total", value:allTimeStats.totalPnl>=0?`+${allTimeStats.totalPnl.toFixed(0)} €`:`−${Math.abs(allTimeStats.totalPnl).toFixed(0)} €`, col:allTimeStats.totalPnl>=0?T.green:T.red, bg:allTimeStats.totalPnl>=0?T.greenBg:T.redBg, bdr:allTimeStats.totalPnl>=0?T.greenBdr:T.redBdr },
                  { icon:"🎯", label:"Win Rate", value:allTimeStats.wr!==null?`${allTimeStats.wr.toFixed(1)}%`:"—", col:allTimeStats.wr>=50?T.green:T.red, bg:allTimeStats.wr>=50?T.greenBg:T.redBg, bdr:allTimeStats.wr>=50?T.greenBdr:T.redBdr },
                  { icon:"🧮", label:"Espérance", value:allTimeStats.esperance!==null?`${allTimeStats.esperance.toFixed(2)}R`:"—", col:allTimeStats.esperance>=0?T.green:T.red, bg:allTimeStats.esperance>=0?T.greenBg:T.redBg, bdr:allTimeStats.esperance>=0?T.greenBdr:T.redBdr },
                  { icon:"🔥", label:"🔥 "+L.streak, value:`${streak}j`, col:"#f59e0b", bg:"#fef3c7", bdr:"#fbbf24" },
                ].map((item,i) => (
                  <div key={i} style={{ background:item.bg, borderRadius:4, padding:M?"12px 10px":"18px 20px", border:`1px solid ${item.bdr}`, boxShadow:T.shadow2 }}>
                    <div style={{ fontSize:M?18:24, marginBottom:4 }}>{item.icon}</div>
                    <div style={{ fontSize:M?8:9, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:M?16:26, fontWeight:800, color:item.col, fontFamily:"monospace" }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Ligne 2 KPIs */}
              <div className="grid-kpi" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:M?8:12 }}>
                {[
                  { icon:"📅", label:"Jours tradés", value:allTimeStats.tradingDays, col:T.text2, bg:T.card2, bdr:T.border },
                  { icon:"✅", label:"Jours verts", value:`${allTimeStats.greenDays}`, sub:`/ ${allTimeStats.tradingDays}`, col:T.green, bg:T.greenBg, bdr:T.greenBdr },
                  { icon:"🗓️", label:"Mois verts", value:`${allTimeStats.greenMonths}`, sub:`/ ${allTimeStats.totalMonths}`, col:T.green, bg:T.greenBg, bdr:T.greenBdr },
                  { icon:"📉", label:"Drawdown max", value:allTimeStats.maxDD>0?`-${allTimeStats.maxDDPct.toFixed(1)}%`:"0%", col:allTimeStats.maxDD>0?T.red:T.green, bg:allTimeStats.maxDD>0?T.redBg:T.greenBg, bdr:allTimeStats.maxDD>0?T.redBdr:T.greenBdr },
                ].map((item,i) => (
                  <div key={i} style={{ background:item.bg, borderRadius:4, padding:M?"12px 10px":"18px 20px", border:`1px solid ${item.bdr}`, boxShadow:T.shadow2 }}>
                    <div style={{ fontSize:M?18:24, marginBottom:4 }}>{item.icon}</div>
                    <div style={{ fontSize:M?8:9, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:M?16:26, fontWeight:800, color:item.col, fontFamily:"monospace" }}>{item.value}{item.sub&&<span style={{fontSize:M?10:13,color:T.text3,fontWeight:500,marginLeft:3}}>{item.sub}</span>}</div>
                  </div>
                ))}
              </div>

              {/* Espérance détaillée + Avg Win/Loss */}
              {dashboardData && (
                <div style={{ display:"grid", gridTemplateColumns:M?"1fr":"1fr 1fr", gap:12 }}>
                  <div style={{ background:T.card, borderRadius:4, padding:M?"14px 16px":"20px 22px", boxShadow:T.shadow2 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>💹 Gain moyen vs Perte moyenne</div>
                    <div style={{ display:"flex", gap:16, alignItems:"flex-end", marginBottom:12 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:10, color:T.green, fontWeight:700, marginBottom:4 }}>Gain moyen / jour vert</div>
                        <div style={{ fontSize:22, fontWeight:800, color:T.green, fontFamily:"monospace" }}>+{dashboardData.avgWin.toFixed(0)} €</div>
                      </div>
                      <div style={{ fontSize:20, color:T.text4 }}>vs</div>
                      <div style={{ flex:1, textAlign:"right" }}>
                        <div style={{ fontSize:10, color:T.red, fontWeight:700, marginBottom:4 }}>Perte moyenne / jour rouge</div>
                        <div style={{ fontSize:22, fontWeight:800, color:T.red, fontFamily:"monospace" }}>−{dashboardData.avgLoss.toFixed(0)} €</div>
                      </div>
                    </div>
                    {dashboardData.avgLoss > 0 && (
                      <div style={{ padding:"8px 12px", borderRadius:8, background:T.card2, fontSize:11, color:T.text2 }}>
                        Ratio réel : <strong style={{ color:dashboardData.avgWin/dashboardData.avgLoss>=1?T.green:T.red }}>{(dashboardData.avgWin/dashboardData.avgLoss).toFixed(2)}R</strong>
                        {dashboardData.avgWin/dashboardData.avgLoss>=1?" — tu gagnes plus que tu ne perds 🎯":" — attention, tes pertes dépassent tes gains ⚠️"}
                      </div>
                    )}
                  </div>
                  <div style={{ background:T.card, borderRadius:4, padding:"20px 22px", boxShadow:T.shadow2 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>🏆 Records personnels</div>
                    {[
                      { label:"Meilleure série de mois verts", value:`${dashboardData.bestMonthStreak} mois`, icon:"🗓️", col:T.green },
                      { label:"Meilleur jour ever", value:allTimeStats.bestDay?`+${allTimeStats.bestDay.pnl.toFixed(0)} €`:"—", sub:allTimeStats.bestDay?allTimeStats.bestDay.key.split("-").reverse().join("/"):"", icon:"🚀", col:T.green },
                      { label:"Pire jour ever", value:allTimeStats.worstDay&&allTimeStats.worstDay.pnl<0?`−${Math.abs(allTimeStats.worstDay.pnl).toFixed(0)} €`:"—", sub:allTimeStats.worstDay&&allTimeStats.worstDay.pnl<0?allTimeStats.worstDay.key.split("-").reverse().join("/"):"", icon:"💀", col:T.red },
                    ].map((r,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:i<2?`1px solid ${T.border2}`:"none" }}>
                        <div style={{ fontSize:12, color:T.text2 }}>{r.icon} {r.label}</div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:14, fontWeight:800, color:r.col, fontFamily:"monospace" }}>{r.value}</div>
                          {r.sub&&<div style={{ fontSize:10, color:T.text3 }}>{r.sub}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COURBE PNL CUMULÉ ALL-TIME */}
              {allTimeCurve.length > 1 && (
                <div style={{ background:T.card, borderRadius:4, padding:M?14:24, boxShadow:T.shadow }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>📈 PnL Cumulé — All Time</div>
                      <div style={{ fontSize:12, color:T.text3 }}>{allTimeCurve[1]?.date?.split("-").reverse().join("/")} → {allTimeCurve[allTimeCurve.length-1]?.date?.split("-").reverse().join("/")}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11, color:T.text3, marginBottom:2 }}>Total</div>
                      <div style={{ fontSize:18, fontWeight:800, color:allTimeCurve[allTimeCurve.length-1].cumPnl>=0?T.green:T.red, fontFamily:"monospace" }}>
                        {allTimeCurve[allTimeCurve.length-1].cumPnl>=0?"+":"−"}{Math.abs(allTimeCurve[allTimeCurve.length-1].cumPnl).toLocaleString("fr-FR",{maximumFractionDigits:0})} €
                      </div>
                    </div>
                  </div>
                  <AllTimeCurve points={allTimeCurve} dark={dark} T={T} onClickPoint={date=>{ const [y,m]=date.split("-"); setYear(parseInt(y)); setMonth(parseInt(m)-1); setView("journal"); }} />
                </div>
              )}

              {/* Historique mois — barres */}
              {compareData.length > 0 && (
                <div style={{ background:T.card, borderRadius:4, padding:24, boxShadow:T.shadow }}>
                  <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:20 }}>{L.monthlyHistory}</div>
                  <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:160, overflowX:"auto" }}>
                    {compareData.map((m,i) => {
                      const maxAbs = Math.max(...compareData.map(x=>Math.abs(x.pnl||0)), 1);
                      const barH = Math.max(Math.round((Math.abs(m.pnl||0)/maxAbs)*120), 4);
                      const isPos = (m.pnl||0) >= 0;
                      return (
                        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, minWidth:40, flex:"1 0 40px" }}
                          title={`${m.label}\n${m.pnl>=0?"+":"−"}${Math.abs(m.pnl||0).toFixed(0)} €${m.pct!==null?" / "+(m.pct>=0?"+":"")+m.pct.toFixed(1)+"%":""}`}>
                          <div style={{ fontSize:9, fontWeight:700, color:isPos?T.green:T.red, fontFamily:"monospace" }}>{isPos?"+":"-"}{Math.abs(m.pnl||0)>=1000?`${(Math.abs(m.pnl||0)/1000).toFixed(1)}k`:`${Math.abs(m.pnl||0).toFixed(0)}`}</div>
                          <div style={{ width:"70%", height:barH, borderRadius:"4px 4px 0 0", background:isPos?"linear-gradient(180deg,#34d399,#10b981)":"linear-gradient(180deg,#f87171,#ef4444)", transition:"height .3s" }} />
                          <div style={{ fontSize:9, color:T.text3, fontWeight:600 }}>{MONTHS[m.month].slice(0,3)}</div>
                          <div style={{ fontSize:8, color:T.text4 }}>{m.year}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Badges all time */}
              {badges.filter(b=>b.unlocked).length > 0 && (
                <div style={{ background:T.card, borderRadius:4, padding:24, boxShadow:T.shadow }}>
                  <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:16 }}>{L.trophiesUnlocked}</div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    {badges.filter(b=>b.unlocked).map(b => (
                      <div key={b.id} style={{ borderRadius:4, padding:"12px 16px", background:b.bg, border:`1.5px solid ${b.col}55`, display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:24 }}>{b.icon}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:800, color:b.col }}>{b.label}</div>
                          <div style={{ fontSize:10, color:T.text3 }}>{b.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTION CAPITAL */}
              {projection && (
                <div style={{ background:T.card, borderRadius:4, padding:M?14:24, boxShadow:T.shadow }}>
                  <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>📈 Simulation — Projection du capital</div>
                  <div style={{ fontSize:11, color:T.text3, marginBottom:16 }}>Basé sur ta moyenne de {(allTimeStats.totalPnl/allTimeStats.tradingDays).toFixed(0)} €/jour ({allTimeStats.tradingDays} jours de données)</div>
                  <div style={{ display:"grid", gridTemplateColumns:M?"repeat(2,1fr)":"repeat(4,1fr)", gap:M?8:12, marginBottom:16 }}>
                    {projection.map(p => (
                      <div key={p.months} style={{ background:T.card2, borderRadius:3, padding:"14px 12px", border:`1px solid ${T.border}`, textAlign:"center" }}>
                        <div style={{ fontSize:10, fontWeight:700, color:T.text3, textTransform:"uppercase", marginBottom:8 }}>
                          {p.months === 1?"1 mois":p.months === 3?"3 mois":p.months === 6?"6 mois":"1 an"}
                        </div>
                        <div style={{ fontSize:10, color:T.green, marginBottom:2 }}>🚀 {p.optimiste>=0?"+":""}{(p.optimiste-capitalNum).toFixed(0)} €</div>
                        <div style={{ fontSize:14, fontWeight:800, color:p.realiste>=capitalNum?T.green:T.red, fontFamily:"monospace", marginBottom:2 }}>
                          {p.realiste.toLocaleString("fr-FR",{maximumFractionDigits:0})} €
                        </div>
                        <div style={{ fontSize:10, color:T.text3, marginBottom:6 }}>({p.realiste>=capitalNum?"+":""}{(p.realiste-capitalNum).toFixed(0)} €)</div>
                        <div style={{ fontSize:10, color:T.red }}>🐢 {p.pessimiste>=capitalNum?"+":""}{(p.pessimiste-capitalNum).toFixed(0)} €</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:16, fontSize:10, color:T.text3, justifyContent:"center", flexWrap:"wrap" }}>
                    <span>🚀 Optimiste (+20%)</span>
                    <span style={{ fontWeight:700, color:T.text2 }}>■ Réaliste</span>
                    <span>🐢 Pessimiste (-30%)</span>
                  </div>
                  <div style={{ marginTop:10, padding:"8px 12px", borderRadius:8, background:T.card2, fontSize:10, color:T.text3, textAlign:"center" }}>
                    ⚠️ Simulation indicative — Les performances passées ne garantissent pas les résultats futurs.
                  </div>
                </div>
              )}

            </>)}
          </div>
        )}

        {/* ═══════════ VUE COMPARAISON ═══════════ */}
        {view === "compare" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {compareData.length < 2 ? (
              <div style={{ textAlign:"center", padding:60, color:T.text3 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>⚖️</div>
                <div style={{ fontSize:16, fontWeight:700 }}>Pas encore assez de données</div>
                <div style={{ fontSize:13, marginTop:6 }}>Il te faut au moins 2 mois de données pour comparer !</div>
              </div>
            ) : (<>
              {/* Tableau comparatif */}
              <div style={{ background:T.card, borderRadius:4, padding:24, boxShadow:T.shadow }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:20 }}>{L.compareTable}</div>
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 6px", fontSize:12 }}>
                    <thead>
                      <tr>
                        {["Mois","PnL €","Perf %","Trades","Win Rate","RR moy","Résultat"].map(h => (
                          <th key={h} style={{ textAlign:h==="Mois"?"left":"center", fontSize:9, color:T.text3, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", paddingBottom:8, paddingLeft:8 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...compareData].reverse().map((m,i) => {
                        const isPos = m.pnl >= 0;
                        return (
                          <tr key={i} onClick={()=>{setYear(m.year);setMonth(m.month);setView("journal");}}
                            style={{ cursor:"pointer", transition:"background .1s" }}
                            onMouseEnter={e=>{const cells=e.currentTarget.querySelectorAll("td");cells.forEach(c=>c.style.background=dark?"#1e2436":"#f3f4f8");}}
                            onMouseLeave={e=>{const cells=e.currentTarget.querySelectorAll("td");cells.forEach(c=>c.style.background="transparent");}}>
                            <td style={{ padding:"10px 8px", borderRadius:"8px 0 0 8px", fontWeight:700, color:T.text }}>{m.label}</td>
                            <td style={{ padding:"10px 8px", textAlign:"center", fontWeight:800, color:isPos?T.green:T.red, fontFamily:"monospace" }}>{isPos?"+":"−"}{Math.abs(m.pnl).toFixed(0)} €</td>
                            <td style={{ padding:"10px 8px", textAlign:"center", fontWeight:700, color:isPos?T.green:T.red, fontFamily:"monospace" }}>{m.pct!==null?(m.pct>=0?"+":"")+m.pct.toFixed(2)+"%":"—"}</td>
                            <td style={{ padding:"10px 8px", textAlign:"center", color:T.text2 }}>{m.total||"—"}</td>
                            <td style={{ padding:"10px 8px", textAlign:"center" }}>
                              {m.wr!==null ? <span style={{ padding:"2px 8px", borderRadius:6, background:m.wr>=50?T.greenBg:T.redBg, color:m.wr>=50?T.green:T.red, fontWeight:700 }}>{m.wr}%</span> : <span style={{ color:T.text4 }}>—</span>}
                            </td>
                            <td style={{ padding:"10px 8px", textAlign:"center", color:T.purple, fontWeight:700 }}>—</td>
                            <td style={{ padding:"10px 8px", textAlign:"center", borderRadius:"0 8px 8px 0" }}>
                              <span style={{ padding:"3px 10px", borderRadius:8, fontSize:11, fontWeight:700, background:isPos?T.greenBg:T.redBg, color:isPos?T.green:T.red }}>
                                {isPos?"✅ Vert":"❌ Rouge"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Graphique comparatif barres côte à côte par mois de l'année */}
              {(() => {
                const monthGroups = {};
                for (const m of compareData) {
                  if (!monthGroups[m.month]) monthGroups[m.month] = [];
                  monthGroups[m.month].push(m);
                }
                const sharedMonths = Object.entries(monthGroups).filter(([,arr])=>arr.length>=2);
                if (!sharedMonths.length) return null;
                return (
                  <div style={{ background:T.card, borderRadius:4, padding:24, boxShadow:T.shadow }}>
                    <div style={{ fontSize:11, fontWeight:700, color:T.text3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:20 }}>{L.sameMonthYears}</div>
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                      {sharedMonths.map(([mIdx, months]) => {
                        const maxAbs = Math.max(...months.map(m=>Math.abs(m.pnl||0)),1);
                        return (
                          <div key={mIdx} style={{ flex:"1 0 120px", background:T.card2, borderRadius:3, padding:"12px 10px", border:`1px solid ${T.border}` }}>
                            <div style={{ fontSize:11, fontWeight:700, color:T.text2, textAlign:"center", marginBottom:10 }}>{MONTHS[parseInt(mIdx)]}</div>
                            <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:80, justifyContent:"center" }}>
                              {months.map((m,j) => {
                                const barH = Math.max(Math.round((Math.abs(m.pnl||0)/maxAbs)*70),3);
                                const isPos = m.pnl >= 0;
                                const colors = ["#6366f1","#10b981","#f59e0b","#ef4444"];
                                return (
                                  <div key={j} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                                    <div style={{ width:28, height:barH, borderRadius:"3px 3px 0 0", background:isPos?colors[j%colors.length]:"#ef4444", opacity:.85 }} />
                                    <div style={{ fontSize:8, fontWeight:700, color:T.text3 }}>{m.year}</div>
                                    <div style={{ fontSize:8, color:isPos?T.green:T.red, fontFamily:"monospace" }}>{isPos?"+":"−"}{Math.abs(m.pnl||0)>=1000?`${(m.pnl/1000).toFixed(1)}k`:`${Math.abs(m.pnl||0).toFixed(0)}`}€</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </>)}
          </div>
        )}

      </div>

      {/* MODAL SAISIE */}
      {editing&&(()=>{
        const editDay = parseInt(editing.split("-")[2]);
        const w=parseInt(inputWins)||0,l=parseInt(inputLosses)||0,b=parseInt(inputBe)||0;
        const tot=w+l+b, prevWr=tot>0?Math.round(w/tot*100):null;
        return (
          <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:M?"flex-end":"center", justifyContent:"center", background:"rgba(0,0,0,.85)", backdropFilter:"blur(8px)" }} onClick={saveEdit}>
            <div className="modal-sheet" style={{ background:T.card, borderRadius:M?"20px 20px 0 0":20, padding:M?"20px 16px 32px":28, width:M?"100%":340, maxWidth:M?"100%":340, maxHeight:M?"92vh":"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.25)", animation:M?"slideUp .25s ease":"none" }} onClick={e=>e.stopPropagation()}>
              {M && <div style={{ width:36, height:4, borderRadius:2, background:T.border, margin:"0 auto 18px" }} />}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                <div>
                  <div style={{ fontSize:20, fontWeight:300, color:T.text, fontFamily:T.fontSerif, fontStyle:"italic" }}>{editDay} {MONTHS[month]} {year}</div>
                  <div style={{ fontSize:11, color:T.text3, marginTop:2 }}>{L.dailyEntry}</div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={()=>{ toggleDayOff(editDay); setEditing(null); }} title={L.markDayOff} style={{ background:(data[editing]||{}).off?T.redBg:T.btnBg, border:"none", borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:13, color:(data[editing]||{}).off?T.red:T.btnText, fontWeight:700 }}>🏖️</button>
                  <button onClick={()=>{ setEditingCashflow({key:editing, type:"depot"}); setInputCashflow(cashflows[editing]>0?String(cashflows[editing]):""); setEditing(null); }} title="Dépôt" style={{ background:cashflows[editing]>0?T.blueBg:T.btnBg, border:"none", borderRadius:8, padding:"6px 9px", cursor:"pointer", fontSize:12, fontWeight:700, color:cashflows[editing]>0?T.blue:T.btnText }}>↓</button>
                  <button onClick={()=>{ setEditingCashflow({key:editing, type:"retrait"}); setInputCashflow(cashflows[editing]<0?String(Math.abs(cashflows[editing])):""); setEditing(null); }} title="Retrait" style={{ background:cashflows[editing]<0?T.redBg:T.btnBg, border:"none", borderRadius:8, padding:"6px 9px", cursor:"pointer", fontSize:12, fontWeight:700, color:cashflows[editing]<0?T.red:T.btnText }}>↑</button>
                  <button onClick={()=>setEditing(null)} style={{ background:T.btnBg, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16, color:T.btnText, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={lbl}>{L.pnl}</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:12, color:T.text3, fontWeight:700 }}>€</span>
                  <input autoFocus type="number" step="0.01" value={inputPnl} onChange={e=>setInputPnl(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}} placeholder="ex: 150 ou -80" style={iS({paddingLeft:28})} />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
                <div><label style={lbl}>✅ {L.winners}</label><input type="number" min="0" value={inputWins} onChange={e=>setInputWins(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}} placeholder="0" style={iS()} /></div>
                <div><label style={lbl}>❌ {L.losers}</label><input type="number" min="0" value={inputLosses} onChange={e=>setInputLosses(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}} placeholder="0" style={iS()} /></div>
                <div><label style={lbl}>➖ BE</label><input type="number" min="0" value={inputBe} onChange={e=>setInputBe(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}} placeholder="0" style={iS()} /></div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                <div>
                  <label style={lbl}>{L.rr}</label>
                  <input type="number" step="0.1" value={inputRR} onChange={e=>setInputRR(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveEdit();if(e.key==="Escape")setEditing(null);}} placeholder="ex: 2.5" style={iS()} />
                </div>
                <div>
                  <label style={lbl}>{L.entryHour}</label>
                  <input type="time" value={inputHour} onChange={e=>setInputHour(e.target.value)} style={iS()} />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                <div>
                  <label style={lbl}>{L.instrument}</label>
                  <select value={inputInstrument} onChange={e=>setInputInstrument(e.target.value)} style={iS()}>
                    <option value="">—</option>
                    {L.instruments.map(i=><option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>{L.setup}</label>
                  <input type="text" value={inputSetup} onChange={e=>setInputSetup(e.target.value)} placeholder="ex: Breakout, Range..." style={iS()} />
                </div>
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={lbl}>{L.mood}</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[["😊","Excellent"],["🙂","Bien"],["😐","Neutre"],["😤","Frustré"],["😰","Stressé"]].map(([emoji,label])=>(
                    <button key={emoji} onClick={()=>setInputMood(inputMood===emoji?"":emoji)} title={label} style={{ flex:1, padding:"8px 4px", borderRadius:3, border:`2px solid ${inputMood===emoji?T.purple:T.border}`, background:inputMood===emoji?T.purpleBg:T.card2, fontSize:20, cursor:"pointer", transition:"all .15s" }}>{emoji}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={lbl}>{L.planRespected}</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[[L.yes,"Oui",T.greenBg,T.green],[L.no,"Non",T.redBg,T.red],[L.partial,"Partiel",T.card2,T.btnText]].map(([icon,label,bg,col])=>(
                    <button key={label} onClick={()=>setInputPlan(inputPlan===label?"":label)} style={{ flex:1, padding:"9px 6px", borderRadius:3, border:`2px solid ${inputPlan===label?col:T.border}`, background:inputPlan===label?bg:T.card2, fontSize:12, fontWeight:700, color:inputPlan===label?col:T.text3, cursor:"pointer", transition:"all .15s" }}>{icon}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom:18 }}>
                <label style={lbl}>{L.note}</label>
                <textarea value={inputNote} onChange={e=>setInputNote(e.target.value)} placeholder="Contexte de marché, erreurs, leçons du jour..." rows={3} style={{ ...iS(), resize:"vertical", fontFamily:"inherit", lineHeight:1.5 }} />
              </div>

              {tot>0&&(
                <div style={{ background:T.card2, borderRadius:3, padding:"12px 16px", marginBottom:18, display:"flex" }}>
                  {[{label:"Total",value:tot,col:T.text2},{label:"Win Rate",value:`${prevWr}%`,col:prevWr>=50?T.green:T.red},...(inputRR?[{label:"RR",value:`${parseFloat(inputRR).toFixed(1)}R`,col:T.purple}]:[])].map((item,i,arr)=>(
                    <div key={i} style={{ flex:1, textAlign:"center", borderRight:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
                      <div style={{ fontSize:10, color:T.text3, marginBottom:3 }}>{item.label}</div>
                      <div style={{ fontSize:18, fontWeight:800, color:item.col }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={saveEdit} style={{ flex:1, padding:"12px", borderRadius:3, background:"linear-gradient(135deg,#10b95a,#0ea5e9)", color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>Enregistrer</button>
                <button onClick={()=>{setData(d=>{const nd={...d};delete nd[editing];return nd;});setEditing(null);}} style={{ padding:"12px 14px", borderRadius:3, background:T.redBg, color:T.red, fontWeight:600, fontSize:13, border:"none", cursor:"pointer" }} title="Effacer ce jour">🗑</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DÉPÔT / RETRAIT */}
      {editingCashflow && (
        <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:M?"flex-end":"center", justifyContent:"center", background:"rgba(0,0,0,.85)", backdropFilter:"blur(8px)" }} onClick={()=>setEditingCashflow(null)}>
          <div style={{ background:T.card, borderRadius:M?"20px 20px 0 0":20, padding:M?"20px 16px 32px":28, width:M?"100%":320, maxWidth:M?"100%":320, boxShadow:"0 24px 80px rgba(0,0,0,.25)" }} onClick={e=>e.stopPropagation()}>
            {M && <div style={{ width:36, height:4, borderRadius:2, background:T.border, margin:"0 auto 18px" }} />}
            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:T.text }}>
                  {editingCashflow.type==="depot" ? "↓ Dépôt" : "↑ Retrait"}
                </div>
                <div style={{ fontSize:11, color:T.text3, marginTop:2 }}>
                  {editingCashflow.key.split("-").reverse().join("/")}
                </div>
              </div>
              <button onClick={()=>setEditingCashflow(null)} style={{ background:T.btnBg, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16, color:T.btnText }}>✕</button>
            </div>

            {/* Toggle dépôt / retrait */}
            <div style={{ display:"flex", gap:6, marginBottom:18, background:T.card2, borderRadius:3, padding:4 }}>
              {["depot","retrait"].map(type => (
                <button key={type} onClick={()=>setEditingCashflow(c=>({...c, type}))}
                  style={{ flex:1, padding:"9px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
                    background:editingCashflow.type===type?(type==="depot"?T.blueBg:T.redBg):"transparent",
                    color:editingCashflow.type===type?(type==="depot"?T.blue:T.red):T.text3 }}>
                  {type==="depot" ? "↓ Dépôt" : "↑ Retrait"}
                </button>
              ))}
            </div>

            {/* Montant */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block", fontSize:10, fontWeight:700, color:T.text3, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>
                Montant (€)
              </label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:16, color:editingCashflow.type==="depot"?T.blue:T.red, fontWeight:800 }}>
                  {editingCashflow.type==="depot"?"↓":"↑"}
                </span>
                <input autoFocus type="number" step="0.01" min="0" value={inputCashflow}
                  onChange={e=>setInputCashflow(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") saveCashflow(); if(e.key==="Escape") setEditingCashflow(null); }}
                  placeholder="ex: 500"
                  style={{ width:"100%", border:`1px solid ${editingCashflow.type==="depot"?T.blueBdr:T.redBdr}`, borderRadius:3, background:T.inputBg, fontSize:18, fontWeight:700, padding:"12px 14px 12px 36px", outline:"none", color:T.text, boxSizing:"border-box" }} />
              </div>
              {/* Cashflow existant */}
              {cashflows[editingCashflow.key] && (
                <div style={{ marginTop:8, fontSize:11, color:T.text3 }}>
                  Actuel : <strong style={{ color:cashflows[editingCashflow.key]>0?T.blue:T.red }}>
                    {cashflows[editingCashflow.key]>0?"Dépôt":"Retrait"} de {Math.abs(cashflows[editingCashflow.key]).toLocaleString("fr-FR")} €
                  </strong>
                </div>
              )}
            </div>

            {/* Boutons */}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={saveCashflow} style={{ flex:1, padding:"12px", borderRadius:3, background:editingCashflow.type==="depot"?T.blueBg:"linear-gradient(135deg,#ef4444,#f87171)", color:editingCashflow.type==="depot"?T.blue:"#fff", fontWeight:700, fontSize:14, border:editingCashflow.type==="depot"?`1px solid ${T.blueBdr}`:"none", cursor:"pointer" }}>
                Enregistrer
              </button>
              {cashflows[editingCashflow.key] && (
                <button onClick={()=>{ setCashflows(c=>{const nc={...c};delete nc[editingCashflow.key];return nc;}); setEditingCashflow(null); }}
                  style={{ padding:"12px 14px", borderRadius:3, background:T.redBg, color:T.red, fontWeight:600, fontSize:13, border:"none", cursor:"pointer" }}>
                  🗑
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL OBJECTIF */}
      {editingGoal&&(
        <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.85)", backdropFilter:"blur(8px)" }} onClick={()=>setEditingGoal(false)}>
          <div style={{ background:T.card, borderRadius:4, padding:28, width:300, boxShadow:"0 24px 80px rgba(0,0,0,.2)" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:300, color:T.text, fontFamily:T.fontSerif, fontStyle:"italic" }}>🎯 Objectif {MONTHS[month]}</div>
              <button onClick={()=>setEditingGoal(false)} style={{ background:T.btnBg, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:16, color:T.btnText }}>✕</button>
            </div>
            <p style={{ fontSize:12, color:T.text3, marginBottom:18 }}>Définis un objectif en % ou en €.</p>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>Objectif en %</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:12, color:T.text3, fontWeight:700 }}>%</span>
                <input autoFocus type="number" step="0.1" value={inputGoalPct} onChange={e=>{setInputGoalPct(e.target.value);setInputGoalPnl("");}} onKeyDown={e=>{if(e.key==="Enter")saveGoal();if(e.key==="Escape")setEditingGoal(false);}} placeholder="ex: 5" style={iS({paddingRight:28})} />
              </div>
            </div>
            <div style={{ textAlign:"center", fontSize:11, color:T.text4, marginBottom:14 }}>— ou —</div>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>Objectif en €</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:12, color:T.text3, fontWeight:700 }}>€</span>
                <input type="number" step="1" value={inputGoalPnl} onChange={e=>{setInputGoalPnl(e.target.value);setInputGoalPct("");}} onKeyDown={e=>{if(e.key==="Enter")saveGoal();if(e.key==="Escape")setEditingGoal(false);}} placeholder="ex: 500" style={iS({paddingRight:28})} />
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={saveGoal} style={{ flex:1, padding:"12px", borderRadius:3, background:"linear-gradient(135deg,#10b95a,#0ea5e9)", color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>Valider</button>
              {currentGoal&&<button onClick={()=>{setGoals(g=>{const ng={...g};delete ng[goalKey];return ng;});setEditingGoal(false);}} style={{ padding:"12px 14px", borderRadius:3, background:T.redBg, color:T.red, fontWeight:600, fontSize:13, border:"none", cursor:"pointer" }}>🗑</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AllTimeCurve({ points, dark, T, onClickPoint }) {
  const [hovered, setHovered] = useState(null);
  const [zoom, setZoom] = useState("all");
  if (!points || points.length < 2) return null;

  const now = new Date();
  const pts = zoom === "all" ? points : (() => {
    const months = zoom==="3m"?3:zoom==="6m"?6:12;
    const cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth()-months);
    const f = points.filter(p => new Date(p.date) >= cutoff);
    return f.length >= 2 ? f : points;
  })();

  const W=800, H=240, PL=68, PR=24, PT=24, PB=40;
  const innerW=W-PL-PR, innerH=H-PT-PB;
  const vals = pts.map(p=>p.cumPnl);
  const minV=Math.min(...vals), maxV=Math.max(...vals);
  const range=maxV-minV||1, pad=range*0.12;
  const yMin=minV-pad, yMax=maxV+pad;
  const xPos=i=>PL+(i/Math.max(pts.length-1,1))*innerW;
  const yPos=v=>PT+(1-(v-yMin)/(yMax-yMin))*innerH;
  const zeroY=Math.min(Math.max(yPos(0),PT),PT+innerH);
  const isPos=vals[vals.length-1]>=0;
  const lineColor=isPos?"#10b981":"#ef4444";
  const linePath=pts.map((p,i)=>`${i===0?"M":"L"}${xPos(i).toFixed(1)},${yPos(p.cumPnl).toFixed(1)}`).join(" ");
  const areaPath=linePath+` L${xPos(pts.length-1).toFixed(1)},${zeroY.toFixed(1)} L${xPos(0).toFixed(1)},${zeroY.toFixed(1)} Z`;
  const bestIdx=vals.indexOf(Math.max(...vals));
  const worstIdx=vals.indexOf(Math.min(...vals));
  const yTicks=Array.from({length:5},(_,i)=>yMin+(i/4)*(yMax-yMin));
  const step=Math.max(1,Math.floor((pts.length-1)/4));
  const xIdxs=[...new Set([0,...Array.from({length:4},(_,i)=>Math.min(Math.round((i+1)*step),pts.length-1))])];
  const svgBg=dark?"#0a0a0a":"#fafaf8";
  const gridCol=dark?"rgba(201,168,76,0.08)":"rgba(201,168,76,0.15)";
  const labelCol=dark?"#6B6560":"#8a7560";
  const tooltipBg=dark?"#0e0e0e":"#ffffff";
  const tooltipBdr=dark?"rgba(201,168,76,0.4)":"rgba(201,168,76,0.3)";
  const fmtDate=d=>{const[y,m,day]=d.split("-");return `${parseInt(day)}/${parseInt(m)}/${y.slice(2)}`;};
  const fmtVal=v=>(v>=0?"+":"−")+Math.abs(v).toLocaleString("fr-FR",{maximumFractionDigits:0})+" €";
  const fmtK=v=>{const a=Math.abs(v);return(v<0?"-":"")+(a>=10000?`${(a/1000).toFixed(0)}k`:a>=1000?`${(a/1000).toFixed(1)}k`:a.toFixed(0));};

  return (
    <div style={{ width:"100%" }}>
      <div style={{ display:"flex", gap:4, marginBottom:10, justifyContent:"flex-end" }}>
        {[["all","Tout"],["1y","1 an"],["6m","6 mois"],["3m","3 mois"]].map(([z,label])=>(
          <button key={z} onClick={()=>setZoom(z)}
            style={{ fontFamily:T.fontMono, fontSize:9, letterSpacing:"0.15em", padding:"4px 10px", borderRadius:2, border:`1px solid ${zoom===z?T.accent:T.border}`, background:zoom===z?T.accentBg:"transparent", color:zoom===z?T.accent:T.text3, cursor:"pointer" }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ borderRadius:3, background:svgBg, border:`1px solid ${dark?"rgba(201,168,76,0.12)":"rgba(201,168,76,0.2)"}`, overflow:"hidden" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block", cursor:"crosshair" }} onMouseLeave={()=>setHovered(null)}>
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={dark?".22":".12"}/>
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.01"/>
            </linearGradient>
            <linearGradient id="goldHLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0"/>
              <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <line x1={PL} y1={PT-1} x2={W-PR} y2={PT-1} stroke="url(#goldHLine)" strokeWidth="1"/>
          {yTicks.map((v,i)=>{
            const y=yPos(v);
            return (<g key={i}>
              <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={gridCol} strokeWidth="1"/>
              <text x={PL-6} y={y+4} textAnchor="end" fontSize="10" fill={v===0?"#C9A84C":labelCol} fontFamily="DM Mono,monospace" fontWeight={v===0?"600":"400"}>{fmtK(v)}</text>
            </g>);
          })}
          {zeroY>=PT&&zeroY<=PT+innerH&&<line x1={PL} y1={zeroY} x2={W-PR} y2={zeroY} stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="4,4" strokeOpacity="0.4"/>}
          {xIdxs.map(i=>(
            <text key={i} x={xPos(i)} y={H-10} textAnchor="middle" fontSize="9" fill={labelCol} fontFamily="DM Mono,monospace">{fmtDate(pts[i].date)}</text>
          ))}
          <path d={areaPath} fill="url(#equityGrad)"/>
          <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {bestIdx>0&&bestIdx<pts.length-1&&(
            <g>
              <circle cx={xPos(bestIdx)} cy={yPos(pts[bestIdx].cumPnl)} r="4" fill={T.green} stroke={svgBg} strokeWidth="2"/>
              <text x={xPos(bestIdx)} y={yPos(pts[bestIdx].cumPnl)-10} textAnchor="middle" fontSize="8" fill={T.green} fontFamily="DM Mono,monospace">▲</text>
            </g>
          )}
          {worstIdx>0&&worstIdx<pts.length-1&&worstIdx!==bestIdx&&(
            <g>
              <circle cx={xPos(worstIdx)} cy={yPos(pts[worstIdx].cumPnl)} r="4" fill={T.red} stroke={svgBg} strokeWidth="2"/>
              <text x={xPos(worstIdx)} y={yPos(pts[worstIdx].cumPnl)+16} textAnchor="middle" fontSize="8" fill={T.red} fontFamily="DM Mono,monospace">▼</text>
            </g>
          )}
          {pts.map((p,i)=>(
            <rect key={i}
              x={i===0?PL-4:(xPos(i-1)+xPos(i))/2}
              y={PT} height={innerH}
              width={Math.max(i===pts.length-1?W-PR-(xPos(i-1)+xPos(i))/2+4:(xPos(Math.min(i+1,pts.length-1))-xPos(Math.max(i-1,0)))/2, 12)}
              fill="transparent" style={{ cursor:"pointer" }}
              onMouseEnter={()=>setHovered(i)}
              onClick={()=>{ if(onClickPoint&&p.date) onClickPoint(p.date); }}
            />
          ))}
          {hovered!==null&&(()=>{
            const p=pts[hovered];
            const x=xPos(hovered), y=yPos(p.cumPnl);
            const isP=p.cumPnl>=0;
            const tw=158, th=62;
            const tx=Math.min(Math.max(x-tw/2,PL+2),W-PR-tw-2);
            const ty=y-th-14<PT?y+14:y-th-14;
            return (
              <g>
                <line x1={x} y1={PT} x2={x} y2={PT+innerH} stroke="#C9A84C" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.4"/>
                <line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.25"/>
                <circle cx={x} cy={y} r="5" fill={isP?T.green:T.red} stroke={svgBg} strokeWidth="2.5"/>
                <circle cx={x} cy={y} r="9" fill="none" stroke={isP?T.green:T.red} strokeWidth="0.8" strokeOpacity="0.35"/>
                <rect x={tx} y={ty} width={tw} height={th} rx="2" fill={tooltipBg} stroke={tooltipBdr} strokeWidth="1"/>
                <line x1={tx} y1={ty} x2={tx+tw} y2={ty} stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.5"/>
                <text x={tx+tw/2} y={ty+15} textAnchor="middle" fontSize="9" fill={labelCol} fontFamily="DM Mono,monospace">{fmtDate(p.date)}</text>
                <text x={tx+tw/2} y={ty+36} textAnchor="middle" fontSize="15" fontWeight="600" fill={isP?T.green:T.red} fontFamily="DM Mono,monospace">{fmtVal(p.cumPnl)}</text>
                <text x={tx+tw/2} y={ty+52} textAnchor="middle" fontSize="8" fill={labelCol} fontFamily="DM Mono,monospace">cliquer pour naviguer →</text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

function CapitalChart({ points, capitalNum, dark=false, T={} }) {
  const gridColor   = dark ? "#2a3050"  : "#e2e8f0";
  const labelColor  = dark ? "#94a3b8"  : "#64748b";
  const baseLineCol = dark ? "#475569"  : "#94a3b8";
  const tooltipBg   = dark ? "#1e2436"  : "#ffffff";
  const tooltipBdr  = dark ? "#334155"  : "#e2e8f0";
  const tooltipText = dark ? "#e2e8f0"  : "#1e293b";
  const svgBg       = dark ? "#111827"  : "#f8fafc";
  const W=800, H=250, PL=76, PR=24, PT=28, PB=44;
  const innerW=W-PL-PR, innerH=H-PT-PB;
  const capitals=points.map(p=>p.capital);
  const minC=Math.min(...capitals,capitalNum), maxC=Math.max(...capitals,capitalNum);
  const range = maxC - minC || capitalNum * 0.05;
  const pad = range * 0.18;
  const yMin=minC-pad, yMax=maxC+pad;
  const xPos=i=>PL+(i/(Math.max(points.length-1,1)))*innerW;
  const yPos=v=>PT+(1-(v-yMin)/(yMax-yMin))*innerH;
  const linePath=points.map((p,i)=>`${i===0?"M":"L"}${xPos(i).toFixed(1)},${yPos(p.capital).toFixed(1)}`).join(" ");
  const areaPath=linePath+` L${xPos(points.length-1).toFixed(1)},${(PT+innerH).toFixed(1)} L${xPos(0).toFixed(1)},${(PT+innerH).toFixed(1)} Z`;
  const isPos=points[points.length-1].capital>=capitalNum;
  const lineColor = isPos ? "#10b981" : "#ef4444";
  const baseY=yPos(capitalNum);
  const yTicks=Array.from({length:5},(_,i)=>yMin+(i/4)*(yMax-yMin));
  const [hovered,setHovered]=useState(null);
  return (
    <div style={{ width:"100%", overflowX:"auto", borderRadius:3, background:svgBg, border:`1px solid ${dark?"#1e2a3a":"#e2e8f0"}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block" }} onMouseLeave={()=>setHovered(null)}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={lineColor} stopOpacity={dark?".4":".25"}/>
            <stop offset="55%"  stopColor={lineColor} stopOpacity={dark?".1":".06"}/>
            <stop offset="100%" stopColor={lineColor} stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Grid */}
        {yTicks.map((v,i)=>{
          const y=yPos(v);
          const fmt=Math.abs(v)>=10000?`${(v/1000).toFixed(0)}k`:Math.abs(v)>=1000?`${(v/1000).toFixed(1)}k`:v.toFixed(0);
          return (
            <g key={i}>
              <line x1={PL} y1={y} x2={W-PR} y2={y} stroke={gridColor} strokeWidth="1"/>
              <text x={PL-8} y={y+4} textAnchor="end" fontSize="12" fontWeight="600" fill={labelColor} fontFamily="monospace">{fmt}</text>
            </g>
          );
        })}

        {/* Baseline capital départ */}
        {baseY>=PT && baseY<=PT+innerH && (
          <g>
            <line x1={PL} y1={baseY} x2={W-PR} y2={baseY} stroke={baseLineCol} strokeWidth="2" strokeDasharray="7,4"/>
            <rect x={PL+6} y={baseY-16} width={62} height={16} rx={4} fill={dark?"#1e2436":"#f1f5f9"}/>
            <text x={PL+37} y={baseY-4} textAnchor="middle" fontSize="10" fontWeight="700" fill={labelColor} fontFamily="monospace">Départ</text>
          </g>
        )}

        {/* Area + Line */}
        <path d={areaPath} fill="url(#chartGrad)"/>
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Dots */}
        {points.map((p,i)=>{
          if (points.length>18 && i%2!==0 && i!==points.length-1) return null;
          return <circle key={i} cx={xPos(i)} cy={yPos(p.capital)} r={i===points.length-1?5:3.5} fill={lineColor} stroke={svgBg} strokeWidth="2"/>;
        })}

        {/* X axis labels */}
        {points.map((p,i)=>{
          if (points.length>14 && i%3!==0 && i!==points.length-1) return null;
          return <text key={i} x={xPos(i)} y={H-10} textAnchor="middle" fontSize="11" fontWeight="600" fill={labelColor} fontFamily="monospace">{p.day===0?"Dép":p.day}</text>;
        })}

        {/* Invisible hover zones */}
        {points.map((p,i)=>(
          <rect key={i}
            x={i===0?xPos(0)-8:(xPos(i-1)+xPos(i))/2}
            y={PT}
            width={Math.max(i===points.length-1?innerW/points.length+8:(xPos(i+1)-xPos(i)),20)}
            height={innerH}
            fill="transparent"
            onMouseEnter={()=>setHovered(i)}
          />
        ))}

        {/* Tooltip */}
        {hovered!==null&&(()=>{
          const p=points[hovered], x=xPos(hovered), y=yPos(p.capital), diff=p.capital-capitalNum;
          const tx=Math.min(Math.max(x-62, PL+2), W-PR-130);
          const ty=Math.max(y-68, PT+2);
          return (
            <g>
              <line x1={x} y1={PT} x2={x} y2={PT+innerH} stroke={lineColor} strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity=".6"/>
              <circle cx={x} cy={y} r={7} fill={lineColor} stroke={svgBg} strokeWidth="3"/>
              <rect x={tx} y={ty} width={128} height={58} rx={10} fill={tooltipBg} stroke={tooltipBdr} strokeWidth="1.5" filter="drop-shadow(0 4px 16px rgba(0,0,0,.25))"/>
              <text x={tx+64} y={ty+17} textAnchor="middle" fontSize="11" fontWeight="700" fill={labelColor} fontFamily="monospace">{p.day===0?"Départ":`Jour ${p.day}`}</text>
              <text x={tx+64} y={ty+35} textAnchor="middle" fontSize="14" fontWeight="800" fill={tooltipText} fontFamily="monospace">{p.capital.toLocaleString("fr-FR",{maximumFractionDigits:0})} €</text>
              <text x={tx+64} y={ty+51} textAnchor="middle" fontSize="11" fontWeight="700" fill={lineColor} fontFamily="monospace">{diff>=0?"▲ +":"▼ −"}{Math.abs(diff).toFixed(0)} €</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
