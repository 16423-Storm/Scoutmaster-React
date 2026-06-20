import { useScreenType, useSignedIn } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

function DashboardSettings() {
    const { t } = useTranslation();

    if (useScreenType() == "desktop") {
        return (
            <>
                <p>settings desktop</p>
            </>
        );
    } else {
        return (
            <>
                <p>settings phone</p>
            </>
        );
    }
}

export default DashboardSettings;
