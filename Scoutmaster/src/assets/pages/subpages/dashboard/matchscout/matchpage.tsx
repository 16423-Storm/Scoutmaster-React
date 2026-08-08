import { useState } from "react";
import { useScreenType } from "../../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import type { Match } from "../../../../scripts/localstorage";
import { useMatches, updateScore } from "../../../../scripts/localstorage";

function DashboardMatchPage({
    match,
    onBack,
}: {
    onBack: () => void;
    match: string;
}) {
    const { t } = useTranslation();

    const target = useMatches((state) => state.matches[match]);

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
                    <div className="desktop-dash-matchscout-scorecontainer">
                        {isAuto ? (
                            <>
                                <div className="desktop-dash-match-scorecontainer-row">
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Classified:</p>
                                        <div className="desktop-dash-match-scorecontainer-numinput-container">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        target.scores[
                                                            currentStation
                                                        ][0] -
                                                            1 >
                                                        -1
                                                    ) {
                                                        updateScore(
                                                            match,
                                                            currentStation,
                                                            0,
                                                            (target.scores[
                                                                currentStation
                                                            ][0] -= 1),
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][0] == 0
                                                }
                                            >
                                                -
                                            </button>
                                            <div>
                                                {
                                                    target.scores[
                                                        currentStation
                                                    ][0]
                                                }
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        0,
                                                        (target.scores[
                                                            currentStation
                                                        ][0] += 1),
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Pattern:</p>
                                        <div className="desktop-dash-match-scorecontainer-numinput-container">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        target.scores[
                                                            currentStation
                                                        ][2] -
                                                            1 >
                                                        -1
                                                    ) {
                                                        updateScore(
                                                            match,
                                                            currentStation,
                                                            2,
                                                            (target.scores[
                                                                currentStation
                                                            ][2] -= 1),
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][2] == 0
                                                }
                                            >
                                                -
                                            </button>
                                            <div>
                                                {
                                                    target.scores[
                                                        currentStation
                                                    ][2]
                                                }
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        2,
                                                        (target.scores[
                                                            currentStation
                                                        ][2] += 1),
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="desktop-dash-match-scorecontainer-row">
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Overflow:</p>
                                        <div className="desktop-dash-match-scorecontainer-numinput-container">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        target.scores[
                                                            currentStation
                                                        ][1] -
                                                            1 >
                                                        -1
                                                    ) {
                                                        updateScore(
                                                            match,
                                                            currentStation,
                                                            1,
                                                            (target.scores[
                                                                currentStation
                                                            ][1] -= 1),
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][1] == 0
                                                }
                                            >
                                                -
                                            </button>
                                            <div>
                                                {
                                                    target.scores[
                                                        currentStation
                                                    ][1]
                                                }
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        1,
                                                        (target.scores[
                                                            currentStation
                                                        ][1] += 1),
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Leave:</p>
                                        <div className="desktop-dash-match-scorecontainer-checkinput-container">
                                            <button
                                                onClick={() => {
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        3,
                                                        0,
                                                    );
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][3] == 0
                                                }
                                            >
                                                ✕
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        3,
                                                        1,
                                                    )
                                                }
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][3] == 1
                                                }
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="desktop-dash-match-scorecontainer-row">
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Classified:</p>
                                        <div className="desktop-dash-match-scorecontainer-numinput-container">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        target.scores[
                                                            currentStation
                                                        ][4] -
                                                            1 >
                                                        -1
                                                    ) {
                                                        updateScore(
                                                            match,
                                                            currentStation,
                                                            4,
                                                            (target.scores[
                                                                currentStation
                                                            ][4] -= 1),
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][4] == 0
                                                }
                                            >
                                                -
                                            </button>
                                            <div>
                                                {
                                                    target.scores[
                                                        currentStation
                                                    ][4]
                                                }
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        4,
                                                        (target.scores[
                                                            currentStation
                                                        ][4] += 1),
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Pattern:</p>
                                        <div className="desktop-dash-match-scorecontainer-numinput-container">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        target.scores[
                                                            currentStation
                                                        ][6] -
                                                            1 >
                                                        -1
                                                    ) {
                                                        updateScore(
                                                            match,
                                                            currentStation,
                                                            6,
                                                            (target.scores[
                                                                currentStation
                                                            ][6] -= 1),
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][6] == 0
                                                }
                                            >
                                                -
                                            </button>
                                            <div>
                                                {
                                                    target.scores[
                                                        currentStation
                                                    ][6]
                                                }
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        6,
                                                        (target.scores[
                                                            currentStation
                                                        ][6] += 1),
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="desktop-dash-match-scorecontainer-row">
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Overflow:</p>
                                        <div className="desktop-dash-match-scorecontainer-numinput-container">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        target.scores[
                                                            currentStation
                                                        ][5] -
                                                            1 >
                                                        -1
                                                    ) {
                                                        updateScore(
                                                            match,
                                                            currentStation,
                                                            5,
                                                            (target.scores[
                                                                currentStation
                                                            ][5] -= 1),
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][5] == 0
                                                }
                                            >
                                                -
                                            </button>
                                            <div>
                                                {
                                                    target.scores[
                                                        currentStation
                                                    ][5]
                                                }
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        5,
                                                        (target.scores[
                                                            currentStation
                                                        ][5] += 1),
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Base:</p>
                                        <div className="desktop-dash-match-scorecontainer-baseinput-container">
                                            <button
                                                onClick={() => {
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        7,
                                                        0,
                                                    );
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][7] == 0
                                                }
                                            >
                                                None
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        7,
                                                        1,
                                                    )
                                                }
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][7] == 1
                                                }
                                            >
                                                Partial
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        7,
                                                        2,
                                                    )
                                                }
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][7] == 2
                                                }
                                            >
                                                Full
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
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
                                {target.red1}
                            </button>
                            <button
                                className="desktop-dash-matchscout-selectioncontainer-row-teambutton-red"
                                disabled={currentStation == 1}
                                onClick={() => setCurrentStation(1)}
                            >
                                {target.red2}
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
                                {target.blue1}
                            </button>
                            <button
                                className="desktop-dash-matchscout-selectioncontainer-row-teambutton-blue"
                                disabled={currentStation == 3}
                                onClick={() => setCurrentStation(3)}
                            >
                                {target.blue2}
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
                                {target.red1}
                            </button>
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-teambutton-red"
                                disabled={currentStation == 1}
                                onClick={() => setCurrentStation(1)}
                            >
                                {target.red2}
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
                                {target.blue1}
                            </button>
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-teambutton-blue"
                                disabled={currentStation == 3}
                                onClick={() => setCurrentStation(3)}
                            >
                                {target.blue2}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardMatchPage;
