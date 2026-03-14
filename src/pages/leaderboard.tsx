import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { generateQuestionSets } from "@/lib/questionSets";
import { getCountryByCode } from "@/lib/countries";
import type { LeaderboardEntry, GameSession } from "@/types";
import { Trophy, Medal, Award } from "lucide-react";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSet, setSelectedSet] = useState<string>("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const questionSets = generateQuestionSets();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const sessions: GameSession[] = JSON.parse(localStorage.getItem("bible-quiz-sessions") || "[]");
    
    let entries: LeaderboardEntry[] = sessions.map(session => {
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
      entries = entries.filter(e => e.setId === selectedSet);
    }

    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeElapsed - b.timeElapsed;
    });

    setLeaderboard(entries.slice(0, 100));
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
            <CardTitle>Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No scores yet. Be the first to play!
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
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
      </div>
    </Layout>
  );
}