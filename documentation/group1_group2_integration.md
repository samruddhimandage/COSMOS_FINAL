# COSMOS — Group 1 to Group 2 Integration Document

**Project:** COSMOS — Cognitive Mission Intelligence Platform  
**Integration:** Group 1 (COSMOS Foundation) → Group 2 (AI and Digital Twin)  
**Document Type:** Technical Integration Handover  
**Status:** Group 1 Foundation Implemented and Tested

---

## 1. Purpose

This document defines how Group 2 can connect its AI and Digital Twin module to the COSMOS Foundation developed by Group 1.

Group 1 provides the backend infrastructure, PostgreSQL database, telemetry storage, REST APIs, telemetry simulator, and monitoring dashboard.

Group 2 will use the telemetry and satellite information provided by Group 1 for AI-based analysis, satellite health monitoring, anomaly detection, prediction, and digital twin processing.

## 2. System Architecture

The integration follows this data flow:

```text
           GROUP 1 — COSMOS FOUNDATION
                     
              Telemetry Simulator
                     |
                     v
              FastAPI Backend
                     |
                     v
              PostgreSQL Database
                     |
                     v
               REST API Layer
                     |
                     v
           GROUP 2 — AI AND DIGITAL TWIN
                     
              Telemetry Retrieval
                     |
                     v
              Data Preprocessing
                     |
                     v
              Anomaly Detection
                     |
                     v
              Satellite Health Analysis
                     |
                     v
              Prediction and Digital Twin
```

Group 1 is responsible for providing standardized satellite and telemetry data.

Group 2 is responsible for processing the retrieved data and producing AI and Digital Twin outputs.

## 3. Group 1 Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python |
| Backend Framework | FastAPI |
| Database | PostgreSQL |
| Database Integration | SQLAlchemy |
| PostgreSQL Driver | Psycopg |
| Data Validation | Pydantic |
| API Architecture | REST |
| Data Format | JSON |
| Frontend | React |
| Build Tool | Vite |
| Visualization | Recharts |

## 4. Backend Connection Details

### Local development base URL

```text
http://127.0.0.1:8000
```

### Interactive API documentation

```text
http://127.0.0.1:8000/docs
```

Group 2 can inspect and test the available API endpoints through the interactive Swagger documentation.

**Important:** `127.0.0.1` refers to the local computer. If Group 2 runs its module on another computer, it must use a network-accessible backend address configured by the teams. The localhost address will not automatically work across computers.

## 5. Available APIs

### 5.1 Satellite API

**Method:** GET

**Endpoint:**

```text
/satellites/
```

**Purpose:** Retrieve registered satellite information.

Available response fields:

- id
- satellite_code
- satellite_name
- mission_type
- launch_date
- status
- created_at

Example:

```text
GET http://127.0.0.1:8000/satellites/
```

### 5.2 Historical Telemetry API

**Method:** GET

**Endpoint:**

```text
/telemetry/
```

**Purpose:** Retrieve historical telemetry records.

Query parameters:

| Parameter | Description |
|---|---|
| limit | Maximum number of records |
| satellite_id | Optional satellite database ID |
| start_time | Optional beginning of time range |
| end_time | Optional end of time range |

Example:

```text
GET http://127.0.0.1:8000/telemetry/?satellite_id=1&limit=100
```

### 5.3 Latest Telemetry API

**Method:** GET

**Endpoint:**

```text
/telemetry/latest
```

Required parameter:

```text
satellite_id
```

Example:

```text
GET http://127.0.0.1:8000/telemetry/latest?satellite_id=1
```

**Purpose:** Retrieve the latest available telemetry record for a satellite.

### 5.4 Alerts API

**Method:** GET

**Endpoint:**

```text
/alerts/
```

Optional query parameters:

- satellite_id
- status
- limit

Example:

```text
GET http://127.0.0.1:8000/alerts/?satellite_id=1&limit=100
```

### 5.5 Alert Status Update API

**Method:** PATCH

**Endpoint:**

```text
/alerts/{alert_id}
```

Request body:

```json
{
  "status": "ACKNOWLEDGED"
}
```

Supported statuses:

- ACTIVE
- ACKNOWLEDGED
- RESOLVED

Group 2 should normally consume alert information through GET requests. Any alert status changes should be coordinated with Group 1.

## 6. Standard Telemetry Data Structure

Each telemetry record contains the following fields:

| Field | Data Meaning | Unit |
|---|---|---|
| id | Unique telemetry record identifier | Integer |
| satellite_id | Satellite database identifier | Integer |
| timestamp | Telemetry measurement time | Timezone-aware timestamp |
| battery_voltage | Battery voltage | V |
| battery_current | Battery current | A |
| battery_percentage | Remaining battery level | % |
| temperature | Satellite temperature | °C |
| solar_power | Solar power measurement | W |
| altitude | Satellite altitude | km |
| payload_status | Payload operating status | Text |
| signal_strength | Communication signal strength | % |

### Example telemetry JSON

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

This is an illustrative example of the data format, not a live measurement.

## 7. Data Retrieval Recommendations for Group 2

Group 2 should use the following approach:

### 7.1 Initial data retrieval

Retrieve historical telemetry using:

```text
GET /telemetry/?satellite_id=1&limit=100
```

This provides a collection of telemetry records for initial analysis.

### 7.2 Latest telemetry retrieval

Retrieve the latest satellite state using:

```text
GET /telemetry/latest?satellite_id=1
```

### 7.3 Periodic updates

The Group 1 dashboard currently polls its APIs every 5 seconds.

Group 2 can implement its own polling interval based on processing requirements and coordinate the interval with Group 1.

The 5-second dashboard interval is not a guarantee that every telemetry record will be processed by Group 2.

### 7.4 Historical analysis

Group 2 can request historical records using:

- Satellite ID
- Start timestamp
- End timestamp
- Record limit

This supports historical telemetry analysis and time-series processing.

## 8. Group 2 Processing Responsibilities

Group 2 is responsible for implementing its own AI and Digital Twin functionality.

Expected development areas:

1. Telemetry preprocessing.
2. Data cleaning and validation for AI processing.
3. Satellite health monitoring.
4. Anomaly detection.
5. Time-series prediction.
6. Digital Twin processing.
7. Health assessment and analysis outputs.

These are Group 2 development responsibilities, not features already implemented by Group 1.

## 9. Integration Responsibilities

### Group 1 — COSMOS Foundation

Group 1 maintains:

- PostgreSQL database.
- Satellite information storage.
- Telemetry storage.
- Telemetry simulator.
- FastAPI backend.
- Satellite REST API.
- Telemetry REST API.
- Alert REST API.
- Dashboard and telemetry visualization.
- API documentation and data conventions.

### Group 2 — AI and Digital Twin

Group 2 develops:

- AI data preprocessing.
- Anomaly detection.
- Health monitoring algorithms.
- Predictive models.
- Digital Twin functionality.
- AI analysis outputs.

### Shared responsibilities

Both teams must coordinate:

- Telemetry field changes.
- API changes.
- Satellite identification conventions.
- Timestamp handling.
- Integration testing.
- Error handling.
- Output formats.

## 10. Integration Rules

1. Use the existing `satellite_id` values supplied by Group 1.
2. Preserve the standard telemetry field names.
3. Preserve timezone information in timestamps.
4. Handle empty responses and HTTP errors.
5. Do not directly modify Group 1 database tables without coordination.
6. Keep Group 2 AI processing separate from the Group 1 telemetry ingestion service.
7. Document any additional fields required by Group 2.
8. Coordinate new API requirements before implementation.
9. Do not assume that simulated telemetry represents actual spacecraft measurements.

## 11. Error Handling

Group 2 should account for common HTTP responses:

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 404 | Requested telemetry or resource not found |
| 422 | Request validation error |
| 500 | Internal server error |

An empty JSON array is a valid response when no matching records exist.

Group 2 should not treat an empty response as an automatic indication of a satellite anomaly.

## 12. Security and Operational Limitations

The current COSMOS prototype uses simulated telemetry.

- No real spacecraft connection is implemented.
- No real spacecraft command execution is supported.
- Database credentials must not be shared through GitHub.
- Group 2 should access data through approved APIs.
- Production integration requires authentication, authorization, secure communications, cybersecurity approval, and validation.

Any future spacecraft command functionality must remain simulation-only unless separately authorized through appropriate operational procedures.

## 13. Integration Testing Checklist

### Group 1 verification

- [ ] Backend is running.
- [ ] PostgreSQL is accessible.
- [ ] Satellite API returns HTTP 200.
- [ ] Historical telemetry API returns HTTP 200.
- [ ] Latest telemetry API returns HTTP 200.
- [ ] Alerts API returns HTTP 200.
- [ ] Telemetry simulator generates records.
- [ ] Telemetry timestamps include timezone information.

### Group 2 verification

- [ ] Group 2 can connect to the backend.
- [ ] Group 2 can retrieve satellite information.
- [ ] Group 2 can retrieve historical telemetry.
- [ ] Group 2 can retrieve latest telemetry.
- [ ] Group 2 can process telemetry fields.
- [ ] Group 2 can handle empty API responses.
- [ ] Group 2 can handle API errors.
- [ ] AI processing outputs are documented.

### Joint integration verification

- [ ] Both teams agree on telemetry field names.
- [ ] Both teams agree on satellite identifiers.
- [ ] Both teams agree on timestamp conventions.
- [ ] API changes are communicated.
- [ ] End-to-end integration tests are completed.

## 14. Current Integration Status

| Component | Status |
|---|---|
| Group 1 PostgreSQL foundation | Implemented |
| Group 1 telemetry simulator | Implemented |
| Group 1 satellite API | Implemented |
| Group 1 telemetry API | Implemented |
| Group 1 alerts API | Implemented |
| Group 1 React dashboard | Implemented |
| Group 1 API documentation | Implemented |
| Group 2 AI integration | Pending |
| Group 2 anomaly detection | Pending |
| Group 2 prediction | Pending |
| Group 2 Digital Twin | Pending |
| Joint end-to-end integration | Pending |

## 15. Repository Information

**Project:** COSMOS_FINAL

**GitHub Repository:**

https://github.com/samruddhimandage/COSMOS_FINAL

**Main Branch:** `main`

**Group 1 API Documentation:**

`documentation/api_documentation.md`

**Group 1 to Group 2 Integration Document:**

`documentation/group1_group2_integration.md`

**Interactive API Documentation:**

http://127.0.0.1:8000/docs

---

## 16. Integration Objective

The objective of this integration is to connect the COSMOS Foundation with AI and Digital Twin capabilities to create a unified mission intelligence platform.

Group 1 provides the data foundation.

Group 2 provides AI-assisted analysis and Digital Twin capabilities.

Together, these modules establish the foundation for the larger COSMOS Mission Intelligence Platform.

**COSMOS — Observe. Understand. Predict. Decide. Learn.**