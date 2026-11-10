from sqlalchemy import text

from app.database.connection import engine


def create_alert(alert_data):
    """Save a new alert in the database."""

    query = text("""
        SELECT *
        FROM alerts
        WHERE
            (:satellite_id IS NULL OR satellite_id = :satellite_id)
            AND
            (CAST(:status AS VARCHAR(20)) IS NULL
            OR status = CAST(:status AS VARCHAR(20)))
        ORDER BY created_at DESC
        LIMIT :limit
    """)

    with engine.begin() as connection:
        result = connection.execute(query, alert_data)
        return dict(result.mappings().one())


def get_alerts(satellite_id=None, status=None, limit=100):
    """Retrieve alerts, optionally filtered by satellite and status."""

    query = text("""
        SELECT *
        FROM alerts
        WHERE
            (:satellite_id IS NULL OR satellite_id = :satellite_id)
            AND
            (
                CAST(:status AS VARCHAR(20)) IS NULL
                OR status = CAST(:status AS VARCHAR(20))
            )
        ORDER BY created_at DESC
        LIMIT :limit
    """)

    with engine.connect() as connection:
        result = connection.execute(
            query,
            {
                "satellite_id": satellite_id,
                "status": status,
                "limit": limit
            }
        )

        records = result.mappings().all()

    return [dict(record) for record in records]


def update_alert_status(alert_id, status):
    """Update an alert's status."""

    query = text("""
        SELECT *
        FROM alerts
        WHERE
            (:satellite_id IS NULL OR satellite_id = :satellite_id)
            AND (
                CAST(:status AS VARCHAR(20)) IS NULL
                OR status = CAST(:status AS VARCHAR(20))
            )
        ORDER BY created_at DESC
        LIMIT :limit
    """)

    with engine.begin() as connection:
        result = connection.execute(
            query,
            {
                "alert_id": alert_id,
                "status": status
            }
        )

        record = result.mappings().first()

    return dict(record) if record else None


def evaluate_telemetry(telemetry):
    """Generate or resolve alerts based on incoming telemetry."""

    rules = [
        {
            "parameter": "battery_percentage",
            "alert_type": "LOW_BATTERY",
            "threshold": 30,
            "condition": lambda value: value < 30,
            "severity": "CRITICAL",
            "message": "Battery level is critically low."
        },
        {
            "parameter": "temperature",
            "alert_type": "HIGH_TEMPERATURE",
            "threshold": 45,
            "condition": lambda value: value > 45,
            "severity": "WARNING",
            "message": "Satellite temperature is above the safe limit."
        },
        {
            "parameter": "signal_strength",
            "alert_type": "WEAK_SIGNAL",
            "threshold": 40,
            "condition": lambda value: value < 40,
            "severity": "WARNING",
            "message": "Satellite signal strength is weak."
        }
    ]

    satellite_id = telemetry["satellite_id"]


    insert_query = text("""
        INSERT INTO alerts (
            satellite_id,
            alert_type,
            severity,
            message,
            parameter_name,
            parameter_value,
            threshold_value
        )
        SELECT
            :satellite_id,
            CAST(:alert_type AS VARCHAR(50)),
            :severity,
            :message,
            :parameter_name,
            :parameter_value,
            :threshold_value
        WHERE NOT EXISTS (
            SELECT 1
            FROM alerts
            WHERE satellite_id = :satellite_id
              AND alert_type = CAST(:alert_type AS VARCHAR(50))
              AND status IN ('ACTIVE', 'ACKNOWLEDGED')
        )
    """)


    resolve_query = text("""
        UPDATE alerts
        SET
            status = 'RESOLVED',
            resolved_at = CURRENT_TIMESTAMP
        WHERE satellite_id = :satellite_id
          AND alert_type = :alert_type
          AND status IN ('ACTIVE', 'ACKNOWLEDGED')
    """)

    with engine.begin() as connection:
        for rule in rules:
            value = telemetry.get(rule["parameter"])

            if value is None:
                continue

            value = float(value)

            parameters = {
                "satellite_id": satellite_id,
                "alert_type": rule["alert_type"]
            }

            if rule["condition"](value):
                connection.execute(
                    insert_query,
                    {
                        **parameters,
                        "severity": rule["severity"],
                        "message": rule["message"],
                        "parameter_name": rule["parameter"],
                        "parameter_value": value,
                        "threshold_value": rule["threshold"]
                    }
                )

            else:
                connection.execute(resolve_query, parameters)
