import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { BookOpen, Clock, Trophy, Target, Award, PlayCircle } from "lucide-react";

export default function GuidePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <Layout>
      <SEO title="Guide - Bible Quiz" />
      
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">How to Play</h1>
          <p className="text-muted-foreground">Master the Ultimate Bible Quizzing Game</p>
        </div>

        <Card className="bg-gradient-hero text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Game Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Test your biblical knowledge through 100 unique question sets, each containing 20 carefully 
              crafted questions ranging from easy to hard difficulty levels.
            </p>
            <p>
              Compete with players worldwide, climb the leaderboard, and deepen your understanding 
              of Scripture through engaging gameplay.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Choose a Question Set</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the Play page and select from 100 available question sets. Use the search 
                  feature to find specific topics.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Answer Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Each question has 4 multiple-choice options. Select your answer within 30 seconds.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Review Results</h3>
                <p className="text-sm text-muted-foreground">
                  After each question, see the correct answer and your score update. Complete all 20 questions 
                  to finish the set.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Compete Globally</h3>
                <p className="text-sm text-muted-foreground">
                  Your score is automatically submitted to the leaderboard. Check your ranking on the Top 100 page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Difficulty Levels & Scoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Easy (Q1-8)</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-green-600 dark:text-green-500 font-semibold">✓ Correct: +10 points</p>
                  <p className="text-red-600 dark:text-red-500">✗ Wrong: -5 points</p>
                  <p className="text-muted-foreground">⏱ No answer: 0 points</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <h3 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">Moderate (Q9-16)</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-green-600 dark:text-green-500 font-semibold">✓ Correct: +20 points</p>
                  <p className="text-red-600 dark:text-red-500">✗ Wrong: -10 points</p>
                  <p className="text-muted-foreground">⏱ No answer: 0 points</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Hard (Q17-20)</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-green-600 dark:text-green-500 font-semibold">✓ Correct: +30 points</p>
                  <p className="text-red-600 dark:text-red-500">✗ Wrong: -15 points</p>
                  <p className="text-muted-foreground">⏱ No answer: 0 points</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timer System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              Each question has a 30-second countdown timer. The timer bar changes color to help you track time:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span><strong>Green (21-30s):</strong> Plenty of time remaining</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span><strong>Yellow (11-20s):</strong> Time running low</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span><strong>Red (0-10s):</strong> Act quickly!</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              If time runs out, the correct answer will be revealed and you'll receive 0 points for that question.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Leaderboards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Top 100 (Per Set)</h3>
              <p className="text-sm text-muted-foreground">
                View the highest scores for any specific question set. Rankings are based on score, with 
                completion time as a tiebreaker.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Global Top 100 (All Sets)</h3>
              <p className="text-sm text-muted-foreground">
                Found in the History page, this leaderboard shows the top players based on total accumulated 
                points across all question sets they've played.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Read questions carefully - all text is scrollable if it exceeds the visible area</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Don't rush on easy questions - they build your foundation score</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Hard questions are worth the risk - 30 points can boost your ranking significantly</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Adjust font size in Settings for better readability during long sessions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Play regularly to improve your biblical knowledge and climb the leaderboard</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}