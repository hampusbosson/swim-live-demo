"use client";

import { TopNav } from "@/components/TopNav";
import { MeetCard } from "@/components/MeetCard";
import { useMeetsData } from "@/hooks/useMeetsData";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

const Home = () => {
  const { meets, loading, error } = useMeetsData();

  if (loading) return <LoadingState text="Laddar tävlingar..." fullScreen />;
  if (error)
    return (
      <ErrorState
        message={error.message || "Kunde inte hämta tävlingar."}
        fullScreen
      />
    );

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
          <p className="text-muted-foreground text-center py-10">
            Inga tävlingar hittades.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {meets.map((meet) => (
              <MeetCard key={meet.id} meet={meet} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;