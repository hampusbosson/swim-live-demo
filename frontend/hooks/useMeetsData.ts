"use client";
import { useQuery } from "@apollo/client/react";
import { GET_MEETS } from "@/app/api/graphql/queries";
import { GetMeetsData } from "@/types";

export const useMeetsData = () => {
  const { data, loading, error } = useQuery<GetMeetsData>(GET_MEETS);
  return {
    meets: data?.meets ?? [],
    loading,
    error,
  };
};