/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { GET_LANES } from "@/app/api/graphql/queries/laneQueries";
import { SAVE_HEAT_RESULTS } from "@/app/api/graphql/mutations/heatMutations";
import { GET_HEAT_RESULTS } from "@/app/api/graphql/queries/heatQueries";
import { Lane, GetLanesData } from "@/types";

export const useHeatLanes = (heatId: string, isHeatActive?: boolean) => {
  const [lanes, setLanes] = useState<Lane[]>([]);

  const { data, loading, error, startPolling, stopPolling } =
    useQuery<GetLanesData>(GET_LANES, {
      variables: { heatId },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    });

  const [saveHeatResults] = useMutation(SAVE_HEAT_RESULTS, {
    refetchQueries: [{ query: GET_HEAT_RESULTS, variables: { heatId } }],
  });

  // sync lanes
  useEffect(() => {
    if (data?.lanes) setLanes(data.lanes);
  }, [data]);

  // polling control
  useEffect(() => {
    if (loading) return;

    const allFinished =
      lanes.length > 0 && lanes.every((l) => l.status === "FINISHED");

    if (isHeatActive && !allFinished) {
      startPolling(1200);
    } else {
      stopPolling();
    }
  }, [isHeatActive, lanes, startPolling, stopPolling, loading]);

  // save results once all lanes are finished
  const handleFinish = async () => {
    try {
      await saveHeatResults({ variables: { heatId } });
      console.log("Heat results saved successfully");
    } catch (err) {
      console.error("Failed to save results:", err);
    }
  };

  return { lanes, loading, error, stopPolling, handleFinish };
};
