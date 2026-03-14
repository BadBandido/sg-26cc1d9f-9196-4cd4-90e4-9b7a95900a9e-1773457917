import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { generateQuestionSets } from "@/lib/questionSets";
import { Search, Play } from "lucide-react";

export default function PlayPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const questionSets = generateQuestionSets();

  if (!user) {
    router.push("/");
    return null;
  }

  const filteredSets = questionSets.filter(set =>
    set.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startQuiz = (setId: string) => {
    router.push(`/quiz/${setId}`);
  };

  return (
    <Layout>
      <SEO title="Play - Bible Quiz" />
      
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">Choose a Question Set</h1>
          <p className="text-muted-foreground">Select from 100 unique Bible quiz sets</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search question sets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4">
          {filteredSets.map((set, index) => (
            <Card key={set.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      {index + 1}. {set.title}
                    </CardTitle>
                    <CardDescription>
                      {set.questions.length} questions • Created {new Date(set.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => startQuiz(set.id)}
                    className="flex-shrink-0"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Easy: 8 questions</span>
                  <span>•</span>
                  <span>Moderate: 8 questions</span>
                  <span>•</span>
                  <span>Hard: 4 questions</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSets.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No question sets found matching "{searchTerm}"
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}