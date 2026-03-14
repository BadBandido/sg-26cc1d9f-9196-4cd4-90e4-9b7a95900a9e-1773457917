/**
 * Push Notification Service
 * Handles client-side push notification subscription and management
 */

import { supabase } from "@/integrations/supabase/client";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

/**
 * Convert VAPID public key to Uint8Array format
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return "denied";
  }

  return await Notification.requestPermission();
}

/**
 * Subscribe user to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    // Check if service worker is registered
    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    // Save subscription to database
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await saveSubscriptionToDatabase(user.id, subscription);
    }

    return subscription;
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      
      // Remove from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await removeSubscriptionFromDatabase(user.id);
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
    return false;
  }
}

/**
 * Check if user is subscribed to push notifications
 */
export async function isSubscribedToPushNotifications(): Promise<boolean> {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  } catch (error) {
    console.error("Error checking push subscription:", error);
    return false;
  }
}

/**
 * Save push subscription to Supabase database
 */
async function saveSubscriptionToDatabase(
  userId: string,
  subscription: PushSubscription
): Promise<void> {
  const subscriptionData = {
    user_id: userId,
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey("p256dh")),
      auth: arrayBufferToBase64(subscription.getKey("auth")),
    },
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(subscriptionData, { onConflict: "user_id" });

  if (error) {
    console.error("Error saving subscription to database:", error);
    throw error;
  }
}

/**
 * Remove push subscription from database
 */
async function removeSubscriptionFromDatabase(userId: string): Promise<void> {
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("Error removing subscription from database:", error);
    throw error;
  }
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return "";
  
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Send a test notification
 */
export async function sendTestNotification(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Call Edge Function to send notification
  const { error } = await supabase.functions.invoke("send-push-notification", {
    body: {
      userId: user.id,
      title: "Test Notification",
      body: "This is a test notification from The Ultimate Bible Quizzing Game!",
      icon: "/icon-192.svg",
      badge: "/icon-192.svg",
      data: {
        url: "/dashboard",
      },
    },
  });

  if (error) {
    console.error("Error sending test notification:", error);
    throw error;
  }
}

/**
 * Send notification to specific user
 */
export async function sendNotificationToUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  const { error } = await supabase.functions.invoke("send-push-notification", {
    body: {
      userId,
      title,
      body,
      icon: "/icon-192.svg",
      badge: "/icon-192.svg",
      data: data || {},
    },
  });

  if (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

/**
 * Send notification to all users (admin only)
 */
export async function sendNotificationToAll(
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> {
  const { error } = await supabase.functions.invoke("send-push-notification", {
    body: {
      broadcast: true,
      title,
      body,
      icon: "/icon-192.svg",
      badge: "/icon-192.svg",
      data: data || {},
    },
  });

  if (error) {
    console.error("Error broadcasting notification:", error);
    throw error;
  }
}