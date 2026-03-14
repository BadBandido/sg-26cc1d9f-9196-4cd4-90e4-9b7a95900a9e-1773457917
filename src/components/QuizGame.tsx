import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Question } from "@/types";
import { CheckCircle2, XCircle, Clock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizGameProps {
  questions: Question[];
  onComplete: (score: number, timeElapsed: number, answers: any[]) => void;
}

export function QuizGame({ questions, onComplete }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<any[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showResult]);

  const handleTimeout = () => {
    if (showResult) return;
    
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      selectedAnswer: null,
      isCorrect: false,
      timeSpent,
    }]);
    setShowResult(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    
    const newScore = isCorrect 
      ? score + currentQuestion.points 
      : score - currentQuestion.penalty;
    
    setScore(newScore);
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timeSpent,
    }]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
      setQuestionStartTime(Date.now());
    } else {
      const timeElapsed = (Date.now() - startTime) / 1000;
      onComplete(score, timeElapsed, answers);
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return "bg-green-500";
    if (timeLeft > 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getResultIcon = () => {
    if (selectedAnswer === null) return null;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    return isCorrect ? (
      <CheckCircle2 className="w-12 h-12 text-green-600" />
    ) : (
      <XCircle className="w-12 h-12 text-red-600" />
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-gold" />
          <span className="font-semibold text-lg">Score: {score}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Timer */}
      <Card className="border-2">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Time Remaining</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={cn("h-2 w-24 rounded-full overflow-hidden bg-muted", getTimerColor())}>
                <div 
                  className="h-full bg-current transition-all duration-1000"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
              <span className="text-2xl font-bold font-mono w-12 text-right">
                {timeLeft}s
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              currentQuestion.difficulty === "easy" && "bg-green-100 text-green-700",
              currentQuestion.difficulty === "moderate" && "bg-yellow-100 text-yellow-700",
              currentQuestion.difficulty === "hard" && "bg-red-100 text-red-700"
            )}>
              {currentQuestion.difficulty.toUpperCase()} • {currentQuestion.points} pts
            </span>
          </div>
          <CardTitle className="text-xl leading-relaxed max-h-32 overflow-y-auto">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelected = index === selectedAnswer;
            const showCorrectAnswer = showResult && isCorrect;
            const showWrongAnswer = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all max-h-24 overflow-y-auto",
                  "hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed",
                  showCorrectAnswer && "border-green-500 bg-green-50",
                  showWrongAnswer && "border-red-500 bg-red-50",
                  !showResult && "hover:scale-[1.02]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold flex-shrink-0",
                    showCorrectAnswer && "bg-green-500 text-white border-green-500",
                    showWrongAnswer && "bg-red-500 text-white border-red-500"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                  {showWrongAnswer && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Result Feedback */}
      {showResult && (
        <Card className="border-2 animate-fade-in">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              {getResultIcon()}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {selectedAnswer === null ? "Time's Up!" : 
                   selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAnswer === null ? "No answer selected" :
                   selectedAnswer === currentQuestion.correctAnswer 
                     ? `+${currentQuestion.points} points` 
                     : `-${currentQuestion.penalty} points`}
                </p>
                {selectedAnswer !== currentQuestion.correctAnswer && (
                  <p className="text-sm mt-2">
                    Correct answer: <span className="font-semibold">{currentQuestion.options[currentQuestion.correctAnswer]}</span>
                  </p>
                )}
              </div>
              <Button onClick={handleNext} size="lg">
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}