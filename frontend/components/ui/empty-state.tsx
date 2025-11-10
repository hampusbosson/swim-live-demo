"use client";

import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  text?: string;
}

export const EmptyState = ({ text = "Inget innehåll tillgängligt ännu." }: EmptyStateProps) => (
  <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
    <FileQuestion className="h-6 w-6 opacity-70" />
    <p className="text-sm">{text}</p>
  </div>
);