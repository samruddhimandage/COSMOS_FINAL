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
} from "lucide-react";

import "./App.css";

const navigation = [
  { label: "Mission Overview", icon: LayoutDashboard, active: true },
  { label: "Satellite Fleet", icon: Satellite },
  { label: "Telemetry Analytics", icon: Activity },
  { label: "Mission Intelligence", icon: Crosshair },
];

const secondaryNavigation = [
  { label: "Alerts & Events", icon: Bell },
  { label: "System Health", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

function Sidebar() {
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

      <div className="workspace">
        <div className="workspace-icon">
          <Command size={17} />
        </div>
        <div className="workspace-info">
          <span>Mission Control</span>
          <small>Development environment</small>
        </div>
        <ChevronDown size={15} />
      </div>

      <div className="nav-section">
        <span className="nav-heading">OPERATIONS</span>
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              className={`nav-item ${item.active ? "active" : ""}`}
              key={item.label}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.active && <span className="active-indicator" />}
            </button>
          );
        })}
      </div>

      <div className="nav-section secondary-nav">
        <span className="nav-heading">SYSTEM</span>
        {secondaryNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <button className="nav-item" key={item.label}>
              <Icon size={18} />
              <span>{item.label}</span>
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

function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Operations</span>
        <span className="breadcrumb-divider">/</span>
        <strong>Mission Overview</strong>
      </div>

      <div className="topbar-actions">
        <div className="environment-badge">
          <CircleDot size={12} />
          SIMULATION ENVIRONMENT
        </div>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

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
          <strong>
            {telemetry?.altitude ?? "--"} <small>km</small>
          </strong>
        </div>
        <div>
          <span>PAYLOAD</span>
          <strong>{telemetry?.payload_status ?? "--"}</strong>
        </div>
        <div>
          <span>MISSION STATE</span>
          <strong className="text-success">
            {satellite?.status || "--"}
          </strong>
        </div>
      </div>
    </section>
  );
}


function TelemetryPanel({ telemetry, loading }) {
  const formatValue = (value) =>
    value === null || value === undefined
      ? "--"
      : Number(value).toFixed(2);

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
        <button className="panel-action">
          <Gauge size={15} />
          Detailed view
        </button>
      </div>

      <div className="telemetry-grid">
        <MetricCard
          title="Battery Voltage"
          value={formatValue(telemetry?.battery_voltage)}
          unit="V"
          icon={Zap}
          status={dataStatus}
          color="blue"
        />

        <MetricCard
          title="Battery Level"
          value={formatValue(telemetry?.battery_percentage)}
          unit="%"
          icon={Gauge}
          status={dataStatus}
          color="green"
        />

        <MetricCard
          title="Temperature"
          value={formatValue(telemetry?.temperature)}
          unit="°C"
          icon={Thermometer}
          status={dataStatus}
          color="orange"
        />

        <MetricCard
          title="Solar Power"
          value={formatValue(telemetry?.solar_power)}
          unit="W"
          icon={Sun}
          status={dataStatus}
          color="purple"
        />

        <MetricCard
          title="Signal Strength"
          value={formatValue(telemetry?.signal_strength)}
          unit="%"
          icon={Signal}
          status={dataStatus}
          color="cyan"
        />

        <MetricCard
          title="Altitude"
          value={formatValue(telemetry?.altitude)}
          unit="km"
          icon={Radio}
          status={dataStatus}
          color="blue"
        />
      </div>
    </section>
  );
}


function AnalyticsPlaceholder() {
  return (
    <section className="panel analytics-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">HISTORICAL TELEMETRY</span>
          <h2>Telemetry Analytics</h2>
        </div>
        <span className="coming-soon">CHART MODULE</span>
      </div>

      <div className="analytics-empty">
        <div className="analytics-icon">
          <Activity size={27} />
        </div>
        <h3>Telemetry visualization workspace</h3>
        <p>
          Historical parameter trends and live telemetry charts will
          appear here once the data connection is configured.
        </p>
      </div>
    </section>
  );
}


function App() {
  const [satellites, setSatellites] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [historicalTelemetry, setHistoricalTelemetry] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const satelliteData = await getSatellites();

        if (!satelliteData.length) {
          throw new Error("No registered satellites found.");
        }

        const latestData = await getLatestTelemetry(
          satelliteData[0].id
        );

        const historyData = await getHistoricalTelemetry(
            satelliteData[0].id,
            100
        );

        const alertsData = await getActiveAlerts(
            satelliteData[0].id,
            100
          );

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
          setConnectionError(error.message);
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    const refreshInterval = setInterval(
      loadDashboardData,
      5000
    );

    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  const satellite = satellites[0] || null;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-area">
        <Topbar />

        <div className="dashboard-content">
          <section className="page-heading">
            <div>
              <span className="eyebrow">COSMOS / CONTROL CENTER</span>
              <h1>Mission Overview</h1>
              <p>
                Monitor spacecraft health, telemetry and mission
                operations from one control interface.
              </p>
            </div>

            <div className="mission-reference">
              <span>MISSION REFERENCE</span>
              <strong>CMS-2026-001</strong>
            </div>
          </section>

          {connectionError && (
            <div role="alert">
              COSMOS connection issue: {connectionError}
            </div>
          )}

          <section className="overview-strip">
            <div className="overview-item">
              <span>REGISTERED SATELLITES</span>
              <strong>
                {String(satellites.length).padStart(2, "0")}
              </strong>
              <small>Registered spacecraft</small>
            </div>

            <div className="overview-item">
              <span>ACTIVE MISSIONS</span>
              <strong>
                {satellites.filter(
                  (item) => item.status === "ACTIVE"
                ).length.toString().padStart(2, "0")}
              </strong>
              <small>Based on satellite status</small>
            </div>

            <div className="overview-item">
              <span>DATA PIPELINE</span>
              <strong className="text-success">
                {telemetry ? "READY" : loading ? "LOADING" : "ERROR"}
              </strong>
              <small>Backend connection</small>
            </div>

            <div className="overview-item">
              <span>MONITORING MODE</span>
              <strong>SIMULATED</strong>
              <small>Local telemetry source</small>
            </div>
          </section>

          <div className="dashboard-grid">
            <SatelliteOverview
              satellite={satellite}
              telemetry={telemetry}
            />

            <TelemetryPanel
              telemetry={telemetry}
              loading={loading}
            />
          </div>

          <TelemetryChart
            records={historicalTelemetry}
            loading={loading}
        />
        <ActiveAlerts alerts={activeAlerts} />

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
