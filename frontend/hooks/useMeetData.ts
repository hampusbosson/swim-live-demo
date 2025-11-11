"use client";
import { useQuery } from "@apollo/client/react";
import {
  GET_MEET_BY_ID,
  GET_SESSIONS_BY_MEET,
  GET_EVENTS_BY_MEET,
  GET_HEATS_BY_MEET,
} from "@/app/api/graphql/queries";
import {
  GetMeetByIdData,
  GetSessionsData,
  GetEventsData,
  GetHeatsData,
} from "@/types";

export const useMeetData = (meetId?: string) => {
  const { data: meetData, loading: meetLoading, error: meetError } =
    useQuery<GetMeetByIdData>(GET_MEET_BY_ID, { variables: { id: meetId }, skip: !meetId });

  const { data: sessionsData, loading: sessionsLoading, error: sessionsError } =
    useQuery<GetSessionsData>(GET_SESSIONS_BY_MEET, { variables: { meetId }, skip: !meetId });

  const { data: eventsData, loading: eventsLoading, error: eventsError } =
    useQuery<GetEventsData>(GET_EVENTS_BY_MEET, { variables: { meetId }, skip: !meetId });

  const { data: heatsData, loading: heatsLoading, error: heatsError } =
    useQuery<GetHeatsData>(GET_HEATS_BY_MEET, { variables: { meetId }, skip: !meetId });

  return {
    meet: meetData?.meet ?? null,
    sessions: sessionsData?.sessions ?? [],
    events: eventsData?.events ?? [],
    heats: heatsData?.heats ?? [],
    loading: meetLoading || sessionsLoading || eventsLoading || heatsLoading,
    error: meetError || sessionsError || eventsError || heatsError,
  };
};