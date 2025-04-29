
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { BarChart, Bell, Globe, Key, Lock, User, Mic, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  // Mock user profile
  const [profile, setProfile] = useState({
    name: "Demo User",
    email: "user@example.com",
    company: "Acme Inc.",
    timezone: "America/New_York"
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    conversationSummaries: true,
    weeklyReports: false,
    serviceUpdates: true
  });
  
  // Voice settings
  const [voiceSettings, setVoiceSettings] = useState({
    inputVolume: [80],
    outputVolume: [65],
    voiceType: "neutral",
    noiseReduction: true,
    echoCancel: true,
    autoGainControl: true
  });
  
  // Handle profile save
  const handleProfileSave = () => {
    toast.success("Profile updated successfully");
  };
  
  // Handle notification toggle
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key} notifications ${notifications[key] ? 'disabled' : 'enabled'}`);
  };
  
  // Handle voice settings change
  const handleVoiceSettingChange = (key: keyof typeof voiceSettings, value: any) => {
    setVoiceSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold neon-text mb-1">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={profile.name} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profile.email} 
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        value={profile.company} 
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={profile.timezone}
                        onValueChange={(value) => setProfile({...profile, timezone: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleProfileSave}>Save Changes</Button>
                </CardFooter>
              </Card>
              
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast.success("Password updated successfully")}>
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="voice">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Voice Settings
                  </CardTitle>
                  <CardDescription>
                    Configure microphone and speaker settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Input Volume</Label>
                      <span className="text-sm">{voiceSettings.inputVolume}%</span>
                    </div>
                    <Slider 
                      value={voiceSettings.inputVolume} 
                      min={0} 
                      max={100} 
                      step={1}
                      onValueChange={(value) => handleVoiceSettingChange('inputVolume', value)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Output Volume</Label>
                      <span className="text-sm">{voiceSettings.outputVolume}%</span>
                    </div>
                    <Slider 
                      value={voiceSettings.outputVolume} 
                      min={0} 
                      max={100} 
                      step={1}
                      onValueChange={(value) => handleVoiceSettingChange('outputVolume', value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Voice Type</Label>
                    <RadioGroup 
                      value={voiceSettings.voiceType}
                      onValueChange={(value) => handleVoiceSettingChange('voiceType', value)}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="neutral" id="neutral" />
                        <Label htmlFor="neutral">Neutral</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional">Professional</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="friendly" id="friendly" />
                        <Label htmlFor="friendly">Friendly</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Noise Reduction</Label>
                        <p className="text-sm text-muted-foreground">Reduce background noise during calls</p>
                      </div>
                      <Switch 
                        checked={voiceSettings.noiseReduction}
                        onCheckedChange={(value) => handleVoiceSettingChange('noiseReduction', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Echo Cancellation</Label>
                        <p className="text-sm text-muted-foreground">Remove echo from audio input</p>
                      </div>
                      <Switch 
                        checked={voiceSettings.echoCancel}
                        onCheckedChange={(value) => handleVoiceSettingChange('echoCancel', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Gain Control</Label>
                        <p className="text-sm text-muted-foreground">Automatically adjust microphone gain</p>
                      </div>
                      <Switch 
                        checked={voiceSettings.autoGainControl}
                        onCheckedChange={(value) => handleVoiceSettingChange('autoGainControl', value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast.success("Voice settings saved")}>
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationChange('email')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={() => handleNotificationChange('push')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Conversation Summaries</Label>
                      <p className="text-sm text-muted-foreground">Daily digest of agent interactions</p>
                    </div>
                    <Switch 
                      checked={notifications.conversationSummaries}
                      onCheckedChange={() => handleNotificationChange('conversationSummaries')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Analytics and performance reports</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyReports}
                      onCheckedChange={() => handleNotificationChange('weeklyReports')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Service Updates</Label>
                      <p className="text-sm text-muted-foreground">Platform announcements and new features</p>
                    </div>
                    <Switch 
                      checked={notifications.serviceUpdates}
                      onCheckedChange={() => handleNotificationChange('serviceUpdates')}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="api">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Manage your API keys for integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/20 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Production API Key</Label>
                        <Button variant="ghost" size="sm" onClick={() => toast.success("API key copied to clipboard")}>
                          Copy
                        </Button>
                      </div>
                      <Input
                        value="va_sk_prod_•••••••••••••••••••••••••••••"
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground mt-2">Created on Apr 10, 2025</p>
                    </div>
                    
                    <div className="p-4 bg-muted/20 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Development API Key</Label>
                        <Button variant="ghost" size="sm" onClick={() => toast.success("API key copied to clipboard")}>
                          Copy
                        </Button>
                      </div>
                      <Input
                        value="va_sk_dev_•••••••••••••••••••••••••••••"
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground mt-2">Created on Apr 15, 2025</p>
                    </div>
                    
                    <Button variant="outline" className="mt-4" onClick={() => toast.success("New API key generated")}>
                      Generate New Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="feature-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>
                    Configure endpoints for event notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input id="webhookUrl" placeholder="https://your-domain.com/webhook" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Events to Notify</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="conversation-start" />
                        <Label htmlFor="conversation-start">Conversation Start</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="conversation-end" />
                        <Label htmlFor="conversation-end">Conversation End</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="agent-created" />
                        <Label htmlFor="agent-created">Agent Created</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="agent-updated" />
                        <Label htmlFor="agent-updated">Agent Updated</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast.success("Webhook settings saved")}>
                    Save Webhook Settings
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
