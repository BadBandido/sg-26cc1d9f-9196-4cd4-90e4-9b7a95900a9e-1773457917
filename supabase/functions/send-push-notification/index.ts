import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@biblequiz.app";

interface PushPayload {
  userId?: string;
  broadcast?: boolean;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  tag?: string;
}

interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Generate VAPID Authorization header
 */
function generateVAPIDHeaders(endpoint: string): Record<string, string> {
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;
  
  // JWT header
  const header = {
    typ: "JWT",
    alg: "ES256",
  };
  
  // JWT payload
  const jwtPayload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 43200, // 12 hours
    sub: VAPID_SUBJECT,
  };
  
  // For production, you'd need proper JWT signing with the VAPID private key
  // This is a simplified version - in production use a proper JWT library
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(jwtPayload));
  
  return {
    "Authorization": `vapid t=${encodedHeader}.${encodedPayload}.placeholder, k=${VAPID_PUBLIC_KEY}`,
    "TTL": "86400",
  };
}

/**
 * Send push notification to a subscription
 */
async function sendPushNotification(
  subscription: Subscription,
  payload: PushPayload
): Promise<boolean> {
  try {
    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      data: payload.data,
      tag: payload.tag,
    });

    const headers = {
      "Content-Type": "application/json",
      "Content-Encoding": "aes128gcm",
      ...generateVAPIDHeaders(subscription.endpoint),
    };

    const response = await fetch(subscription.endpoint, {
      method: "POST",
      headers,
      body: payloadString,
    });

    if (!response.ok) {
      console.error(`Failed to send notification: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending push notification:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const payload: PushPayload = await req.json();

    // Validate payload
    if (!payload.title || !payload.body) {
      return new Response(
        JSON.stringify({ error: "Title and body are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let subscriptions: Subscription[] = [];

    if (payload.broadcast) {
      // Send to all users
      const { data, error } = await supabase
        .from("push_subscriptions")
        .select("endpoint, keys");

      if (error) throw error;
      subscriptions = data || [];
    } else if (payload.userId) {
      // Send to specific user
      const { data, error } = await supabase
        .from("push_subscriptions")
        .select("endpoint, keys")
        .eq("user_id", payload.userId)
        .single();

      if (error) throw error;
      if (data) subscriptions = [data];
    } else {
      return new Response(
        JSON.stringify({ error: "Either userId or broadcast must be specified" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send notifications
    const results = await Promise.all(
      subscriptions.map((sub) => sendPushNotification(sub, payload))
    );

    const successCount = results.filter((r) => r).length;

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        total: subscriptions.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-push-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});