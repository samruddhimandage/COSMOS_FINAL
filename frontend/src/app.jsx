import { useEffect, useState } from "react";
import {
  getSatellites,
  getLatestTelemetry,
  getHistoricalTelemetry,
  getActiveAlerts,
} from "./services/api.js";

import TelemetryChart from "./components/TelemetryChart.jsx";
import ActiveAlerts from "./components/ActiveAlerts.jsx";

import {
  Activity,
  Bell,
  ChevronDown,
  CircleDot,
  Command,
  Cpu,
  Crosshair,
  Gauge,
  LayoutDashboard,
  Radio,
  Satellite,
  Settings,
  ShieldCheck,
  Signal,
  Sun,
  Thermometer,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Database,
  Server,
  BrainCircuit,
} from "lucide-react";

import "./App.css";

const navigation = [
  { label: "Mission Overview", icon: LayoutDashboard },
  { label: "Satellite Fleet", icon: Satellite },
  { label: "Telemetry Analytics", icon: Activity },
  { label: "Mission Intelligence", icon: Crosshair },
];

const secondaryNavigation = [
  { label: "Alerts & Events", icon: Bell },
  { label: "System Health", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

function Sidebar({ activePage, onNavigate }) {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Satellite size={23} />
        </div>
        <div>
          <div className="brand-name">COSMOS</div>
          <div className="brand-subtitle">MISSION INTELLIGENCE</div>
        </div>
      </div>

      <div className="workspace-wrapper" style={{ position: "relative" }}>
        <button
          type="button"
          className="workspace"
          aria-expanded={workspaceOpen}
          aria-label="Open Mission Control navigation"
          onClick={() => setWorkspaceOpen((open) => !open)}
        >
          <div className="workspace-icon">
            <Command size={17} />
          </div>
          <div className="workspace-info">
            <span>Mission Control</span>
            <small>Development environment</small>
          </div>
          <ChevronDown
            size={15}
            style={{ transform: workspaceOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 160ms ease" }}
          />
        </button>

        {workspaceOpen && (
          <div className="workspace-menu" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50, padding: 6, border: "1px solid #263b54", borderRadius: 10, background: "#101c2d", boxShadow: "0 12px 28px rgba(0,0,0,.35)" }}>
            {["Mission Overview", "Satellite Fleet", "Telemetry Analytics", "Mission Intelligence", "Alerts & Events", "System Health", "Settings"].map((page) => (
              <button
                type="button"
                key={page}
                className={activePage === page ? "workspace-menu-item selected" : "workspace-menu-item"}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", border: 0, borderRadius: 6, background: activePage === page ? "#183653" : "transparent", color: "#dcecff", cursor: "pointer" }}
                onClick={() => {
                  onNavigate(page);
                  setWorkspaceOpen(false);
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="nav-section">
        <span className="nav-heading">OPERATIONS</span>
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              className={`nav-item ${activePage === item.label ? "active" : ""}`}
              key={item.label}
              onClick={() => onNavigate(item.label)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {activePage === item.label && (
                <span className="active-indicator" />
              )}
            </button>
          );
        })}
      </div>

      <div className="nav-section secondary-nav">
        <span className="nav-heading">SYSTEM</span>
        {secondaryNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              className={`nav-item ${activePage === item.label ? "active" : ""}`}
              key={item.label}
              onClick={() => onNavigate(item.label)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {activePage === item.label && (
                <span className="active-indicator" />
              )}
            </button>
          );
        })}
      </div>

      <div className="sidebar-bottom">
        <div className="connection-card">
          <div className="connection-heading">
            <span className="connection-dot" />
            SYSTEM STATUS
          </div>
          <strong>Monitoring Ready</strong>
          <small>Local development mode</small>
        </div>

        <div className="user-profile">
          <div className="user-avatar">C</div>
          <div className="user-info">
            <strong>Mission Engineer</strong>
            <small>Administrator</small>
          </div>
          <Settings size={17} />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ activePage, onNavigate }) {
  return (
    <header className="topbar">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button
          type="button"
          className="breadcrumb-link"
          style={{ background: "none", border: 0, padding: 0, color: "inherit", font: "inherit", cursor: "pointer" }}
          onClick={() => onNavigate("Mission Overview")}
          title="Return to Mission Overview"
        >
          Operations
        </button>
        <span className="breadcrumb-divider">/</span>
        <button
          type="button"
          className="breadcrumb-current"
          style={{ background: "none", border: 0, padding: 0, color: "inherit", font: "inherit", fontWeight: 600, cursor: "pointer" }}
          onClick={() => onNavigate(activePage)}
          aria-current="page"
          title={`Current page: ${activePage}`}
        >
          {activePage}
        </button>
      </nav>

      <div className="topbar-actions">
        <div className="environment-badge">
          <CircleDot size={12} />
          SIMULATION ENVIRONMENT
        </div>

        <div className="topbar-divider" />

        <div className="operator">
          <div className="operator-avatar">ME</div>
          <div>
            <strong>Mission Engineer</strong>
            <small>Control Desk 01</small>
          </div>
          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <section className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow || "COSMOS / CONTROL CENTER"}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="mission-reference">
        <span>MISSION REFERENCE</span>
        <strong>CMS-2026-001</strong>
      </div>
    </section>
  );
}

function MetricCard({ title, value, unit, icon: Icon, status, color }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <div className={`metric-icon ${color}`}>
          <Icon size={19} />
        </div>
        <span className="metric-status">{status}</span>
      </div>
      <div className="metric-title">{title}</div>
      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>
      <div className="metric-footer">
        <span className="metric-live-dot" />
        Latest available reading
      </div>
    </article>
  );
}

function SatelliteOverview({ satellite, telemetry }) {
  return (
    <section className="panel satellite-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">SPACECRAFT PROFILE</span>
          <h2>Satellite Overview</h2>
        </div>
        <span className="status-pill">
          <span className="status-dot" />
          {satellite?.status || "UNKNOWN"}
        </span>
      </div>

      <div className="satellite-visual">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <div className="satellite-core">
          <Satellite size={48} strokeWidth={1.2} />
        </div>
        <span className="orbit-label label-one">ORBITAL PATH</span>
        <span className="orbit-label label-two">COSMOS-01</span>
      </div>

      <div className="satellite-identity">
        <div>
          <h3>{satellite?.satellite_name || "Loading satellite..."}</h3>
          <p>
            {satellite?.satellite_code || "--"}
            {" · "}
            {satellite?.mission_type || "Mission information unavailable"}
          </p>
        </div>
        <span className="identity-tag">DEMO MISSION</span>
      </div>

      <div className="satellite-details">
        <div>
          <span>ALTITUDE</span>
          <strong>{telemetry?.altitude ?? "--"} <small>km</small></strong>
        </div>
        <div>
          <span>PAYLOAD</span>
          <strong>{telemetry?.payload_status ?? "--"}</strong>
        </div>
        <div>
          <span>MISSION STATE</span>
          <strong className="text-success">{satellite?.status || "--"}</strong>
        </div>
      </div>
    </section>
  );
}

function TelemetryPanel({ telemetry, loading }) {
  const formatValue = (value) =>
    value === null || value === undefined ? "--" : Number(value).toFixed(2);

  const dataStatus = loading
    ? "Loading..."
    : telemetry
      ? "Live data"
      : "Awaiting data";

  return (
    <section className="panel telemetry-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">SPACECRAFT INSTRUMENTATION</span>
          <h2>Telemetry Parameters</h2>
        </div>
      </div>

      <div className="telemetry-grid">
        <MetricCard title="Battery Voltage" value={formatValue(telemetry?.battery_voltage)} unit="V" icon={Zap} status={dataStatus} color="blue" />
        <MetricCard title="Battery Level" value={formatValue(telemetry?.battery_percentage)} unit="%" icon={Gauge} status={dataStatus} color="green" />
        <MetricCard title="Temperature" value={formatValue(telemetry?.temperature)} unit="°C" icon={Thermometer} status={dataStatus} color="orange" />
        <MetricCard title="Solar Power" value={formatValue(telemetry?.solar_power)} unit="W" icon={Sun} status={dataStatus} color="purple" />
        <MetricCard title="Signal Strength" value={formatValue(telemetry?.signal_strength)} unit="%" icon={Signal} status={dataStatus} color="cyan" />
        <MetricCard title="Altitude" value={formatValue(telemetry?.altitude)} unit="km" icon={Radio} status={dataStatus} color="blue" />
      </div>
    </section>
  );
}

function MissionOverviewPage({ satellites, satellite, telemetry, historicalTelemetry, activeAlerts, loading }) {
  return (
    <>
      <PageHeading
        title="Mission Overview"
        description="Monitor spacecraft health, telemetry and mission operations from one control interface."
      />

      <section className="overview-strip">
        <div className="overview-item">
          <span>REGISTERED SATELLITES</span>
          <strong>{String(satellites.length).padStart(2, "0")}</strong>
          <small>Registered spacecraft</small>
        </div>
        <div className="overview-item">
          <span>ACTIVE MISSIONS</span>
          <strong>{satellites.filter((item) => item.status === "ACTIVE").length.toString().padStart(2, "0")}</strong>
          <small>Based on satellite status</small>
        </div>
        <div className="overview-item">
          <span>DATA PIPELINE</span>
          <strong className="text-success">{telemetry ? "READY" : loading ? "LOADING" : "ERROR"}</strong>
          <small>Backend connection</small>
        </div>
        <div className="overview-item">
          <span>MONITORING MODE</span>
          <strong>SIMULATED</strong>
          <small>Local telemetry source</small>
        </div>
      </section>

      <div className="dashboard-grid">
        <SatelliteOverview satellite={satellite} telemetry={telemetry} />
        <TelemetryPanel telemetry={telemetry} loading={loading} />
      </div>

      <TelemetryChart records={historicalTelemetry} loading={loading} />
      <ActiveAlerts alerts={activeAlerts} />
    </>
  );
}

function SatelliteFleetPage({ satellites, loading }) {
  return (
    <>
      <PageHeading
        title="Satellite Fleet"
        eyebrow="COSMOS / SPACECRAFT REGISTRY"
        description="Registered spacecraft and their current mission status."
      />
      <section className="panel" style={{ padding: 22, marginBottom: 20 }}>
        <div className="panel-heading">
          <div>
            <span className="eyebrow">FLEET INVENTORY</span>
            <h2>Registered Satellites</h2>
            <p>{satellites.length} spacecraft registered in the COSMOS database</p>
          </div>
          <span className="status-pill">{loading ? "SYNCING" : "DATABASE DATA"}</span>
        </div>

        {loading ? (
          <p>Loading satellite records...</p>
        ) : satellites.length === 0 ? (
          <p>No satellite records were returned by the backend.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr>
                  {["ID", "SATELLITE", "SATELLITE CODE", "MISSION TYPE", "LAUNCH DATE", "STATUS"].map((heading) => (
                    <th key={heading} style={{ padding: "14px 12px", borderBottom: "1px solid #26364a", color: "#8ba8c8", fontSize: 11, letterSpacing: 1 }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {satellites.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: 14, borderBottom: "1px solid #1d2b3d" }}>{item.id}</td>
                    <td style={{ padding: 14, borderBottom: "1px solid #1d2b3d", fontWeight: 600 }}>{item.satellite_name || "--"}</td>
                    <td style={{ padding: 14, borderBottom: "1px solid #1d2b3d" }}>{item.satellite_code || "--"}</td>
                    <td style={{ padding: 14, borderBottom: "1px solid #1d2b3d" }}>{item.mission_type || "--"}</td>
                    <td style={{ padding: 14, borderBottom: "1px solid #1d2b3d" }}>{item.launch_date || "--"}</td>
                    <td style={{ padding: 14, borderBottom: "1px solid #1d2b3d" }}>
                      <span className="status-pill">{item.status || "UNKNOWN"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function TelemetryAnalyticsPage({ historicalTelemetry, loading }) {
  return (
    <>
      <PageHeading
        title="Telemetry Analytics"
        eyebrow="COSMOS / DATA ANALYSIS"
        description="Explore historical spacecraft parameters and telemetry trends."
      />
      <TelemetryChart records={historicalTelemetry} loading={loading} />
    </>
  );
}

function MissionIntelligencePage({ satellite, telemetry, activeAlerts }) {
  return (
    <>
      <PageHeading
        title="Mission Intelligence"
        eyebrow="COSMOS / DECISION SUPPORT"
        description="A mission-context workspace for interpreting spacecraft state and preparing operational decisions."
      />

      <section className="overview-strip">
        <div className="overview-item">
          <span>MONITORED SPACECRAFT</span>
          <strong>{satellite?.satellite_code || "--"}</strong>
          <small>{satellite?.satellite_name || "No satellite selected"}</small>
        </div>
        <div className="overview-item">
          <span>MISSION STATUS</span>
          <strong>{satellite?.status || "UNKNOWN"}</strong>
          <small>Latest registry status</small>
        </div>
        <div className="overview-item">
          <span>ACTIVE ALERTS</span>
          <strong>{activeAlerts.length}</strong>
          <small>Current active alert records</small>
        </div>
        <div className="overview-item">
          <span>BATTERY LEVEL</span>
          <strong>{telemetry?.battery_percentage ?? "--"}%</strong>
          <small>Latest telemetry reading</small>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel" style={{ padding: 22 }}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">INTELLIGENCE WORKFLOW</span>
              <h2>Mission Decision Cycle</h2>
            </div>
            <BrainCircuit size={25} />
          </div>
          {[
            ["01", "OBSERVE", "Collect current telemetry and active alerts."],
            ["02", "UNDERSTAND", "Interpret spacecraft state in mission context."],
            ["03", "PREDICT", "Connect to validated AI and digital-twin outputs when Group 2 is integrated."],
            ["04", "DECIDE", "Prepare explainable recommendations for engineer review."],
            ["05", "LEARN", "Record approved outcomes for future analysis."],
          ].map(([number, title, description]) => (
            <div key={number} style={{ display: "flex", gap: 16, padding: "15px 0", borderBottom: "1px solid #223247" }}>
              <strong style={{ color: "#48bfff" }}>{number}</strong>
              <div>
                <strong>{title}</strong>
                <p style={{ margin: "5px 0 0", color: "#8ba8c8" }}>{description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="panel" style={{ padding: 22 }}>
          <div className="panel-heading">
            <div>
              <span className="eyebrow">CURRENT MISSION CONTEXT</span>
              <h2>Telemetry Snapshot</h2>
            </div>
            <Crosshair size={23} />
          </div>
          <p>Battery: <strong>{telemetry?.battery_percentage ?? "--"}%</strong></p>
          <p>Temperature: <strong>{telemetry?.temperature ?? "--"} °C</strong></p>
          <p>Signal strength: <strong>{telemetry?.signal_strength ?? "--"}%</strong></p>
          <p>Altitude: <strong>{telemetry?.altitude ?? "--"} km</strong></p>
          <div style={{ marginTop: 22, padding: 14, border: "1px solid #30435b", borderRadius: 8, color: "#9db7d4" }}>
            This is the foundation workspace. AI predictions, digital-twin simulations and recommendation execution are not connected yet. No spacecraft commands are sent from this prototype.
          </div>
        </section>
      </div>
    </>
  );
}

function AlertsEventsPage({ activeAlerts, loading }) {
  return (
    <>
      <PageHeading
        title="Alerts & Events"
        eyebrow="COSMOS / MISSION SAFETY"
        description="Review active spacecraft health warnings and critical events."
      />
      <ActiveAlerts alerts={activeAlerts} />
      <section className="panel" style={{ padding: 20, marginTop: 18 }}>
        <div className="panel-heading">
          <div>
            <span className="eyebrow">ALERT MONITOR</span>
            <h2>Current alert query</h2>
            <p>{loading ? "Refreshing alert data..." : `${activeAlerts.length} active alert(s) returned by the API.`}</p>
          </div>
          <AlertTriangle size={24} />
        </div>
        <p style={{ color: "#8ba8c8" }}>This page currently displays ACTIVE alerts. Acknowledgement controls and historical/resolved alert filtering can be added after the alert workflow is tested.</p>
      </section>
    </>
  );
}

function SystemHealthPage({ loading, connectionError, telemetry, satellites }) {
  const connected = !loading && !connectionError && satellites.length > 0 && telemetry !== null;
  const healthItems = [
    { name: "Backend REST API", detail: "Satellite and telemetry API requests", icon: Server, ok: connected },
    { name: "PostgreSQL data access", detail: "Database access verified through returned records", icon: Database, ok: connected },
    { name: "Telemetry feed", detail: "Latest telemetry record available", icon: Activity, ok: Boolean(telemetry) && !connectionError },
  ];

  return (
    <>
      <PageHeading
        title="System Health"
        eyebrow="COSMOS / INFRASTRUCTURE STATUS"
        description="Connection status inferred from the latest successful COSMOS API and database reads."
      />
      <section className="panel" style={{ padding: 22 }}>
        <div className="panel-heading">
          <div>
            <span className="eyebrow">SERVICE STATUS</span>
            <h2>Platform Components</h2>
          </div>
          <span className="status-pill">{connected ? "OPERATIONAL" : "CHECK REQUIRED"}</span>
        </div>
        {healthItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: "1px solid #223247" }}>
              <Icon size={22} />
              <div style={{ flex: 1 }}>
                <strong>{item.name}</strong>
                <p style={{ margin: "5px 0 0", color: "#8ba8c8" }}>{item.detail}</p>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: item.ok ? "#22d3a6" : "#f4b75e" }}>
                {item.ok ? <CheckCircle2 size={17} /> : <AlertTriangle size={17} />}
                {item.ok ? "CONNECTED" : loading ? "CHECKING" : "NOT VERIFIED"}
              </span>
            </div>
          );
        })}
        {connectionError && (
          <p role="alert" style={{ color: "#ff7777", marginTop: 18 }}>Connection error: {connectionError}</p>
        )}
        <p style={{ color: "#8ba8c8", marginTop: 18 }}>
          Note: this page does not independently inspect the PostgreSQL server process. Database status is marked connected only when the backend successfully returns database-backed records.
        </p>
      </section>
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <PageHeading
        title="Settings"
        eyebrow="COSMOS / CONFIGURATION"
        description="Prototype environment information and current platform configuration."
      />
      <section className="panel" style={{ padding: 22 }}>
        <div className="panel-heading">
          <div>
            <span className="eyebrow">APPLICATION CONFIGURATION</span>
            <h2>Environment Settings</h2>
          </div>
          <Settings size={24} />
        </div>
        {[
          ["Application", "COSMOS Mission Intelligence Platform"],
          ["Environment", "Local development / simulation"],
          ["Telemetry refresh", "Every 5 seconds"],
          ["Backend", "Python FastAPI"],
          ["Database", "PostgreSQL"],
          ["Frontend", "React + Vite"],
          ["Operational safety", "Simulation only — no real spacecraft commands"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: "1px solid #223247" }}>
            <span style={{ color: "#8ba8c8" }}>{label}</span>
            <strong style={{ textAlign: "right" }}>{value}</strong>
          </div>
        ))}
        <p style={{ color: "#8ba8c8", marginTop: 18 }}>
          These values describe the current prototype. Editable user preferences and configuration persistence are not implemented in this version.
        </p>
      </section>
    </>
  );
}

function App() {
  const [satellites, setSatellites] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [historicalTelemetry, setHistoricalTelemetry] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState("");
  const [activePage, setActivePage] = useState("Mission Overview");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const satelliteData = await getSatellites();

        if (!satelliteData.length) {
          throw new Error("No registered satellites found.");
        }

        const satelliteId = satelliteData[0].id;
        const [latestData, historyData, alertsData] = await Promise.all([
          getLatestTelemetry(satelliteId),
          getHistoricalTelemetry(satelliteId, 100),
          getActiveAlerts(satelliteId, 100),
        ]);

        if (isMounted) {
          setSatellites(satelliteData);
          setTelemetry(latestData);
          setHistoricalTelemetry(historyData);
          setActiveAlerts(alertsData);
          setConnectionError("");
          setLoading(false);
        }
      } catch (error) {
        console.error("COSMOS data loading error:", error);
        if (isMounted) {
          setConnectionError(error.message || "Unable to load COSMOS data.");
          setLoading(false);
        }
      }
    }

    loadDashboardData();
    const refreshInterval = setInterval(loadDashboardData, 5000);

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  const satellite = satellites[0] || null;

  function renderActivePage() {
    switch (activePage) {
      case "Satellite Fleet":
        return <SatelliteFleetPage satellites={satellites} loading={loading} />;
      case "Telemetry Analytics":
        return <TelemetryAnalyticsPage historicalTelemetry={historicalTelemetry} loading={loading} />;
      case "Mission Intelligence":
        return <MissionIntelligencePage satellite={satellite} telemetry={telemetry} activeAlerts={activeAlerts} />;
      case "Alerts & Events":
        return <AlertsEventsPage activeAlerts={activeAlerts} loading={loading} />;
      case "System Health":
        return <SystemHealthPage loading={loading} connectionError={connectionError} telemetry={telemetry} satellites={satellites} />;
      case "Settings":
        return <SettingsPage />;
      case "Mission Overview":
      default:
        return <MissionOverviewPage satellites={satellites} satellite={satellite} telemetry={telemetry} historicalTelemetry={historicalTelemetry} activeAlerts={activeAlerts} loading={loading} />;
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="main-area">
        <Topbar activePage={activePage} onNavigate={setActivePage} />

        <div className="dashboard-content">
          {connectionError && (
            <div role="alert" style={{ padding: 12, marginBottom: 16, border: "1px solid #8b3434", borderRadius: 8, color: "#ff9999" }}>
              COSMOS connection issue: {connectionError}
            </div>
          )}

          {renderActivePage()}

          <footer className="dashboard-footer">
            <span>
              <Cpu size={14} />
              COSMOS Mission Intelligence Platform
            </span>
            <span>DEVELOPMENT BUILD · SIMULATION ONLY</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
