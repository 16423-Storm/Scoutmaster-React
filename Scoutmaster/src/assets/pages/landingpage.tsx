import { useScreenType } from "../scripts/multipageutils";

function LandingPage() {
    const screenType = useScreenType();
    if (screenType === "phone") {
        return (
            <div className="phone-landing-hero">
                <p className="phone-landing-herotitle">Scoutmaster</p>
            </div>
        );
    }

    if (screenType === "tablet") {
        return (
            <div>
                <p>hello</p>
            </div>
        );
    }

    return (
        <div>
            <p>helloe</p>
        </div>
    );
}

export default LandingPage;
