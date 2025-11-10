import { useQuery } from "@apollo/client/react";
import {
  GET_MEET_BY_ID,
  GET_EVENTS_BY_MEET,
  GET_SESSIONS_BY_MEET,
  GET_HEATS_BY_MEET,
} from "@/app/api/graphql/queries";
import {
  GetMeetByIdData,
  GetEventsData,
  GetSessionsData,
  GetHeatsData,
} from "@/types";

export const useMeetData = (meetId: string) => {
  const { data: meetData, loading: meetLoading, error: meetError } =
    useQuery<GetMeetByIdData>(GET_MEET_BY_ID, { variables: { id: meetId } });

  const { data: eventData, loading: eventLoading, error: eventError } =
    useQuery<GetEventsData>(GET_EVENTS_BY_MEET, { variables: { meetId } });

  const { data: sessionData, loading: sessionLoading, error: sessionError } =
    useQuery<GetSessionsData>(GET_SESSIONS_BY_MEET, { variables: { meetId } });

  const { data: heatData, loading: heatLoading, error: heatError } =
    useQuery<GetHeatsData>(GET_HEATS_BY_MEET, { variables: { meetId } });

  const loading = meetLoading || eventLoading || sessionLoading || heatLoading;
  const error = meetError || eventError || sessionError || heatError;

  return {
    meet: meetData?.meet,
    sessions: sessionData?.sessions ?? [],
    events: eventData?.events ?? [],
    heats: heatData?.heats ?? [],
    loading,
    error,
  };
};