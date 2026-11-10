# COSMOS API Documentation

**Project:** COSMOS — Cognitive Mission Intelligence Platform  
**Module:** Group 1 — COSMOS Foundation  
**API Framework:** FastAPI  
**Database:** PostgreSQL  
**API Architecture:** REST

---

## 1. Project Overview

COSMOS (Cognitive Mission Intelligence Platform) provides standardized satellite information, telemetry data, and alert information through REST APIs.

The APIs allow other COSMOS modules to retrieve satellite information and telemetry records for monitoring, analysis, prediction, digital twin processing, and mission decision support.

COSMOS is designed as an AI-assisted mission intelligence layer that augments existing mission operations infrastructure.

The current development system uses simulated satellite telemetry.

## 2. Backend Technology

| Component | Technology |
|---|---|
| Programming Language | Python |
| Backend Framework | FastAPI |
| Database | PostgreSQL |
| Database Integration | SQLAlchemy |
| PostgreSQL Driver | Psycopg |
| Data Validation | Pydantic |
| API Architecture | REST |
| Data Exchange Format | JSON |

## 3. Base URL

### Local development URL

```text
http://127.0.0.1:8000
```

### Interactive API documentation

```text
http://127.0.0.1:8000/docs
```

The interactive documentation allows developers to inspect endpoints, provide query parameters, execute requests, and examine responses.

**Note:** The local URL is for development. Other teams should use the deployed backend URL or their configured network-accessible development environment when integrating.

## 4. Satellite API

### 4.1 Get All Satellites

| Property | Description |
|---|---|
| Method | GET |
| Endpoint | `/satellites/` |
| Purpose | Retrieve registered satellite information |
| Response format | JSON |

### Response fields

| Field | Description |
|---|---|
| id | Unique database identifier |
| satellite_code | Satellite identification code |
| satellite_name | Satellite name |
| mission_type | Type of satellite mission |
| launch_date | Launch date |
| status | Satellite operational status |
| created_at | Database record creation timestamp |

### Example response

```json
[
  {
    "id": 1,
    "satellite_code": "COSMOS-DEMO-01",
    "satellite_name": "COSMOS Demo Satellite",
    "mission_type": "Earth Observation",
    "launch_date": "2025-01-15",
    "status": "ACTIVE"
  }
]
```

The example illustrates the response structure. Actual fields and values are determined by the running backend.

## 5. Telemetry API

### 5.1 Get Telemetry Records

| Property | Description |
|---|---|
| Method | GET |
| Endpoint | `/telemetry/` |
| Purpose | Retrieve historical telemetry records |
| Response format | JSON |

### Query parameters

| Parameter | Required | Description |
|---|---|---|
| limit | No | Maximum number of records |
| satellite_id | No | Filter records by satellite database ID |
| start_time | No | Beginning of the requested time range |
| end_time | No | End of the requested time range |

Example request:

```text
GET /telemetry/?satellite_id=1&limit=100
```

Example date-filtered request:

```text
GET /telemetry/?satellite_id=1&start_time=2026-11-10T00:00:00Z&end_time=2026-11-11T00:00:00Z
```

Timestamps should include timezone information. The backend validates date-range parameters.

### 5.2 Get Latest Telemetry

| Property | Description |
|---|---|
| Method | GET |
| Endpoint | `/telemetry/latest` |
| Required parameter | satellite_id |
| Purpose | Retrieve the latest telemetry record for a satellite |
| Response format | JSON |

Example request:

```text
GET /telemetry/latest?satellite_id=1
```

If no telemetry record is found for the requested satellite, the API returns HTTP 404.

## 6. Standard Telemetry Data Format

Each telemetry record contains the following fields:

| Field | Description | Unit / Format |
|---|---|---|
| id | Unique telemetry record identifier | Integer |
| satellite_id | Associated satellite database ID | Integer |
| timestamp | Time of telemetry measurement | Timezone-aware timestamp |
| battery_voltage | Battery voltage | Volts (V) |
| battery_current | Battery current | Amperes (A) |
| battery_percentage | Remaining battery percentage | Percentage (%) |
| temperature | Satellite temperature reading | Degrees Celsius (°C) |
| solar_power | Solar power measurement | Watts (W) |
| altitude | Satellite altitude | Kilometres (km) |
| payload_status | Payload operating status | Text |
| signal_strength | Communication signal strength | Percentage (%) |

### Example telemetry response

```json
{
  "id": 101,
  "satellite_id": 1,
  "timestamp": "2026-11-10T15:30:00Z",
  "battery_voltage": 12.5,
  "battery_current": 2.1,
  "battery_percentage": 85.0,
  "temperature": 28.5,
  "solar_power": 120.0,
  "altitude": 550.0,
  "payload_status": "ACTIVE",
  "signal_strength": 92.0
}
```

**Important:** This is an illustrative example of the telemetry structure. It is not a guarantee of actual measured values.

## 7. Alert API

COSMOS includes a threshold-based alert system that evaluates telemetry and generates alerts when defined conditions are met.

### 7.1 Get Alerts

| Property | Description |
|---|---|
| Method | GET |
| Endpoint | `/alerts/` |
| Purpose | Retrieve alert records |
| Response format | JSON |

### Query parameters

| Parameter | Required | Description |
|---|---|---|
| satellite_id | No | Filter alerts by satellite database ID |
| status | No | Filter alerts by status |
| limit | No | Maximum number of records |

Example:

```text
GET /alerts/?satellite_id=1&status=ACTIVE&limit=100
```

### 7.2 Update Alert Status

| Property | Description |
|---|---|
| Method | PATCH |
| Endpoint | `/alerts/{alert_id}` |
| Purpose | Update an alert's status |

Supported statuses:

- ACTIVE
- ACKNOWLEDGED
- RESOLVED

Example request:

```text
PATCH /alerts/1
```

Request body:

```json
{
  "status": "ACKNOWLEDGED"
}
```

The backend records the acknowledgement or resolution timestamp when the corresponding status is applied.

### 7.3 Alert Response Fields

| Field | Description |
|---|---|
| id | Unique alert identifier |
| satellite_id | Associated satellite ID |
| alert_type | Type of alert |
| severity | Alert severity |
| message | Alert description |
| parameter_name | Telemetry parameter associated with the alert |
| parameter_value | Observed parameter value |
| threshold_value | Configured alert threshold |
| status | Current alert status |
| created_at | Alert creation timestamp |
| acknowledged_at | Acknowledgement timestamp |
| resolved_at | Resolution timestamp |

### 7.4 Current Alert Rules

| Alert Type | Condition | Severity |
|---|---|---|
| LOW_BATTERY | Battery percentage below 30% | CRITICAL |
| HIGH_TEMPERATURE | Temperature above 45°C | WARNING |
| WEAK_SIGNAL | Signal strength below 40% | WARNING |

The alert service avoids creating duplicate active alerts for the same satellite and alert type. It resolves an existing alert when the corresponding telemetry parameter returns to its normal range.

These thresholds are prototype configuration values and should be reviewed by mission-domain experts before any operational use.

## 8. Standard API Conventions

- APIs use HTTP REST methods.
- Request and response data use JSON.
- Satellite identifiers refer to PostgreSQL satellite database IDs.
- Timestamps include timezone information.
- Telemetry records are stored in PostgreSQL.
- The current simulator generates telemetry periodically.
- The frontend retrieves updated information through periodic API polling.
- The current dashboard polling interval is 5 seconds.
- API endpoints are accessible through the configured backend base URL.

## 9. HTTP Status Codes and Error Handling

The backend uses HTTP status codes to communicate request results.

| HTTP Status | Meaning |
|---|---|
| 200 | Request successful |
| 404 | Requested telemetry or resource not found |
| 422 | Request validation error |
| 500 | Internal server error |

### Example: Telemetry not found

```json
{
  "detail": "No telemetry found for this satellite."
}
```

The exact error response depends on the endpoint and error condition.

Integrating modules should handle unsuccessful API responses and avoid assuming that every request will return data.

## 10. Integration with Other COSMOS Modules

### 10.1 Group 2 — AI and Digital Twin

Group 2 can use the COSMOS Foundation APIs to retrieve telemetry for:

- Satellite health monitoring
- Anomaly detection
- Time-series prediction
- Digital twin processing
- Telemetry-based analysis

Recommended data flow:

```text
COSMOS PostgreSQL
       |
       v
COSMOS Telemetry REST API
       |
       v
Group 2 AI Processing
       |
       v
Health Analysis / Anomaly Detection
       |
       v
Prediction and Digital Twin
```

Group 2 should use the standard telemetry field names and satellite identifiers provided by Group 1.

### 10.2 Mission Intelligence Module

The Mission Intelligence module can use the APIs for:

- Mission context retrieval
- Current satellite state
- Historical telemetry analysis
- Alert awareness
- Decision support
- Mission planning inputs

Recommended data flow:

```text
Group 1 Foundation APIs
          |
          v
Mission Context
          |
          v
Decision Engine
          |
          v
Mission Planning
          |
          v
Explainable Recommendations
```

Mission Intelligence recommendations should be based on available telemetry and validated inputs from other modules.

## 11. Integration Guidelines

For successful integration, all COSMOS teams should follow these conventions:

1. Use the existing satellite database ID when requesting satellite-specific telemetry.
2. Preserve the standard telemetry field names.
3. Use timezone-aware timestamps.
4. Handle missing data and API errors.
5. Avoid changing existing API response structures without coordinating with other teams.
6. Keep module-specific processing separate from the Group 1 foundation.
7. Document any new API endpoint or data field before integrating it into the shared system.
8. Coordinate API changes with all dependent teams.

### Proposed integration boundary

Group 1 provides the telemetry, satellite, and alert data foundation.

Group 2 processes telemetry to produce AI and digital twin outputs.

Mission Intelligence consumes relevant operational context and analysis outputs to support mission decisions.

New AI and mission intelligence APIs should be documented separately when implemented. They are not claimed as existing Group 1 endpoints.

## 12. Security and Operational Scope

The current COSMOS development system is a prototype using simulated telemetry.

- It does not connect to real spacecraft.
- It does not issue real spacecraft commands.
- The telemetry simulator is the current data source.
- Database credentials must remain private.
- Production deployment requires authentication, authorization, secure communications, and appropriate cybersecurity controls.
- Real mission infrastructure integration requires documented interfaces, permissions, cybersecurity approval, and extensive validation.
- Any future command-related workflow must remain simulation-only unless separately authorized and approved through appropriate operational procedures.

## 13. Current Development Status

### Implemented in Group 1

- [x] FastAPI backend
- [x] PostgreSQL database integration
- [x] Satellite database table
- [x] Telemetry database table
- [x] Alerts database table
- [x] Telemetry simulator
- [x] Satellite REST API
- [x] Telemetry REST API
- [x] Latest telemetry retrieval
- [x] Historical telemetry retrieval
- [x] Satellite-specific filtering
- [x] Date-range filtering
- [x] Threshold-based alert generation
- [x] Alert retrieval and status updates
- [x] React dashboard
- [x] Historical telemetry visualization
- [x] Live dashboard polling
- [x] GitHub project repository

### Planned for future integration

- AI-based anomaly detection
- Advanced satellite health prediction
- Digital twin integration
- Mission decision engine
- Explainable AI recommendations
- Advanced mission planning

These capabilities should be marked implemented only after their respective modules are developed and tested.

## 14. Repository Information

**Project:** COSMOS_FINAL

**GitHub Repository:**  
https://github.com/samruddhimandage/COSMOS_FINAL

**Main Branch:** `main`

**Documentation Location:**  
`documentation/api_documentation.md`

**Backend API Documentation:**  
http://127.0.0.1:8000/docs

---

## 15. Project Vision

COSMOS aims to create an integrated cognitive mission intelligence platform that connects telemetry monitoring, AI-assisted analysis, digital twin capabilities, and explainable mission decision support.

**COSMOS — Observe. Understand. Predict. Decide. Learn.**