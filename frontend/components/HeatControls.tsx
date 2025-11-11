"use client";

import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import {
  START_HEAT,
  RESET_HEAT,
} from "@/app/api/graphql/mutations/heatMutations";

interface HeatControlsProps {
  heatId: string;
  onStart: () => void;
  onReset: () => void;
}

export const HeatControls = ({ heatId, onStart, onReset }: HeatControlsProps) => {
  const [startHeat, { loading: starting }] = useMutation(START_HEAT, { variables: { heatId } });
  const [resetHeat, { loading: resetting }] = useMutation(RESET_HEAT, { variables: { heatId } });

  const handleStart = async () => {
    await startHeat(); 
    onStart(); 
  };

  const handleReset = async () => {
    await resetHeat(); 
    onReset();
  };


  return (
    <div className="flex gap-2">
      <Button onClick={handleStart} disabled={starting}>
        <Play className="mr-2 h-4 w-4" /> Starta simulering
      </Button>
      <Button variant="secondary" onClick={handleReset} disabled={resetting}>
        <RotateCcw className="mr-2 h-4 w-4" /> Återställ
      </Button>
    </div>
  );
};