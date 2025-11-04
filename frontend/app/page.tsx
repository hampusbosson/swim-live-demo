import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
        <div className="min-h-screen bg-background">
          {/** 
      <TopNav />
       */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Tävlingar
          </h1>
          <p className="text-muted-foreground">
            Välj en tävling för att se evenemang och resultat
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/**
          {mockMeets.map((meet) => (
            <MeetCard key={meet.id} meet={meet} />
          ))}
            */}
        </div>
      </main>
    </div>
  );
}
