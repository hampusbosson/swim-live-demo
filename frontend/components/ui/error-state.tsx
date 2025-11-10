"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState = ({
  message = "Ett fel uppstod vid hämtning av data.",
  onRetry,
  fullScreen = false,
}: ErrorStateProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-destructive py-10 text-center">
      <AlertTriangle className="h-6 w-6" />
      <p className="text-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Försök igen
        </Button>
      )}
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