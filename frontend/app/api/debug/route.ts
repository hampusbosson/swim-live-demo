import { NextResponse } from "next/server";
import { mockLanes } from "@/data/mockData";

export async function GET() {
  return NextResponse.json({
    lanes: mockLanes.map(l => ({
      id: l.id,
      heatId: l.heatId,
      status: l.status,
      resultTime: l.resultTime,
    })),
  });
}