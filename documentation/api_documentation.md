
# COSMOS API Documentation

## 1. Project Overview

COSMOS (Cognitive Mission Intelligence Platform) provides standardized satellite telemetry data through REST APIs.

The APIs allow other COSMOS modules to retrieve satellite information and telemetry records.

## 2. Backend Technology

- Programming Language: Python
- Backend Framework: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy
- API Architecture: REST

## 3. Base URL

Local development URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

## 4. Satellite API

### Get All Satellites

- Method: GET
- Endpoint: /satellites/
- Purpose: Retrieve registered satellite information.

### Response Fields

- id
- satellite_code
- satellite_name
- mission_type
- launch_date
- status
- created_at

## 5. Telemetry API

### Get Telemetry Records

- Method: GET
- Endpoint: /telemetry/
- Purpose: Retrieve historical telemetry records.

### Query Parameters

- limit: Maximum number of records.
- satellite_id: Optional satellite database ID.
- start_time: Optional beginning of the time range.
- end_time: Optional end of the time range.

### Get Latest Telemetry

- Method: GET
- Endpoint: /telemetry/latest
- Required parameter: satellite_id
- Purpose: Retrieve the latest telemetry record for a satellite.

## 6. Standard Telemetry Data Format

Each telemetry record contains:

- id
- satellite_id
- timestamp
- battery_voltage
- battery_current
- battery_percentage
- temperature
- solar_power
- altitude
- payload_status
- signal_strength

## 7. Integration with Other COSMOS Modules

The APIs are intended to support integration with:

### Group 2: AI and Digital Twin

The module can retrieve telemetry records for satellite health monitoring, anomaly detection, prediction and digital twin processing.

### Mission Intelligence Module

The module can retrieve telemetry and satellite information for mission context, decision support and mission planning.

## 8. Integration Notes

- All telemetry is exchanged using JSON.
- APIs use HTTP REST methods.
- Satellite identifiers refer to database satellite IDs.
- Timestamps include timezone information.
- The current development system uses simulated telemetry.
- Real spacecraft commands are outside the scope of this prototype.

## 9. Current Development Status

- Satellite API: Implemented
- Telemetry API: Implemented
- Historical telemetry retrieval: Implemented
- Satellite-specific filtering: Implemented
- Date-range filtering: Implemented
- Latest telemetry retrieval: Implemented
- PostgreSQL storage: Implemented
