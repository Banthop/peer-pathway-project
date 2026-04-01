import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardEvents from "@/pages/dashboard/DashboardEvents";

/**
 * Public-facing Events page - wraps the dashboard events component
 * with the site header and footer so non-logged-in visitors can browse.
 */
export default function PublicEvents() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="max-w-[1200px] mx-auto">
                <DashboardEvents />
            </main>
            <Footer />
        </div>
    );
}
