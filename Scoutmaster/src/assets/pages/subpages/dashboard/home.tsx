import { useScreenType, useSignedIn } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

function DashboardHome() {
    const { t } = useTranslation();

    if (useScreenType() == "desktop") {
        return (
            <>
                <div className="desktop-dash-maincontainer">
                    <div className="desktop-dash-home-divider">
                        <div className="desktop-dash-home-infodisplay"></div>
                        <div className="desktop-dash-home-infodisplay"></div>
                        <div className="desktop-dash-home-infodisplay"></div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <p>home phone</p>
            </>
        );
    }
}

export default DashboardHome;
