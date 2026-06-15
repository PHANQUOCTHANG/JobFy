import React from 'react';
import { CandidateProfile } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Mail, Linkedin, Github, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CandidatePublicHeaderProps {
  profile: CandidateProfile;
  onContactClick?: () => void;
}

export const CandidatePublicHeader: React.FC<CandidatePublicHeaderProps> = ({ profile, onContactClick }) => {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-sm">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.fullName}`} />
          <AvatarFallback>{profile.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{profile.fullName}</h1>
              {profile.headline && (
                <p className="text-lg text-muted-foreground mt-1">{profile.headline}</p>
              )}
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {profile.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {profile.experienceLevel && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span className="capitalize">{profile.experienceLevel.replace('_', ' ')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[140px]">
              <Button onClick={onContactClick} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Liên hệ ngay
              </Button>
              <Button variant="outline" className="w-full">
                Lưu hồ sơ
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {profile.linkedinUrl && (
              <Button variant="ghost" size="sm" asChild className="h-8">
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2 text-indigo-600" />
                  LinkedIn
                </a>
              </Button>
            )}
            {profile.githubUrl && (
              <Button variant="ghost" size="sm" asChild className="h-8">
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            {profile.portfolioUrl && (
              <Button variant="ghost" size="sm" asChild className="h-8">
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Portfolio
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
