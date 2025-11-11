import { Meet } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/timeUtils";
import Image from "next/image";
import Link from "next/link";

interface MeetCardProps {
  meet: Meet;
}

export const MeetCard = ({ meet }: MeetCardProps) => {

  return (
    <Link href={`/meet/${meet.id}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
        {/* Banner Image */}
        <div className="h-48 overflow-hidden bg-muted">
          <Image
            src={meet.bannerUrl}
            alt={`${meet.name} banner`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={500}
            height={500}
          />
        </div>

        <CardHeader className="pb-3">
          <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {meet.name}
          </h2>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(meet.startDate)} - {formatDate(meet.endDate)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{meet.location}</span>
          </div>

          <Badge variant="secondary" className="mt-2">
            Visa tävling
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
};