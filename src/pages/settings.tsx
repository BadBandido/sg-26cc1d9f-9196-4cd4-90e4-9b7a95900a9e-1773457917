import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Switch } from "@/components/ui/switch";
import { 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications, 
  isSubscribedToPushNotifications,
  requestNotificationPermission,
  sendTestNotification 
} from "@/services/notificationService";
import { Bell, BellOff, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [fontSize, setFontSize] = useState("normal");
  const [theme, setTheme] = useState("navy");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Load saved settings
    const savedFontSize = localStorage.getItem("fontSize") || "normal";
    const savedTheme = localStorage.getItem("theme") || "navy";
    setFontSize(savedFontSize);
    setTheme(savedTheme);

    // Apply theme
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Check notification status
    checkNotificationStatus();
  }, [user, router]);

  const checkNotificationStatus = async () => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
      const subscribed = await isSubscribedToPushNotifications();
      setNotificationsEnabled(subscribed);
    }
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    localStorage.setItem("fontSize", value);
    
    // Apply font size
    const root = document.documentElement;
    if (value === "small") {
      root.style.fontSize = "14px";
    } else if (value === "large") {
      root.style.fontSize = "18px";
    } else {
      root.style.fontSize = "16px";
    }

    toast({
      title: "Font Size Updated",
      description: `Font size changed to ${value}`,
    });
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    document.documentElement.setAttribute("data-theme", value);

    toast({
      title: "Theme Updated",
      description: `Color theme changed to ${value}`,
    });
  };

  const handleAdminLogin = () => {
    if (adminUsername === "Lexiboy" && adminPassword === "KingDavid1971") {
      router.push("/admin");
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    setLoadingNotifications(true);
    
    try {
      if (enabled) {
        // Request permission first
        const permission = await requestNotificationPermission();
        setNotificationPermission(permission);

        if (permission === "granted") {
          const subscription = await subscribeToPushNotifications();
          if (subscription) {
            setNotificationsEnabled(true);
            toast({
              title: "Notifications Enabled",
              description: "You will now receive push notifications",
            });
          } else {
            throw new Error("Failed to subscribe");
          }
        } else {
          toast({
            title: "Permission Denied",
            description: "Please enable notifications in your browser settings",
            variant: "destructive",
          });
        }
      } else {
        const success = await unsubscribeFromPushNotifications();
        if (success) {
          setNotificationsEnabled(false);
          toast({
            title: "Notifications Disabled",
            description: "You will no longer receive push notifications",
          });
        }
      }
    } catch (error) {
      console.error("Error toggling notifications:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      toast({
        title: "Test Notification Sent",
        description: "Check your notifications!",
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Layout>
      <SEO title="Settings - Bible Quiz" />
      
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your quiz experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Select Theme</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose a color scheme that suits your preference. The theme will be applied across the entire app.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Font Size
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fontSize">Select Font Size</Label>
              <Select value={fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger id="fontSize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Adjust text size for better readability during quizzes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Administrator Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminUsername">Username</Label>
                <Input
                  id="adminUsername"
                  type="text"
                  placeholder="Enter admin username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login to Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive notifications about new quiz sets, achievements, and leaderboard updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new content and updates
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
                disabled={loadingNotifications || notificationPermission === "denied"}
              />
            </div>

            {notificationPermission === "denied" && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <BellOff className="h-4 w-4 inline mr-2" />
                Notifications are blocked. Please enable them in your browser settings.
              </div>
            )}

            {notificationsEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                className="w-full"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Send Test Notification
              </Button>
            )}

            <div className="text-xs text-muted-foreground">
              <strong>Note:</strong> Notifications work best when the app is installed as a PWA.
              Use the "Install" button at the bottom of the screen to install the app.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm">{user.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <p className="text-sm">{user.country}</p>
            </div>
            <Button variant="destructive" onClick={logout} className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}