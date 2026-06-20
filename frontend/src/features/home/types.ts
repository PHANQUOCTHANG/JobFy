import { LucideIcon } from "lucide-react";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  tags: string[];
  logo: string;
  posted: string;
  hot?: boolean;
  remote?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
  avatarBg: string;
  days: number;
}

export interface Article {
  id: number;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  emoji: string;
  tagColor: string;
}

export interface Category {
  id: number;
  name: string;
  count: number;
  icon: LucideIcon;
}

export interface Company {
  name: string;
  industry: string;
  openings: number;
  logo: string;
  bg: string;
}
