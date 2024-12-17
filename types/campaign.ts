export interface Campaign {
  id: number;
  title: string;
  description: string;
  validUntil: string;
  icon: string;
  color: string;
  terms?: string;
  isActive: boolean;
  image: string;
} 