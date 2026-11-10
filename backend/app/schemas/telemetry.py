from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TelemetryResponse(BaseModel):
    id: int
    satellite_id: int
    timestamp: datetime

    battery_voltage: float | None = None
    battery_current: float | None = None
    battery_percentage: float | None = None

    temperature: float | None = None
    solar_power: float | None = None
    altitude: float | None = None

    payload_status: str | None = None
    signal_strength: float | None = None

    model_config = ConfigDict(from_attributes=True)