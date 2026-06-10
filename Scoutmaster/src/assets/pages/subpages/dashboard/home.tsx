import { useScreenType, useSignedIn } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

function DashboardHome() {
    const { t } = useTranslation();

    if (useScreenType() == "desktop") {
        return (
            <>
                <p>home desktop</p>
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
