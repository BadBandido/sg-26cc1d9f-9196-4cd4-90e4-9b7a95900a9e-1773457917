import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications, 
  isSubscribedToPushNotifications,
  requestNotificationPermission,
  sendTestNotification 
} from "@/services/notificationService";
import { Bell, BellOff, TestTube, Palette, Type, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const themeOptions = [
  { value: "navy", label: "Navy Blue & Gold" },
  { value: "light", label: "Light Theme" },
  { value: "dark", label: "Dark Theme" },
];

const fontSizeOptions = [
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
];

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    notifications: false,
    sound: true,
    theme: "navy",
    fontSize: "normal",
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const loadSettings = () => {
      const savedSettings = localStorage.getItem("quizSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };

    const checkNotificationStatus = async () => {
      if ("Notification" in window) {
        setNotificationPermission(Notification.permission);
        const subscribed = await isSubscribedToPushNotifications();
        setIsSubscribed(subscribed);
        setSettings(prev => ({ ...prev, notifications: subscribed }));
      }
    };

    loadSettings();
    checkNotificationStatus();
  }, [mounted]);

  const handleSettingChange = (key: string, value: string | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("quizSettings", JSON.stringify(newSettings));
    
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enable notifications.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);

    try {
      if (enabled) {
        const permission = await requestNotificationPermission();
        
        if (permission !== "granted") {
          toast({
            title: "Permission Denied",
            description: "Please enable notifications in your browser settings.",
            variant: "destructive",
          });
          setIsSubscribing(false);
          return;
        }

        await subscribeToPushNotifications();
        setIsSubscribed(true);
        handleSettingChange("notifications", true);
        
        toast({
          title: "Notifications Enabled",
          description: "You will now receive push notifications.",
        });
      } else {
        await unsubscribeFromPushNotifications();
        setIsSubscribed(false);
        handleSettingChange("notifications", false);
        
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive push notifications.",
        });
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSendTestNotification = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to send test notifications.",
        variant: "destructive",
      });
      return;
    }

    if (!isSubscribed) {
      toast({
        title: "Not Subscribed",
        description: "Please enable notifications first.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);

    try {
      await sendTestNotification(user.id);
      
      toast({
        title: "Test Notification Sent",
        description: "Check your device for the notification.",
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast({
        title: "Error",
        description: "Failed to send test notification.",
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Layout>
      <SEO 
        title="Settings - The Ultimate Bible Quizzing Game"
        description="Customize your Bible quiz experience with themes, notifications, and preferences."
      />
      
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-navy-900 dark:text-white">Settings</h1>

        {!user && (
          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-amber-900 dark:text-amber-100">
                <LogIn className="h-5 w-5" />
                <p className="font-medium">
                  Please log in to access all settings and enable push notifications.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive notifications about new quizzes, achievements, and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex-1">
                Enable Push Notifications
              </Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={handleNotificationToggle}
                disabled={!user || isSubscribing || notificationPermission === "denied"}
              />
            </div>

            {user && notificationPermission === "denied" && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                <BellOff className="inline h-4 w-4 mr-2" />
                Notifications are blocked. Please enable them in your browser settings.
              </div>
            )}

            {user && notificationPermission === "granted" && (
              <div className="text-sm text-muted-foreground">
                Permission Status: <span className="text-green-600 dark:text-green-400 font-medium">Granted</span>
              </div>
            )}

            {user && isSubscribed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendTestNotification}
                disabled={isSendingTest}
                className="w-full"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isSendingTest ? "Sending..." : "Send Test Notification"}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the app looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <select
                id="theme"
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                value={settings.theme}
                onChange={(e) => handleSettingChange("theme", e.target.value)}
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Font Size
              </Label>
              <select
                id="fontSize"
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
                value={settings.fontSize}
                onChange={(e) => handleSettingChange("fontSize", e.target.value)}
              >
                {fontSizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Version 1.0.0 - The Ultimate Bible Quizzing Game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Test your Bible knowledge with fun, engaging quizzes. Track your progress and compete with others on the leaderboard.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2026 Bible Quiz. All rights reserved.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}