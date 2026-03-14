import { ReactNode } from "react";
import { Home, Trophy, History, Settings, BookText, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/play", label: "Play", icon: BookText },
  { href: "/leaderboard", label: "Top 100", icon: Trophy },
  { href: "/history", label: "History", icon: History },
  { href: "/guide", label: "Guide", icon: BookText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-32">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {children}
      </main>

      {/* Ad Placeholder */}
      <div className="fixed bottom-16 left-0 right-0 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 py-3 text-center text-sm text-muted-foreground">
          Advertisement Placeholder
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="overflow-x-auto">
          <div className="flex min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-6 py-3 transition-colors flex-shrink-0",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}