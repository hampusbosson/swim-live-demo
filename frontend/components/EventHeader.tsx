import { Event } from "@/types/swim";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface EventHeaderProps {
  event: Event | null;
  bannerUrl?: string;
}

export const EventHeader = ({ event, bannerUrl }: EventHeaderProps) => {
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
        <Tabs defaultValue="heats" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="entries">Anmälda</TabsTrigger>
            <TabsTrigger value="heats">Heats</TabsTrigger>
            <TabsTrigger value="summary">Sammanfattning</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};