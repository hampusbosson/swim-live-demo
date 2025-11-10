import type { Lane } from "@/types/swim";

export const getLeaderTime = (lanes: Lane[]): number | null => {
  const finished = lanes.filter((l) => l.resultTime);
  if (finished.length === 0) return null;
  return Math.min(...finished.map((l) => parseFloat(l.resultTime!)));
};

export const getRank = (lane: Lane, finished: Lane[]): number | string => {
  if (!lane.resultTime) return "-";
  const ranked = [...finished].sort(
    (a, b) => parseFloat(a.resultTime!) - parseFloat(b.resultTime!)
  );
  return ranked.findIndex((l) => l.id === lane.id) + 1 || "-";
};

export const getDelta = (
  lane: Lane,
  leaderTime: number | null
): string | number => {
  if (!leaderTime || !lane.resultTime) return "-";
  const delta = parseFloat(lane.resultTime) - leaderTime;
  return delta <= 0 ? "-" : `+${delta.toFixed(2)}`;
};