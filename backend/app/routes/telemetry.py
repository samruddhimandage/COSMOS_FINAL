from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import text

from app.database.connection import engine
from app.schemas.telemetry import TelemetryResponse

from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
router = APIRouter(
    prefix="/telemetry",
    tags=["Telemetry"]
)


@router.get("/", response_model=list[TelemetryResponse])
def get_telemetry(
    limit: int = Query(default=10, ge=1, le=1000),
    satellite_id: int | None = Query(default=None, ge=1),
    start_time: datetime | None = Query(default=None),
    end_time: datetime | None = Query(default=None)
):
    
    # Validate the requested date range
    if start_time and end_time and start_time > end_time:
        raise HTTPException(
            status_code=400,
            detail="start_time must be earlier than or equal to end_time."
        )

    query = text("""
        SELECT
            id,
            satellite_id,
            timestamp,
            battery_voltage,
            battery_current,
            battery_percentage,
            temperature,
            solar_power,
            altitude,
            payload_status,
            signal_strength
        FROM telemetry
        WHERE
    (
        CAST(:satellite_id AS INTEGER) IS NULL
        OR satellite_id = CAST(:satellite_id AS INTEGER)
    )
    AND (
        CAST(:start_time AS TIMESTAMPTZ) IS NULL
        OR timestamp >= CAST(:start_time AS TIMESTAMPTZ)
    )
    AND (
        CAST(:end_time AS TIMESTAMPTZ) IS NULL
        OR timestamp <= CAST(:end_time AS TIMESTAMPTZ)
    )
        ORDER BY timestamp DESC
        LIMIT :limit
    """)

    with engine.connect() as connection:
        result = connection.execute(
            query,
            {
                "limit": limit,
                "satellite_id": satellite_id,
                "start_time": start_time,
                "end_time": end_time
            }
        )

        records = result.mappings().all()

    return [dict(record) for record in records]


@router.get("/latest", response_model=TelemetryResponse)
def get_latest_telemetry(satellite_id: int = Query(ge=1)):

    query = text("""
        SELECT
            id,
            satellite_id,
            timestamp,
            battery_voltage,
            battery_current,
            battery_percentage,
            temperature,
            solar_power,
            altitude,
            payload_status,
            signal_strength
        FROM telemetry
        WHERE satellite_id = :satellite_id
        ORDER BY timestamp DESC
        LIMIT 1
    """)

    with engine.connect() as connection:
        result = connection.execute(
            query,
            {"satellite_id": satellite_id}
        )
        record = result.mappings().first()

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="No telemetry found for this satellite."
        )

    return dict(record)