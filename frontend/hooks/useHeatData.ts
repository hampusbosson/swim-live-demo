"use client";
import { useQuery } from "@apollo/client/react";
import { GET_HEAT_BY_ID } from "@/app/api/graphql/queries";
import { GetHeatByIdData } from "@/types";

export const useHeatData = (heatId?: string) => {
  const { data, loading, error, refetch } = useQuery<GetHeatByIdData>(
    GET_HEAT_BY_ID,
    {
      variables: { id: heatId },
      fetchPolicy: "network-only",
      skip: !heatId,
    }
  );

  return {
    heat: data?.heat ?? null,
    loading,
    error,
    refetchHeat: refetch,
  };
};