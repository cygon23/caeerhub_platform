import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Award, Star, Download, Share2, EyeOff } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [sharePrivate, setSharePrivate] = useState(false);

  return (
    <div className='space-y-8'>
      {/* Personal Growth Header */}
      <Card className='bg-gradient-hero text-white'>
        <CardHeader>
          <CardTitle className='text-2xl'>Your Career Growth</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-white/90'>
            Track your career development, skills, badges, and personal growth
            over time.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card className='bg-white text-foreground'>
              <CardContent className='text-center space-y-2'>
                <BarChart3 className='h-6 w-6 mx-auto text-primary' />
                <p className='font-semibold text-lg'>Career Readiness</p>
                <Progress value={72} className='h-2' />
                <p className='text-sm text-muted-foreground'>72% Complete</p>
              </CardContent>
            </Card>

            <Card className='bg-white text-foreground'>
              <CardContent className='text-center space-y-2'>
                <Award className='h-6 w-6 mx-auto text-secondary' />
                <p className='font-semibold text-lg'>Badges Earned</p>
                <Progress value={8 * 10} className='h-2' />
                <p className='text-sm text-muted-foreground'>8 Badges</p>
              </CardContent>
            </Card>

            <Card className='bg-white text-foreground'>
              <CardContent className='text-center space-y-2'>
                <Star className='h-6 w-6 mx-auto text-primary' />
                <p className='font-semibold text-lg'>Skill Growth</p>
                <Progress value={60} className='h-2' />
                <p className='text-sm text-muted-foreground'>
                  6/10 Skills Developed
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information & Editable Section */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium'>Full Name</label>
              <Input
                value='John Doe'
                disabled={!isEditing}
                onChange={() => {}}
              />
            </div>
            <div>
              <label className='block text-sm font-medium'>Email</label>
              <Input value='john@example.com' disabled />
            </div>
            <div>
              <label className='block text-sm font-medium'>Phone</label>
              <Input
                value='+255 123 456 789'
                disabled={!isEditing}
                onChange={() => {}}
              />
            </div>
            <div className='flex items-center space-x-2'>
              <span>Profile Visibility:</span>
              {sharePrivate ? (
                <Badge variant='destructive'>
                  <EyeOff className='h-3 w-3 mr-1' />
                  Private
                </Badge>
              ) : (
                <Badge variant='secondary'>Public</Badge>
              )}
            </div>
          </div>

          <div className='flex justify-end space-x-2'>
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>Save</Button>
                <Button variant='outline' onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Career & Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Career & Skills</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='font-medium text-foreground mb-2'>
                Preferred Career Path
              </p>
              <Badge variant='secondary'>Employment Path</Badge>
            </div>
            <div>
              <p className='font-medium text-foreground mb-2'>Dream Career</p>
              <strong>Software Engineer</strong>
            </div>
          </div>

          <div>
            <p className='font-medium text-foreground mb-2'>Skills & Badges</p>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='outline'>JavaScript</Badge>
              <Badge variant='outline'>React</Badge>
              <Badge variant='outline'>Leadership</Badge>
              <Badge variant='outline'>Time Management</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & Share Options */}
      <Card className='bg-gradient-accent text-white'>
        <CardHeader>
          <CardTitle>Share & Export Progress</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4'>
          <Button
            variant='outline'
            className='flex items-center space-x-2 text-white'>
            <Download className='h-4 w-4' />
            Export Profile
          </Button>
          <Button
            className='flex items-center space-x-2'
            onClick={() => setSharePrivate(!sharePrivate)}>
            <Share2 className='h-4 w-4' />
            {sharePrivate ? "Make Public" : "Share Privately"}
          </Button>
        </CardContent>
      </Card>

      {/* Career Growth Graph Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Career Progress Visualization</CardTitle>
        </CardHeader>
        <CardContent className='h-64 flex items-center justify-center text-muted-foreground'>
          {/* Here you can later add chart library like Chart.js, Recharts, etc */}
          <p>Graph/Chart Visualization Placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
}
