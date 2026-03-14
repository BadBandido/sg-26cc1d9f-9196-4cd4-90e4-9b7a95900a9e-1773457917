import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { QuizGame } from "@/components/QuizGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { generateQuestionSets } from "@/lib/questionSets";
import type { GameSession, QuestionSet } from "@/types";
import { Trophy, Clock, Target, Home } from "lucide-react";

export default function QuizPage() {
  const router = useRouter();
  const { setId } = router.query;
  const { user } = useAuth();
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (setId && typeof setId === "string") {
      const sets = generateQuestionSets();
      const set = sets.find(s => s.id === setId);
      if (set) {
        setQuestionSet(set);
      } else {
        router.push("/play");
      }
    }
  }, [setId, user, router]);

  const handleQuizComplete = (score: number, timeElapsed: number, answers: any[]) => {
    if (!user || !questionSet) return;

    const session: GameSession = {
      id: `session-${Date.now()}`,
      userId: user.id,
      setId: questionSet.id,
      score,
      completedAt: new Date().toISOString(),
      timeElapsed,
      answers,
    };

    setGameSession(session);
    setGameComplete(true);

    // Save to localStorage
    const sessions = JSON.parse(localStorage.getItem("bible-quiz-sessions") || "[]");
    sessions.push(session);
    localStorage.setItem("bible-quiz-sessions", JSON.stringify(sessions));
  };

  const handlePlayAgain = () => {
    setGameComplete(false);
    setGameSession(null);
    router.reload();
  };

  const handleBackToSets = () => {
    router.push("/play");
  };

  if (!user || !questionSet) {
    return null;
  }

  if (gameComplete && gameSession) {
    return (
      <Layout>
        <SEO title="Quiz Complete - Bible Quiz" />
        
        <div className="space-y-6 animate-fade-in">
          <Card className="bg-gradient-hero text-white border-0">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gold rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <div className="text-6xl font-bold">{gameSession.score}</div>
                <div className="text-white/80">Total Score</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.floor(gameSession.timeElapsed)}s</div>
                  <div className="text-sm text-white/80">Time Taken</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <Target className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {gameSession.answers.filter(a => a.isCorrect).length}/{questionSet.questions.length}
                  </div>
                  <div className="text-sm text-white/80">Correct</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handlePlayAgain}
                  className="w-full bg-gold hover:bg-gold/90 text-foreground font-semibold"
                  size="lg"
                >
                  Play Again
                </Button>
                <Button 
                  onClick={handleBackToSets}
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/10"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Question Sets
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Answer Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameSession.answers.map((answer, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <span className="text-sm">Question {index + 1}</span>
                    <div className="flex items-center gap-2">
                      {answer.isCorrect ? (
                        <span className="text-green-600 font-semibold">+{questionSet.questions[index].points}</span>
                      ) : answer.selectedAnswer === null ? (
                        <span className="text-muted-foreground">No answer</span>
                      ) : (
                        <span className="text-red-600 font-semibold">-{questionSet.questions[index].penalty}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title={`${questionSet.title} - Bible Quiz`} />
      
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif">{questionSet.title}</h1>
          <p className="text-sm text-muted-foreground">Answer all questions to complete the quiz</p>
        </div>

        <QuizGame 
          questions={questionSet.questions}
          onComplete={handleQuizComplete}
        />
      </div>
    </Layout>
  );
}