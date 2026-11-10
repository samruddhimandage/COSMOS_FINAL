from fastapi import APIRouter, HTTPException, Query

from app.schemas.alerts import AlertResponse, AlertStatusUpdate
from app.services.alerts_service import (
    get_alerts,
    update_alert_status,
)


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"]
)


@router.get("/", response_model=list[AlertResponse])
def read_alerts(
    satellite_id: int | None = Query(default=None, ge=1),
    status: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000)
):
    allowed_statuses = ["ACTIVE", "ACKNOWLEDGED", "RESOLVED"]

    if status is not None and status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid alert status."
        )

    return get_alerts(
        satellite_id=satellite_id,
        status=status,
        limit=limit
    )


@router.patch("/{alert_id}", response_model=AlertResponse)
def change_alert_status(
    alert_id: int,
    update: AlertStatusUpdate
):
    allowed_statuses = ["ACTIVE", "ACKNOWLEDGED", "RESOLVED"]

    if update.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid alert status."
        )

    alert = update_alert_status(
        alert_id=alert_id,
        status=update.status
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found."
        )

    return alert