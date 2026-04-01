import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardResources from "@/pages/dashboard/DashboardResources";

/**
 * Public-facing Resources page - wraps the dashboard resources component
 * with the site header and footer so non-logged-in visitors can browse.
 */
export default function PublicResources() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-[1200px] mx-auto">
                <DashboardResources />
            </main>
            <Footer />
        </div>
    );
}
