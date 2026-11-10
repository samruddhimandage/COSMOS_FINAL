
import random
import time
import json
from datetime import datetime, timezone

import sys
from pathlib import Path

# Add the backend folder to Python's import path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = PROJECT_ROOT / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.services.telemetry_service import save_telemetry
from app.services.alerts_service import evaluate_telemetry

# ==========================================
# COSMOS SATELLITE TELEMETRY SIMULATOR
# ==========================================

SATELLITE_CODE = "COSMOS-DEMO-01"

# Initial simulated satellite readings
satellite = {
    "battery_voltage": 28.5,
    "battery_current": 4.2,
    "battery_percentage": 85.0,
    "temperature": 24.5,
    "solar_power": 120.0,
    "altitude": 550.0,
    "payload_status": "ACTIVE",
    "signal_strength": 90.0
}


def generate_telemetry():

    # Simulate small changes in satellite readings
    satellite["battery_voltage"] += random.uniform(-0.2, 0.2)
    satellite["battery_current"] += random.uniform(-0.1, 0.1)
    satellite["battery_percentage"] += random.uniform(-0.1, 0.05)
    satellite["temperature"] += random.uniform(-0.5, 0.5)
    satellite["solar_power"] += random.uniform(-3, 3)
    satellite["altitude"] += random.uniform(-0.05, 0.05)
    satellite["signal_strength"] += random.uniform(-1, 1)

    # Keep values within reasonable simulation limits
    satellite["battery_voltage"] = max(20, min(32, satellite["battery_voltage"]))
    satellite["battery_current"] = max(0, min(10, satellite["battery_current"]))
    satellite["battery_percentage"] = max(0, min(100, satellite["battery_percentage"]))
    satellite["temperature"] = max(-20, min(80, satellite["temperature"]))
    satellite["solar_power"] = max(0, min(200, satellite["solar_power"]))
    satellite["altitude"] = max(400, min(800, satellite["altitude"]))
    satellite["signal_strength"] = max(0, min(100, satellite["signal_strength"]))

    # Prepare telemetry message
    telemetry_data = {
        "satellite_code": SATELLITE_CODE,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **satellite
    }

    return telemetry_data


def start_simulator():

    print("======================================")
    print(" COSMOS SATELLITE SIMULATOR STARTED")
    print("======================================")
    print("Satellite:", SATELLITE_CODE)
    print("Press CTRL + C to stop the simulator.")
    print("--------------------------------------")

    try:
        while True:

            telemetry = generate_telemetry()

            # Add the database ID of our demo satellite
            telemetry["satellite_id"] = 1

            # Save telemetry to PostgreSQL
            save_telemetry(telemetry)
            evaluate_telemetry(telemetry)

            # Display telemetry in the terminal
            print(json.dumps(telemetry, indent=4))

            print("--------------------------------------")


            # Generate new telemetry every 3 seconds
            time.sleep(3)

    except KeyboardInterrupt:
        print("\nCOSMOS Satellite Simulator stopped.")


if __name__ == "__main__":
    start_simulator()
