import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ColdEmailGuide() {
  const { toast } = useToast();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const copyPassword = () => {
    navigator.clipboard.writeText("RedMango");
    toast({
      title: "Password copied!",
      description: "You can now paste it into the guide's security check.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto p-4 md:p-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">The Cold Email System</h1>
              <p className="text-muted-foreground mt-2">
                The exact system, remastered and expanded. Read this before our Saturday workshop.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
              <div className="bg-primary/10 p-2 rounded-full hidden sm:block">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Protected Resource</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium">Password: <span className="font-mono bg-background px-2 py-0.5 rounded border">RedMango</span></span>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={copyPassword}>
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Access Wrapper - Updated because Subpage blocks iframes */}
        <div className="flex-1 rounded-2xl border bg-card/60 backdrop-blur shadow-sm relative min-h-[500px] flex flex-col justify-center items-center text-center p-8 mt-4">
          
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Unlock The Cold Email System</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            This premium resource is securely hosted. You will need the password <span className="font-mono text-sm bg-background border px-1.5 py-0.5 rounded">RedMango</span> to gain access on the next page.
          </p>

          <Button size="lg" className="h-12 px-8 text-base gap-2 rounded-xl" asChild>
            <a href="https://earlyedge-1758913924.subpage.co/Cold-Email-System-copy75c6db62" target="_blank" rel="noreferrer">
              Access the Guide <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </Button>
          
          <p className="text-xs text-muted-foreground mt-8">
            Clicking the button will open the secure document viewer in a new tab.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
