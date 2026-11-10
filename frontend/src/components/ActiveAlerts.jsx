
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

function ActiveAlerts({ alerts = [] }) {
  return (
    <section className="panel alerts-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">MISSION SAFETY</span>
          <h2>Active Alerts</h2>
          <p>Satellite health warnings and critical events</p>
        </div>

        <div className="alert-count">
          {alerts.length} ACTIVE
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="alerts-empty">
          <CheckCircle2 size={28} />
          <div>
            <strong>No active alerts</strong>
            <p>All monitored parameters are within configured limits.</p>
          </div>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => {
            const isCritical =
              alert.severity?.toUpperCase() === "CRITICAL";

            return (
              <div
                className={`alert-item ${
                  isCritical ? "critical" : "warning"
                }`}
                key={alert.id}
              >
                <div className="alert-icon">
                  {isCritical ? (
                    <ShieldAlert size={21} />
                  ) : (
                    <AlertTriangle size={21} />
                  )}
                </div>

                <div className="alert-details">
                  <strong>
                    {alert.alert_type.replaceAll("_", " ")}
                  </strong>

                  <p>{alert.message}</p>

                  <span>
                    {alert.parameter_name}: {alert.parameter_value}
                    {alert.threshold_value != null
                      ? ` (Threshold: ${alert.threshold_value})`
                      : ""}
                  </span>
                </div>

                <div className="alert-severity">
                  {alert.severity}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ActiveAlerts;
