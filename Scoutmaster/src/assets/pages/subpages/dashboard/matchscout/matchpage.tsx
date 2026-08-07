import { useState } from "react";
import { useScreenType } from "../../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import type { Match } from "../../../../scripts/localstorage";

function DashboardMatchPage({ match }: { match: Match }) {
    const { t } = useTranslation();

    /**0 = Red 1,
     * 1 = Red 2,
     * 2 = Blue 1,
     * 3 = Blue 2 */
    const [currentStation, setCurrentStation] = useState(0);

    const [isAuto, setIsAuto] = useState(true);

    if (useScreenType() == "desktop") {
        return (
            <>
                <div className="desktop-dash-prescout-team-maincontainer">
                    <div className="desktop-dash-matchscout-scorecontainer"></div>
                    <div className="desktop-dash-matchscout-selectioncontainer">
                        <div className="desktop-dash-matchscout-selectioncontainer-row">
                            <button className="desktop-dash-matchscout-selectioncontainer-row-modebutton">
                                Auto
                            </button>
                            <button className="desktop-dash-matchscout-selectioncontainer-row-teambutton-red">
                                1
                            </button>
                            <button className="desktop-dash-matchscout-selectioncontainer-row-teambutton-red">
                                2
                            </button>
                        </div>
                        <div className="desktop-dash-matchscout-selectioncontainer-row">
                            <button className="desktop-dash-matchscout-selectioncontainer-row-modebutton">
                                TeleOp
                            </button>
                            <button className="desktop-dash-matchscout-selectioncontainer-row-teambutton-blue">
                                3
                            </button>
                            <button className="desktop-dash-matchscout-selectioncontainer-row-teambutton-blue">
                                4
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
}

export default DashboardMatchPage;
