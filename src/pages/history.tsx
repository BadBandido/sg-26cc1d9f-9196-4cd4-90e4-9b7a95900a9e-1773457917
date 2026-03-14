import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { BookOpen } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/");
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              The History of Bible Quizzing
            </CardTitle>
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
      </div>
    </Layout>
  );
}