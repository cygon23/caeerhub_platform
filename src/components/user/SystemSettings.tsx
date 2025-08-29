import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SystemSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [discoverable, setDiscoverable] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className='space-y-8 max-w-3xl mx-auto'>
      {/* Profile & Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center space-x-6'>
          <Avatar className='w-20 h-20'>
            <AvatarImage src='/avatars/default.png' alt='User Avatar' />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className='space-y-2'>
            <Input placeholder='Display Name' />
            <Input placeholder='Tagline or Short Bio' />
            <Button variant='outline'>Change Avatar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Discoverability */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Discoverability</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span>Allow others to discover my profile</span>
            <Switch checked={discoverable} onCheckedChange={setDiscoverable} />
          </div>
          <div className='flex items-center justify-between'>
            <span>Appear Online</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span>Email Notifications</span>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className='flex items-center justify-between'>
            <span>Job Alerts</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span>Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div className='flex items-center justify-between'>
            <span>Accent Color</span>
            <Select>
              <SelectTrigger className='w-32'>
                <SelectValue placeholder='Choose color' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pink'>Pink</SelectItem>
                <SelectItem value='blue'>Blue</SelectItem>
                <SelectItem value='green'>Green</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='Select language' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en'>English</SelectItem>
              <SelectItem value='sw'>Swahili</SelectItem>
              <SelectItem value='fr'>French</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='border-red-500'>
        <CardHeader>
          <CardTitle className='text-red-600'>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button variant='destructive'>Deactivate Account</Button>
          <Button variant='destructive'>Delete Account Permanently</Button>
        </CardContent>
      </Card>
    </div>
  );
}
