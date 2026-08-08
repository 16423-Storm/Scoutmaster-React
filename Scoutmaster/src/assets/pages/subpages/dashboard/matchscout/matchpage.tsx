import { useState } from "react";
import { useScreenType } from "../../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import type { Match } from "../../../../scripts/localstorage";

function DashboardMatchPage({
    match,
    onBack,
}: {
    onBack: () => void;
    match: Match;
}) {
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
                    <button
                        className="desktop-dash-prescout-team-backbutton"
                        onClick={onBack}
                    >
                        &lt; Back
                    </button>
                    <div className="desktop-dash-matchscout-scorecontainer"></div>
                    <div className="desktop-dash-matchscout-selectioncontainer">
                        <div className="desktop-dash-matchscout-selectioncontainer-row">
                            <button
                                className="desktop-dash-matchscout-selectioncontainer-row-modebutton"
                                disabled={isAuto}
                                onClick={() => setIsAuto(true)}
                            >
                                Auto
                            </button>
                            <button
                                className="desktop-dash-matchscout-selectioncontainer-row-teambutton-red"
                                disabled={currentStation == 0}
                                onClick={() => setCurrentStation(0)}
                            >
                                {match.red1}
                            </button>
                            <button
                                className="desktop-dash-matchscout-selectioncontainer-row-teambutton-red"
                                disabled={currentStation == 1}
                                onClick={() => setCurrentStation(1)}
                            >
                                {match.red2}
                            </button>
                        </div>
                        <div className="desktop-dash-matchscout-selectioncontainer-row">
                            <button
                                className="desktop-dash-matchscout-selectioncontainer-row-modebutton"
                                disabled={!isAuto}
                                onClick={() => setIsAuto(false)}
                            >
                                TeleOp
                            </button>
                            <button
                                className="desktop-dash-matchscout-selectioncontainer-row-teambutton-blue"
                                disabled={currentStation == 2}
                                onClick={() => setCurrentStation(2)}
                            >
                                {match.blue1}
                            </button>
                            <button
                                className="desktop-dash-matchscout-selectioncontainer-row-teambutton-blue"
                                disabled={currentStation == 3}
                                onClick={() => setCurrentStation(3)}
                            >
                                {match.blue2}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="phone-dash-prescout-team-maincontainer">
                    <button
                        className="phone-dash-prescout-team-backbutton"
                        onClick={onBack}
                    >
                        &lt; Back
                    </button>
                    <div className="phone-dash-matchscout-scorecontainer"></div>
                    <div className="phone-dash-matchscout-selectioncontainer">
                        <div className="phone-dash-matchscout-selectioncontainer-row">
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-modebutton"
                                disabled={isAuto}
                                onClick={() => setIsAuto(true)}
                            >
                                Auto
                            </button>
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-teambutton-red"
                                disabled={currentStation == 0}
                                onClick={() => setCurrentStation(0)}
                            >
                                {match.red1}
                            </button>
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-teambutton-red"
                                disabled={currentStation == 1}
                                onClick={() => setCurrentStation(1)}
                            >
                                {match.red2}
                            </button>
                        </div>
                        <div className="phone-dash-matchscout-selectioncontainer-row">
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-modebutton"
                                disabled={!isAuto}
                                onClick={() => setIsAuto(false)}
                            >
                                TeleOp
                            </button>
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-teambutton-blue"
                                disabled={currentStation == 2}
                                onClick={() => setCurrentStation(2)}
                            >
                                {match.blue1}
                            </button>
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-teambutton-blue"
                                disabled={currentStation == 3}
                                onClick={() => setCurrentStation(3)}
                            >
                                {match.blue2}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardMatchPage;
