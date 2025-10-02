import Hero from "@/app/components/LandingPage/Hero"
import Feutures from "../components/LandingPage/Feutures"
import Dashboard from "../components/LandingPage/Dashboard"
import CTA from "../components/LandingPage/CTA"
import Footer from "../components/LandingPage/Footer"


export default function DashboardPage() {
    return (
        <div>
            <Hero />
            <Feutures />
            <Dashboard />
            <CTA />
            <Footer />
        </div>
    )
}