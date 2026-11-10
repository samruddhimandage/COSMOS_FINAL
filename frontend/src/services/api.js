
const API_BASE_URL = "/api";

// Common function for communicating with the COSMOS backend
async function apiRequest(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Keep the default error message if the response is not JSON.
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

// Retrieve all registered satellites
export async function getSatellites() {
  return await apiRequest("/satellites/");
}

// Retrieve the latest telemetry reading for a satellite
export async function getLatestTelemetry(satelliteId) {
  if (!satelliteId) {
    throw new Error("A satellite ID is required.");
  }

  const parameters = new URLSearchParams({
    satellite_id: satelliteId,
  });

  return await apiRequest(
    `/telemetry/latest?${parameters.toString()}`
  );
}

// Retrieve historical telemetry records for a satellite
export async function getHistoricalTelemetry(
  satelliteId,
  limit = 100
) {
  if (!satelliteId) {
    throw new Error("A satellite ID is required.");
  }

  const parameters = new URLSearchParams({
    satellite_id: satelliteId,
    limit: limit,
  });

  return await apiRequest(
    `/telemetry/?${parameters.toString()}`
  );
}

// Retrieve active alerts for a satellite
export async function getActiveAlerts(satelliteId, limit = 100) {
  if (!satelliteId) {
    throw new Error("A satellite ID is required.");
  }

  const parameters = new URLSearchParams({
    satellite_id: satelliteId,
    status: "ACTIVE",
    limit: limit,
  });

  return await apiRequest(
    `/alerts/?${parameters.toString()}`
  );
}
