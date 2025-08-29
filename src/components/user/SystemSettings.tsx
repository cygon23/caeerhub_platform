import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function SystemSettings() {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className='space-y-6'>
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setLanguage} value={language}>
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

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Theme / Color Mode</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center space-x-4'>
          <span>Dark Mode</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center space-x-4'>
          <span>Email Notifications</span>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </CardContent>
      </Card>

      {/* Privacy & Billing */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Billing</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Button variant='outline'>Privacy Policy</Button>
          <Button variant='outline'>Billing Details</Button>
          <Button variant='outline'>API Keys</Button>
        </CardContent>
      </Card>
    </div>
  );
}
