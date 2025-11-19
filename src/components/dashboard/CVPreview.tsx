import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, Code } from 'lucide-react';

interface CVPreviewProps {
  cvData: {
    title: string;
    personal_info: {
      full_name: string;
      email: string;
      phone: string;
      location: string;
      summary: string;
    };
    experience: Array<{
      company: string;
      position: string;
      start_date: string;
      end_date: string;
      description: string;
      current: boolean;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      start_date: string;
      end_date: string;
      gpa?: string;
    }>;
    skills: {
      technical: string[];
      soft: string[];
    };
    achievements: Array<{
      title: string;
      description: string;
      date: string;
    }>;
  };
}

export default function CVPreview({ cvData }: CVPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const { personal_info, experience, education, skills, achievements } = cvData;

  return (
    <div className="bg-white text-gray-900 shadow-2xl rounded-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8">
        <h1 className="text-4xl font-bold mb-2">{personal_info.full_name || 'Your Name'}</h1>
        {personal_info.summary && (
          <p className="text-white/90 text-sm leading-relaxed max-w-3xl">
            {personal_info.summary}
          </p>
        )}

        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {personal_info.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{personal_info.email}</span>
            </div>
          )}
          {personal_info.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{personal_info.phone}</span>
            </div>
          )}
          {personal_info.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{personal_info.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Experience Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-primary">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Professional Experience</h2>
          </div>
          {experience.length > 0 ? (
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <div className="mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="font-medium">{exp.company}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 text-center">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 text-sm font-medium">No work experience added yet</p>
              <p className="text-gray-400 text-xs mt-1">Add your professional experience to strengthen your CV</p>
            </div>
          )}
        </section>

        {/* Education Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-secondary">
            <GraduationCap className="h-5 w-5 text-secondary" />
            <h2 className="text-2xl font-bold text-secondary">Education</h2>
          </div>
          {education.length > 0 ? (
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-secondary"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="font-medium">{edu.institution}</span>
                      {(edu.start_date || edu.end_date) && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                            </span>
                          </div>
                        </>
                      )}
                      {edu.gpa && (
                        <>
                          <span>•</span>
                          <span className="font-medium">GPA: {edu.gpa}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 text-center">
              <GraduationCap className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 text-sm font-medium">No education added yet</p>
              <p className="text-gray-400 text-xs mt-1">Add your educational background to complete your CV</p>
            </div>
          )}
        </section>

        {/* Skills Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-primary">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Skills</h2>
          </div>
          {(skills.technical.length > 0 || skills.soft.length > 0) ? (
            <div className="space-y-3">
              {skills.technical.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((skill, index) => (
                      <Badge key={index} variant="default" className="bg-primary/10 text-primary border-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-secondary/40 text-secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 text-center">
              <Code className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 text-sm font-medium">No skills added yet</p>
              <p className="text-gray-400 text-xs mt-1">Add your technical and soft skills to showcase your abilities</p>
            </div>
          )}
        </section>

        {/* Achievements Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-secondary">
            <Award className="h-5 w-5 text-secondary" />
            <h2 className="text-2xl font-bold text-secondary">Achievements & Awards</h2>
          </div>
          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-secondary"></div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      {achievement.date && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{formatDate(achievement.date)}</span>
                        </>
                      )}
                    </div>
                    {achievement.description && (
                      <p className="text-sm text-gray-700">{achievement.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 text-sm font-medium">No achievements added yet</p>
              <p className="text-gray-400 text-xs mt-1">Highlight your awards and achievements to stand out</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Generated with Career na Mimi - Professional CV Builder
          </p>
        </div>
      </div>
    </div>
  );
}
