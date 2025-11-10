import { formatDate } from "@/lib/timeUtils";
import { Meet } from "@/types";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";

export const MeetHeader = ({ meet }: { meet: Meet }) => (
  <>
    <div className="w-full h-48 sm:h-64 overflow-hidden bg-muted">
      <Image
        src={meet.bannerUrl}
        alt={`${meet.name} banner`}
        className="w-full h-full object-cover"
        width={1000}
        height={1000}
      />
    </div>
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
        {meet.name}
      </h1>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(meet.startDate)} - {formatDate(meet.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{meet.location}</span>
        </div>
      </div>
    </div>
  </>
);