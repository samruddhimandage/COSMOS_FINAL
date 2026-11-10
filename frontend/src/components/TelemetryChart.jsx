
import { useMemo, useState } from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PARAMETERS = {
  battery_voltage: {
    label: "Battery Voltage",
    unit: "V",
    color: "#38bdf8",
  },
  battery_percentage: {
    label: "Battery Level",
    unit: "%",
    color: "#34d399",
  },
  temperature: {
    label: "Temperature",
    unit: "°C",
    color: "#fbbf24",
  },
  solar_power: {
    label: "Solar Power",
    unit: "W",
    color: "#a78bfa",
  },
  signal_strength: {
    label: "Signal Strength",
    unit: "%",
    color: "#22d3ee",
  },
  altitude: {
    label: "Altitude",
    unit: "km",
    color: "#fb7185",
  },
};

function TelemetryChart({ records = [], loading = false }) {
  const [selectedParameter, setSelectedParameter] =
    useState("battery_voltage");

  const parameter = PARAMETERS[selectedParameter];

  // Convert database records into chart-friendly data
  const chartData = useMemo(() => {
    return [...records]
      .reverse()
      .map((record) => ({
        time: new Date(record.timestamp).toLocaleTimeString(),
        value:
          record[selectedParameter] == null
            ? null
            : Number(record[selectedParameter]),
      }))
      .filter((record) => record.value !== null);
  }, [records, selectedParameter]);

  return (
    <section className="panel analytics-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">HISTORICAL TELEMETRY</span>
          <h2>Telemetry Analytics</h2>
          <p>
            Historical spacecraft parameter analysis
          </p>
        </div>

        <div className="chart-controls">
          <label htmlFor="telemetry-parameter">
            Parameter
          </label>

          <select
            id="telemetry-parameter"
            value={selectedParameter}
            onChange={(event) =>
              setSelectedParameter(event.target.value)
            }
          >
            {Object.entries(PARAMETERS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chart-summary">
        <div>
          <span className="eyebrow">SELECTED PARAMETER</span>
          <strong>{parameter.label}</strong>
        </div>

        <div>
          <span className="eyebrow">DATA POINTS</span>
          <strong>{chartData.length}</strong>
        </div>

        <div>
          <span className="eyebrow">LATEST VALUE</span>
          <strong>
            {chartData.length > 0
              ? `${chartData[chartData.length - 1].value.toFixed(2)} ${parameter.unit}`
              : "--"}
          </strong>
        </div>
      </div>

      <div className="chart-container">
        {loading ? (
          <div className="chart-message">
            Loading historical telemetry...
          </div>
        ) : chartData.length === 0 ? (
          <div className="chart-message">
            No historical telemetry records available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 15,
                right: 25,
                left: 5,
                bottom: 10,
              }}
            >
              <CartesianGrid
                stroke="#26364b"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="#71849d"
                tick={{ fill: "#91a4bd", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />

              <YAxis
                stroke="#71849d"
                tick={{ fill: "#91a4bd", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={65}
                domain={["auto", "auto"]}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#101d30",
                  border: "1px solid #30445f",
                  borderRadius: "10px",
                  color: "#ffffff",
                }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value) => [
                  `${Number(value).toFixed(2)} ${parameter.unit}`,
                  parameter.label,
                ]}
              />

              <Line
                type="monotone"
                dataKey="value"
                name={parameter.label}
                stroke={parameter.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: parameter.color,
                  strokeWidth: 2,
                  fill: "#101d30",
                }}
                connectNulls
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

export default TelemetryChart;
