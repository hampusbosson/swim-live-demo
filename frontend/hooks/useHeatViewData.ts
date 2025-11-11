"use client";
import { useMeetData } from "./useMeetData";
import { useEventByHeat } from "./useEventByHeat";
import { useHeatData } from "./useHeatData";

export const useHeatViewData = (meetId?: string, heatId?: string) => {
  const { meet, sessions, events, heats, loading: meetLoading, error: meetError } =
    useMeetData(meetId);

  const { event, loading: eventLoading, error: eventError } =
    useEventByHeat(heatId);

  const { heat, loading: heatLoading, error: heatError, refetchHeat } =
    useHeatData(heatId);

  return {
    meet,
    sessions,
    events,
    heats,
    event,
    heat,
    refetchHeat,
    loading: meetLoading || eventLoading || heatLoading,
    error: meetError || eventError || heatError,
  };
};