import { useCallback, useEffect, useState } from "react";
import { fetchVehicles } from "../api/vehicles";
import { SearchParams, Vehicle } from "../types";
import { ApiRequestError } from "../api/client";

type Status = "idle" | "loading" | "success" | "error";

export function useVehicles(params: SearchParams) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchVehicles(params);
      setVehicles(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiRequestError ? err.message : "Unable to load inventory. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q, params.category, params.available, params.sort]);

  useEffect(() => {
    load();
  }, [load]);

  return { vehicles, status, error, reload: load, setVehicles };
}
