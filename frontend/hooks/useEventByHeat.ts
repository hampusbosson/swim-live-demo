"use client";
import { useQuery } from "@apollo/client/react";
import { GET_EVENT_BY_HEAT } from "@/app/api/graphql/queries";
import { GetEventByHeatData } from "@/types";

export const useEventByHeat = (heatId?: string) => {
  const { data, loading, error } = useQuery<GetEventByHeatData>(
    GET_EVENT_BY_HEAT,
    { variables: { heatId }, skip: !heatId }
  );
  return { event: data?.eventByHeat ?? null, loading, error };
};