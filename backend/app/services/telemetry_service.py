from sqlalchemy import text

from app.database.connection import engine


def save_telemetry(telemetry_data):
    """
    Save one satellite telemetry reading into PostgreSQL.
    """

    query = text("""
        INSERT INTO telemetry (
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
        )
        VALUES (
            :satellite_id,
            :timestamp,
            :battery_voltage,
            :battery_current,
            :battery_percentage,
            :temperature,
            :solar_power,
            :altitude,
            :payload_status,
            :signal_strength
        )
    """)

    with engine.begin() as connection:
        connection.execute(query, telemetry_data)

    print("Telemetry successfully saved to PostgreSQL!")