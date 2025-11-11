/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_LANES } from "@/app/api/graphql/queries/laneQueries";
import { Lane, GetLanesData } from "@/types";

export const useHeatLanes = (heatId: string, isHeatActive?: boolean) => {
  const [lanes, setLanes] = useState<Lane[]>([]);

  const { data, loading, error, startPolling, stopPolling } =
    useQuery<GetLanesData>(GET_LANES, {
      variables: { heatId },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    });

  //Sync lanes with server when new data arrives
  useEffect(() => {
    if (data?.lanes) setLanes(data.lanes);
  }, [data]);

  //Frontend-side simulation, gradually update lane times
  useEffect(() => {
    if (!isHeatActive) return;

    const interval = setInterval(() => {
      setLanes((prev) =>
        prev.map((lane) => {
          if (lane.status !== "ONGOING") return lane;

          const current = parseFloat(lane.resultTime ?? "0");
          const seed = parseFloat(lane.seedTime);
          const target = seed + (Math.random() - 0.3); // somewhat random
          const next = current + 0.1;

          if (next >= target) {
            return {
              ...lane,
              resultTime: target.toFixed(2),
              status: "FINISHED",
            };
          }
          return { ...lane, resultTime: next.toFixed(2) };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isHeatActive]);

  // Control polling (for server sync)
  useEffect(() => {
    if (loading) return;

    const allFinished =
      lanes.length > 0 && lanes.every((l) => l.status === "FINISHED");

    if (isHeatActive && !allFinished) {
      startPolling(1500);
    } else {
      stopPolling();
    }
  }, [isHeatActive, lanes, startPolling, stopPolling, loading]);

  return { lanes, loading, error, stopPolling };
};