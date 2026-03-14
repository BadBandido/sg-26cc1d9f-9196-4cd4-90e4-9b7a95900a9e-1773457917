import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { getCountryByCode } from "@/lib/countries";
import type { GlobalLeaderboardEntry, GameSession } from "@/types";
import { BookOpen, Trophy } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [globalLeaderboard, setGlobalLeaderboard] = useState<GlobalLeaderboardEntry[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const sessions: GameSession[] = JSON.parse(localStorage.getItem("bible-quiz-sessions") || "[]");
    const sessionUser = JSON.parse(localStorage.getItem("bible-quiz-user") || "{}");
    
    const userStats = new Map<string, GlobalLeaderboardEntry>();
    
    sessions.forEach(session => {
      const existing = userStats.get(session.userId);
      
      if (!existing) {
        userStats.set(session.userId, {
          userId: session.userId,
          email: sessionUser.email || "Unknown",
          country: sessionUser.country || "Unknown",
          countryCode: sessionUser.countryCode || "US",
          totalScore: session.score,
          gamesPlayed: 1,
          highestScore: session.score,
          fastestTime: session.timeElapsed,
        });
      } else {
        existing.totalScore += session.score;
        existing.gamesPlayed += 1;
        existing.highestScore = Math.max(existing.highestScore, session.score);
        existing.fastestTime = Math.min(existing.fastestTime, session.timeElapsed);
      }
    });

    const entries = Array.from(userStats.values()).sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;
      return a.fastestTime - b.fastestTime;
    });

    setGlobalLeaderboard(entries.slice(0, 100));
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <SEO title="History - Bible Quiz" />
      
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">History</h1>
          <p className="text-muted-foreground">Learn about Bible quizzing heritage</p>
        </div>

        <Tabs defaultValue="article" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="article">
              <BookOpen className="w-4 h-4 mr-2" />
              History Article
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="w-4 h-4 mr-2" />
              Global Top 100
            </TabsTrigger>
          </TabsList>

          <TabsContent value="article" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>The History of Bible Quizzing</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  Bible quizzing has been a cherished tradition in Christian education for over a century, 
                  combining scriptural memorization with competitive spirit. What began as simple question-and-answer 
                  sessions in Sunday schools evolved into organized competitions that span continents.
                </p>
                <p>
                  The modern Bible quiz movement gained momentum in the mid-20th century when churches recognized 
                  the power of gamification in scripture learning. Young people who might struggle with traditional 
                  study methods found themselves memorizing entire books of the Bible to compete at regional, 
                  national, and international tournaments.
                </p>
                <p>
                  Today, thousands of churches worldwide participate in Bible quizzing programs, with organizations 
                  developing standardized rules, training materials, and competition formats. The activity has produced 
                  generations of believers with deep scriptural knowledge and quick recall abilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>United Pentecostal Church International (UPCI)</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  The United Pentecostal Church International has maintained one of the most active and competitive 
                  Bible quizzing programs in modern Christianity. Since its inception, UPCI Quiz has emphasized 
                  not just memorization, but deep understanding and application of scripture.
                </p>
                <p>
                  UPCI's program follows a structured curriculum, with participants studying specific books of the 
                  Bible each year. Quizzers compete at local, district, regional, and international levels, with 
                  the International Bible Quiz Finals drawing hundreds of top competitors annually.
                </p>
                <p>
                  The program has been instrumental in developing young leaders, with many former quizzers becoming 
                  pastors, missionaries, and influential voices in the church. The discipline of scripture memorization 
                  and the camaraderie of competition create lasting impacts on participants' spiritual lives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UPC Philippines Inc. Perspective</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  In the Philippines, Bible quizzing under UPC Philippines Inc. has become a cornerstone of youth 
                  ministry, with hundreds of churches participating nationwide. The Filipino quiz community is known 
                  for its passionate competitors and impressive scripture memorization.
                </p>
                <p>
                  Philippine quizzers have distinguished themselves on the international stage, regularly placing 
                  in top positions at global competitions. The program has grown from a handful of churches to a 
                  nationwide movement, with district-level competitions drawing large crowds of supporters.
                </p>
                <p>
                  The cultural emphasis on academic excellence and the Filipino church's commitment to youth development 
                  have made Bible quizzing particularly impactful in the region. Many Filipino youth credit their quiz 
                  experience with deepening their faith and providing lifelong friendships within the church.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 100 Overall Rankings</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Based on total accumulated points across all question sets
                </p>
              </CardHeader>
              <CardContent>
                {globalLeaderboard.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No scores yet. Start playing to appear on the leaderboard!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {globalLeaderboard.map((entry, index) => {
                      const country = getCountryByCode(entry.countryCode);
                      return (
                        <div
                          key={entry.userId}
                          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 text-center font-bold text-lg">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{entry.email}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>{country?.flag}</span>
                              <span>{entry.country}</span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="font-bold text-lg text-primary">{entry.totalScore}</div>
                            <div className="text-xs text-muted-foreground">
                              {entry.gamesPlayed} games • Best: {entry.highestScore}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}