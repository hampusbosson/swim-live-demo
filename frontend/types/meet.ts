export interface Meet {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  bannerUrl: string;
}

export interface Session {
  id: string;
  meetId: string;
  name: string;
  startTime: string;
}