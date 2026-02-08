import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  ExternalLink,
  Play,
  FileText,
  Globe,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onNavigateToModules: () => void;
}

const MODULE_CATEGORIES = [
  {
    title: 'ICT Skills',
    description: 'Learn programming, web development, and digital skills',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    count: 'Multiple modules',
  },
  {
    title: 'Business & Finance',
    description: 'Business planning, entrepreneurship, and financial literacy',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
    count: 'Multiple modules',
  },
  {
    title: 'Career Development',
    description: 'CV writing, interview prep, and professional skills',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    count: 'Multiple modules',
  },
  {
    title: 'Academic Skills',
    description: 'Study techniques, research methods, and exam preparation',
    icon: Play,
    color: 'from-orange-500 to-red-500',
    count: 'Multiple modules',
  },
];

export default function OnlineModulesTab({ onNavigateToModules }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Online Modules
          </h3>
          <p className="text-sm text-muted-foreground">Access learning modules to boost your skills</p>
        </div>
        <Button onClick={onNavigateToModules}>
          Go to Modules
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Module Categories */}
      <div className="grid gap-4 sm:grid-cols-2">
        {MODULE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card
              key={cat.title}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={onNavigateToModules}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{cat.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold text-lg mb-2">Browse All Modules</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Explore our full library of learning modules including videos, articles, and interactive content.
          </p>
          <Button onClick={onNavigateToModules} size="lg">
            Open Learning Modules
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
