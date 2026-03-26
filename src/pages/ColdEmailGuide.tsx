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

        {/* Premium Iframe Wrapper */}
        <div className="flex-1 rounded-2xl border bg-card overflow-hidden shadow-sm relative min-h-[700px] flex flex-col">
          {/* Top Browser-like header */}
          <div className="h-12 border-b bg-muted/30 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium bg-background px-4 py-1.5 rounded-md border shadow-sm">
              <Lock className="w-3 h-3" />
              EarlyEdge Secure Viewer
            </div>
            <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
              <a href="https://earlyedge-1758913924.subpage.co/Cold-Email-System-copy75c6db62" target="_blank" rel="noreferrer">
                Open Original <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            </Button>
          </div>
          
          <div className="flex-1 relative bg-muted/10 w-full h-full">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-background">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground animate-pulse">Loading premium resource...</p>
              </div>
            )}
            <iframe 
              src="https://earlyedge-1758913924.subpage.co/Cold-Email-System-copy75c6db62" 
              className="w-full h-full border-0 absolute inset-0"
              onLoad={() => setIframeLoaded(true)}
              title="Cold Email Guide"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
