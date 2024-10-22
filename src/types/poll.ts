export interface Poll {
  id: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
  isPublic: boolean;
  totalVotes: number;
  createdAt: string;
  stars: number; // Cambiamos rating por stars
}
