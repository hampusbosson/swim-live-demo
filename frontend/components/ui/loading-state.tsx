"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  text?: string;
  fullScreen?: boolean;
}

export const LoadingState = ({ text = "Laddar...", fullScreen = false }: LoadingStateProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-10">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return content;
};