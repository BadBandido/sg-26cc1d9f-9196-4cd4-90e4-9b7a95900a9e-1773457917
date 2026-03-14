import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { generateQuestionSets } from "@/lib/questionSets";
import type { QuestionSet, Question } from "@/types";
import { Download, Upload, Plus, Shield, Edit } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [editingSet, setEditingSet] = useState<QuestionSet | null>(null);
  const [newSetTitle, setNewSetTitle] = useState("");
  const [newSetQuestions, setNewSetQuestions] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/");
    }
  }, [mounted, user, router]);

  useEffect(() => {
    if (mounted && user) {
      setQuestionSets(generateQuestionSets());
    }
  }, [mounted, user]);

  if (!mounted || !user) {
    return null;
  }

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const admins = JSON.parse(localStorage.getItem("bible-quiz-admins") || "[]");
    admins.push({ username: newAdminUsername, password: newAdminPassword });
    localStorage.setItem("bible-quiz-admins", JSON.stringify(admins));
    
    alert(`Admin ${newAdminUsername} added successfully`);
    setNewAdminUsername("");
    setNewAdminPassword("");
  };

  const handleExportQuestions = () => {
    const sampleSet = questionSets[0];
    const jsonStr = JSON.stringify(sampleSet, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question-set-sample.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        
        const sets = JSON.parse(localStorage.getItem("bible-quiz-custom-sets") || "[]");
        sets.push(imported);
        localStorage.setItem("bible-quiz-custom-sets", JSON.stringify(sets));
        
        alert("Question set imported successfully!");
        setQuestionSets([...questionSets, imported]);
      } catch (error) {
        alert("Error importing file. Please ensure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleCreateSet = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const questions: Question[] = JSON.parse(newSetQuestions);
      
      if (!Array.isArray(questions) || questions.length !== 20) {
        alert("Question set must contain exactly 20 questions");
        return;
      }

      const newSet: QuestionSet = {
        id: `set-custom-${Date.now()}`,
        title: newSetTitle,
        questions,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
      };

      const sets = JSON.parse(localStorage.getItem("bible-quiz-custom-sets") || "[]");
      sets.push(newSet);
      localStorage.setItem("bible-quiz-custom-sets", JSON.stringify(sets));
      
      setQuestionSets([...questionSets, newSet]);
      alert("Question set created successfully!");
      setNewSetTitle("");
      setNewSetQuestions("");
    } catch (error) {
      alert("Invalid JSON format. Please check your questions structure.");
    }
  };

  const handleEditSet = (set: QuestionSet) => {
    setEditingSet(set);
    setNewSetTitle(set.title);
    setNewSetQuestions(JSON.stringify(set.questions, null, 2));
  };

  const handleUpdateSet = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSet) return;

    try {
      const questions: Question[] = JSON.parse(newSetQuestions);
      
      if (!Array.isArray(questions) || questions.length !== 20) {
        alert("Question set must contain exactly 20 questions");
        return;
      }

      const updatedSet: QuestionSet = {
        ...editingSet,
        title: newSetTitle,
        questions,
      };

      const sets = JSON.parse(localStorage.getItem("bible-quiz-custom-sets") || "[]");
      const index = sets.findIndex((s: QuestionSet) => s.id === editingSet.id);
      
      if (index !== -1) {
        sets[index] = updatedSet;
        localStorage.setItem("bible-quiz-custom-sets", JSON.stringify(sets));
        
        const updatedQuestionSets = questionSets.map(s => 
          s.id === editingSet.id ? updatedSet : s
        );
        setQuestionSets(updatedQuestionSets);
        
        alert("Question set updated successfully!");
        setEditingSet(null);
        setNewSetTitle("");
        setNewSetQuestions("");
      }
    } catch (error) {
      alert("Invalid JSON format. Please check your questions structure.");
    }
  };

  return (
    <Layout>
      <SEO title="Admin Panel - Bible Quiz" />
      
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage question sets and administrators</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Add New Administrator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newAdminUsername">Username</Label>
                <Input
                  id="newAdminUsername"
                  type="text"
                  placeholder="Enter username"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newAdminPassword">Password</Label>
                <Input
                  id="newAdminPassword"
                  type="password"
                  placeholder="Enter password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Administrator
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import/Export Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button onClick={handleExportQuestions} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Sample JSON
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportQuestions}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  onClick={() => document.getElementById("import-file")?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Question Set
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Export a sample JSON file to see the required format, or import a properly formatted JSON file to add new question sets.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingSet ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingSet ? "Edit Question Set" : "Create New Question Set"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingSet ? handleUpdateSet : handleCreateSet} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setTitle">Set Title</Label>
                <Input
                  id="setTitle"
                  type="text"
                  placeholder="e.g., Gospel of John - Set 1"
                  value={newSetTitle}
                  onChange={(e) => setNewSetTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setQuestions">Questions (JSON Array)</Label>
                <Textarea
                  id="setQuestions"
                  placeholder='[{"id": "q1", "question": "...", "options": [...], "correctAnswer": 0, "difficulty": "easy", "points": 10, "penalty": 5}, ...]'
                  value={newSetQuestions}
                  onChange={(e) => setNewSetQuestions(e.target.value)}
                  rows={10}
                  className="font-mono text-xs"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must be a JSON array of exactly 20 questions. Each question must have: id, question, options (array of 4), correctAnswer (0-3), difficulty, points, and penalty.
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSet ? "Update Set" : "Create Set"}
                </Button>
                {editingSet && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingSet(null);
                      setNewSetTitle("");
                      setNewSetQuestions("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Custom Sets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {questionSets.filter(s => s.id.startsWith("set-custom-")).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No custom question sets yet. Create one above or import from JSON.
                </p>
              ) : (
                questionSets
                  .filter(s => s.id.startsWith("set-custom-"))
                  .map(set => (
                    <div
                      key={set.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div>
                        <h3 className="font-semibold">{set.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {set.questions.length} questions • Created {new Date(set.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSet(set)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}