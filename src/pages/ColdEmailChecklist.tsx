import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckSquare } from "lucide-react";
import { useState } from "react";

export default function ColdEmailChecklist() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto p-4 md:p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">The Cold Email Checklist</h1>
            <p className="text-muted-foreground mt-2">
              Cross-reference your cold emails against this checklist before sending.
            </p>
          </div>
          
          <Button asChild variant="outline">
            <a href="https://drive.google.com/file/d/1eZXMKvRZZ8cs6R4Ilykr_jnR8I-aJ35r/view" target="_blank" rel="noreferrer">
              Open Origin Document <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
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
              <CheckSquare className="w-3 h-3" />
              EarlyEdge Viewer
            </div>
            <div className="w-[100px]"></div> {/* Spacer for balance */}
          </div>
          
          <div className="flex-1 relative bg-muted/10 w-full h-full">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-background">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground animate-pulse">Loading checklist...</p>
              </div>
            )}
            {/* Using /preview instead of /view for better embedding on Google Drive links */}
            <iframe 
              src="https://drive.google.com/file/d/1eZXMKvRZZ8cs6R4Ilykr_jnR8I-aJ35r/preview"
              className="w-full h-full border-0 absolute inset-0"
              onLoad={() => setIframeLoaded(true)}
              title="Cold Email Checklist"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
