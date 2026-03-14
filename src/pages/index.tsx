import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { SplashScreen } from "@/components/SplashScreen";
import { SEO } from "@/components/SEO";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <>
      <SEO 
        title="The Ultimate Bible Quizzing Game"
        description="Test your biblical knowledge and compete with players worldwide"
      />
      <SplashScreen />
    </>
  );
}