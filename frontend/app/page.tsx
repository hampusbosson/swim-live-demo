"use client";

import {
  useQuery,
} from "@apollo/client/react";
import { TopNav } from "@/components/TopNav";
import { MeetCard } from "@/components/MeetCard";
import { Meet } from "@/types/swim";
import { GET_MEETS } from "./api/graphql/queries/meetQueries";
import { GetMeetsData } from "@/types/swim";


const Home = () => {
  const { data, loading, error } = useQuery<GetMeetsData>(GET_MEETS);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Laddar tävlingar...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">
          Fel vid hämtning av tävlingar: {error.message}
        </p>
      </div>
    );

  const meets = data?.meets ?? [];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Tävlingar
          </h1>
          <p className="text-muted-foreground">
            Välj en tävling för att se evenemang och resultat
          </p>
        </div>

        {meets.length === 0 ? (
          <p className="text-muted-foreground">Inga tävlingar hittades.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {meets.map((meet: Meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;

