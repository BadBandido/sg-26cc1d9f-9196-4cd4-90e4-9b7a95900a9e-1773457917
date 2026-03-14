import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Trophy, Target, Clock } from "lucide-react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <Layout>
      <SEO title="Dashboard - Bible Quiz" />
      
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-serif">Welcome, {user.email.split("@")[0]}!</h1>
          <p className="text-muted-foreground">Test your biblical knowledge and compete worldwide</p>
        </div>

        <Card className="bg-gradient-hero text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              The Ultimate Bible Quizzing Game
            </CardTitle>
            <CardDescription className="text-white/80">
              Challenge yourself with 100 question sets covering all aspects of biblical knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>20 questions per set</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>30 seconds per question</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Earn up to 30 points</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>100 unique sets</span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full bg-gold hover:bg-gold/90 text-foreground font-semibold"
              onClick={() => router.push("/play")}
            >
              Start Playing Now
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Easy Questions</CardTitle>
              <CardDescription>Questions 1-8</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="text-green-600 font-semibold">+10 points correct</p>
                <p className="text-red-600">-5 points wrong</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Moderate Questions</CardTitle>
              <CardDescription>Questions 9-16</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="text-green-600 font-semibold">+20 points correct</p>
                <p className="text-red-600">-10 points wrong</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hard Questions</CardTitle>
              <CardDescription>Questions 17-20</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="text-green-600 font-semibold">+30 points correct</p>
                <p className="text-red-600">-15 points wrong</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold">
                1
              </div>
              <p>Select a question set from the Play page</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold">
                2
              </div>
              <p>Answer each question within 30 seconds</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold">
                3
              </div>
              <p>Earn points for correct answers, lose points for wrong ones</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold">
                4
              </div>
              <p>Compete for a spot in the Top 100 global leaderboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}