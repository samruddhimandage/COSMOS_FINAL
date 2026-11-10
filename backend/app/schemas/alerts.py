from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AlertResponse(BaseModel):
    id: int
    satellite_id: int

    alert_type: str
    severity: str
    message: str

    parameter_name: str
    parameter_value: float | None = None
    threshold_value: float | None = None

    status: str

    created_at: datetime
    acknowledged_at: datetime | None = None
    resolved_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class AlertStatusUpdate(BaseModel):
    status: str