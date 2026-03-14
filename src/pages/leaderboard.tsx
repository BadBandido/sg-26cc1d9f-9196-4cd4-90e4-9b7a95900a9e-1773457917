import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { generateQuestionSets } from "@/lib/questionSets";
import { getCountryByCode } from "@/lib/countries";
import type { LeaderboardEntry, GameSession, GlobalLeaderboardEntry } from "@/types";
import { Trophy, Medal, Award, Target } from "lucide-react";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSet, setSelectedSet] = useState<string>("all");
  const [perSetLeaderboard, setPerSetLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [accumulatedLeaderboard, setAccumulatedLeaderboard] = useState<GlobalLeaderboardEntry[]>([]);
  const questionSets = generateQuestionSets();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const sessions: GameSession[] = JSON.parse(localStorage.getItem("bible-quiz-sessions") || "[]");
    
    // Per Set Leaderboard
    let perSetEntries: LeaderboardEntry[] = sessions.map(session => {
      const sessionUser = JSON.parse(localStorage.getItem("bible-quiz-user") || "{}");
      return {
        userId: session.userId,
        email: sessionUser.email || "Unknown",
        country: sessionUser.country || "Unknown",
        countryCode: sessionUser.countryCode || "US",
        score: session.score,
        setId: session.setId,
        completedAt: session.completedAt,
        timeElapsed: session.timeElapsed,
      };
    });

    if (selectedSet !== "all") {
      perSetEntries = perSetEntries.filter(e => e.setId === selectedSet);
    }

    perSetEntries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeElapsed - b.timeElapsed;
    });

    setPerSetLeaderboard(perSetEntries.slice(0, 100));

    // Accumulated Leaderboard - Highest score per set only
    const userBestScores = new Map<string, Map<string, { score: number; time: number }>>();
    
    sessions.forEach(session => {
      if (!userBestScores.has(session.userId)) {
        userBestScores.set(session.userId, new Map());
      }
      
      const userSets = userBestScores.get(session.userId)!;
      const currentBest = userSets.get(session.setId);
      
      if (!currentBest || session.score > currentBest.score || 
          (session.score === currentBest.score && session.timeElapsed < currentBest.time)) {
        userSets.set(session.setId, { score: session.score, time: session.timeElapsed });
      }
    });

    const accumulatedEntries: GlobalLeaderboardEntry[] = [];
    const sessionUser = JSON.parse(localStorage.getItem("bible-quiz-user") || "{}");
    
    userBestScores.forEach((sets, userId) => {
      let totalScore = 0;
      let highestScore = 0;
      let fastestTime = Infinity;
      let setsCompleted = 0;

      sets.forEach(({ score, time }) => {
        totalScore += score;
        highestScore = Math.max(highestScore, score);
        fastestTime = Math.min(fastestTime, time);
        setsCompleted++;
      });

      accumulatedEntries.push({
        userId,
        email: sessionUser.email || "Unknown",
        country: sessionUser.country || "Unknown",
        countryCode: sessionUser.countryCode || "US",
        totalScore,
        gamesPlayed: setsCompleted,
        highestScore,
        fastestTime: fastestTime === Infinity ? 0 : fastestTime,
      });
    });

    accumulatedEntries.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;
      return a.fastestTime - b.fastestTime;
    });

    setAccumulatedLeaderboard(accumulatedEntries.slice(0, 100));
  }, [user, router, selectedSet]);

  if (!user) {
    return null;
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-gold" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <Layout>
      <SEO title="Top 100 - Bible Quiz" />
      
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">Top 100 Players</h1>
          <p className="text-muted-foreground">Global leaderboard rankings</p>
        </div>

        <Tabs defaultValue="per-set" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="per-set">
              <Target className="w-4 h-4 mr-2" />
              Per Set
            </TabsTrigger>
            <TabsTrigger value="accumulated">
              <Trophy className="w-4 h-4 mr-2" />
              Accumulated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="per-set" className="space-y-4 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Question Set</label>
              <Select value={selectedSet} onValueChange={setSelectedSet}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">All Sets</SelectItem>
                  {questionSets.map(set => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top 100 - Single Set Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Best scores on any single question set
                </p>
              </CardHeader>
              <CardContent>
                {perSetLeaderboard.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No scores yet. Be the first to play!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {perSetLeaderboard.map((entry, index) => {
                      const country = getCountryByCode(entry.countryCode);
                      return (
                        <div
                          key={`${entry.userId}-${entry.completedAt}`}
                          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 text-center font-bold text-lg">
                            {getRankIcon(index) || `#${index + 1}`}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{entry.email}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>{country?.flag}</span>
                              <span>{entry.country}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-primary">{entry.score}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.floor(entry.timeElapsed)}s
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

          <TabsContent value="accumulated" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 100 - Accumulated Points</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Combined highest scores from all question sets (one best score per set)
                </p>
              </CardHeader>
              <CardContent>
                {accumulatedLeaderboard.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No scores yet. Start playing to appear on the leaderboard!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {accumulatedLeaderboard.map((entry, index) => {
                      const country = getCountryByCode(entry.countryCode);
                      return (
                        <div
                          key={entry.userId}
                          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 text-center font-bold text-lg">
                            {getRankIcon(index) || `#${index + 1}`}
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
                              {entry.gamesPlayed} sets • Best: {entry.highestScore}
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