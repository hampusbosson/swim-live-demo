import { Event } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface EventHeaderProps {
  event: Event | null;
  bannerUrl?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const EventHeader = ({ event, bannerUrl, activeTab, onTabChange }: EventHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Banner */}
      {bannerUrl && (
        <div className="w-full h-32 sm:h-40 overflow-hidden rounded-lg shadow-md">
          <Image
            src={bannerUrl}
            alt="Evenemang banner"
            className="w-full h-full object-cover"
            width={1000}
            height={1000}
          />
        </div>
      )}

      {/* Event Info */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {event?.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {event?.distance}m
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {event?.stroke}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {event?.category}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="participants">Anmälda</TabsTrigger>
            <TabsTrigger value="heats">Heats</TabsTrigger>
            <TabsTrigger value="results">Resultat</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};