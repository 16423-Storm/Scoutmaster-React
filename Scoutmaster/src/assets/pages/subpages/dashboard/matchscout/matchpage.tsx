import { useEffect, useState, type ChangeEvent } from "react";
import { useScreenType } from "../../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import {
    useMatches,
    updateScore,
    updateNote,
} from "../../../../scripts/localstorage";
import Blocker499 from "../../../components/blocker";

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

    const [notesOpen, setNotesOpen] = useState(false);

    if (useScreenType() == "desktop") {
        return (
            <>
                {notesOpen && (
                    <NotesPopUp
                        matchId={match}
                        station={currentStation}
                        onClose={() => setNotesOpen(false)}
                    />
                )}
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
                                        <p>{t("tipswithcolon")}</p>
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
                                                            -1,
                                                            true,
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
                                                        1,
                                                        true,
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>{t("ballslaunchedwithcolon")}</p>
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
                                                            -1,
                                                            true,
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
                                                        1,
                                                        true,
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
                                        <p>{t("leavewithcolon")}</p>
                                        <div className="desktop-dash-match-scorecontainer-checkinput-container">
                                            <button
                                                onClick={() => {
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        2,
                                                        0,
                                                        false,
                                                    );
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][2] == 0
                                                }
                                            >
                                                ✕
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        2,
                                                        1,
                                                        false,
                                                    )
                                                }
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][2] == 1
                                                }
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>{t("parkwithcolon")}</p>
                                        <div className="desktop-dash-match-scorecontainer-checkinput-container">
                                            <button
                                                onClick={() => {
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        3,
                                                        0,
                                                        false,
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
                                                        false,
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
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Notes:</p>
                                        <button
                                            className="desktop-dash-comp-infodisplay-button"
                                            onClick={() => setNotesOpen(true)}
                                        >
                                            Notes
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="desktop-dash-match-scorecontainer-row">
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>{t("tipswithcolon")}</p>
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
                                                            -1,
                                                            true,
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
                                                        1,
                                                        true,
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>{t("ballslaunchedwithcolon")}</p>
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
                                                            -1,
                                                            true,
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
                                                        1,
                                                        true,
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>{t("gardenwithcolon")}</p>
                                        <div className="desktop-dash-match-scorecontainer-numinput-container">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        target.scores[
                                                            currentStation
                                                        ][8] -
                                                            1 >
                                                        -1
                                                    ) {
                                                        updateScore(
                                                            match,
                                                            currentStation,
                                                            8,
                                                            -1,
                                                            true,
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][8] == 0
                                                }
                                            >
                                                -
                                            </button>
                                            <div>
                                                {
                                                    target.scores[
                                                        currentStation
                                                    ][8]
                                                }
                                            </div>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        8,
                                                        1,
                                                        true,
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
                                        <p>{t("ballsinflowerwithcolon")}</p>
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
                                                            -1,
                                                            true,
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
                                                        1,
                                                        true,
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>{t("parkwithcolon")}</p>
                                        <div className="desktop-dash-match-scorecontainer-checkinput-container">
                                            <button
                                                onClick={() => {
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        7,
                                                        0,
                                                        false,
                                                    );
                                                }}
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][7] == 0
                                                }
                                            >
                                                ✕
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        7,
                                                        1,
                                                        false,
                                                    )
                                                }
                                                disabled={
                                                    target.scores[
                                                        currentStation
                                                    ][7] == 1
                                                }
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    </div>
                                    <div className="desktop-dash-match-scorecontainer-labelcontainer">
                                        <p>Notes:</p>
                                        <button
                                            className="desktop-dash-comp-infodisplay-button"
                                            onClick={() => setNotesOpen(true)}
                                        >
                                            Notes
                                        </button>
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
                                {t("auto")}
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
                                {t("teleop")}
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
                {notesOpen && (
                    <NotesPopUp
                        matchId={match}
                        station={currentStation}
                        onClose={() => setNotesOpen(false)}
                    />
                )}
                <div className="phone-dash-prescout-team-maincontainer">
                    <button
                        className="phone-dash-prescout-team-backbutton"
                        onClick={onBack}
                    >
                        &lt; Back
                    </button>
                    <div className="phone-dash-matchscout-scorecontainer">
                        {isAuto ? (
                            <>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("tipswithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-numinput-container">
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
                                                        -1,
                                                        true,
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
                                            {target.scores[currentStation][0]}
                                        </div>
                                        <button
                                            onClick={() =>
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    0,
                                                    1,
                                                    true,
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("ballslaunchedwithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-numinput-container">
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
                                                        -1,
                                                        true,
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
                                            {target.scores[currentStation][1]}
                                        </div>
                                        <button
                                            onClick={() =>
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    1,
                                                    1,
                                                    true,
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("leavewithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-checkinput-container">
                                        <button
                                            onClick={() => {
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    2,
                                                    0,
                                                    false,
                                                );
                                            }}
                                            disabled={
                                                target.scores[
                                                    currentStation
                                                ][2] == 0
                                            }
                                        >
                                            ✕
                                        </button>
                                        <button
                                            onClick={() =>
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    2,
                                                    1,
                                                    false,
                                                )
                                            }
                                            disabled={
                                                target.scores[
                                                    currentStation
                                                ][2] == 1
                                            }
                                        >
                                            ✓
                                        </button>
                                    </div>
                                </div>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("parkwithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-checkinput-container">
                                        <button
                                            onClick={() => {
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    3,
                                                    0,
                                                    false,
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
                                                    false,
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
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>Notes:</p>
                                    <button
                                        className="phone-dash-comp-infodisplay-button"
                                        onClick={() => setNotesOpen(true)}
                                    >
                                        Auto Notes
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("tipswithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-numinput-container">
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
                                                        -1,
                                                        true,
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
                                            {target.scores[currentStation][4]}
                                        </div>
                                        <button
                                            onClick={() =>
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    4,
                                                    1,
                                                    true,
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("ballslaunchedwithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-numinput-container">
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
                                                        -1,
                                                        true,
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
                                            {target.scores[currentStation][5]}
                                        </div>
                                        <button
                                            onClick={() =>
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    5,
                                                    1,
                                                    true,
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("gardenwithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-numinput-container">
                                        <button
                                            onClick={() => {
                                                if (
                                                    target.scores[
                                                        currentStation
                                                    ][8] -
                                                        1 >
                                                    -1
                                                ) {
                                                    updateScore(
                                                        match,
                                                        currentStation,
                                                        8,
                                                        -1,
                                                        true,
                                                    );
                                                }
                                            }}
                                            disabled={
                                                target.scores[
                                                    currentStation
                                                ][8] == 0
                                            }
                                        >
                                            -
                                        </button>
                                        <div>
                                            {target.scores[currentStation][8]}
                                        </div>
                                        <button
                                            onClick={() =>
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    8,
                                                    1,
                                                    true,
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("ballsinflowerwithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-numinput-container">
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
                                                        -1,
                                                        true,
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
                                            {target.scores[currentStation][6]}
                                        </div>
                                        <button
                                            onClick={() =>
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    6,
                                                    1,
                                                    true,
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="phone-dash-match-scorecontainer-labelcontainer">
                                    <p>{t("parkwithcolon")}</p>
                                    <div className="phone-dash-match-scorecontainer-checkinput-container">
                                        <button
                                            onClick={() => {
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    7,
                                                    0,
                                                    false,
                                                );
                                            }}
                                            disabled={
                                                target.scores[
                                                    currentStation
                                                ][7] == 0
                                            }
                                        >
                                            ✕
                                        </button>
                                        <button
                                            onClick={() =>
                                                updateScore(
                                                    match,
                                                    currentStation,
                                                    7,
                                                    1,
                                                    false,
                                                )
                                            }
                                            disabled={
                                                target.scores[
                                                    currentStation
                                                ][7] == 1
                                            }
                                        >
                                            ✓
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="phone-dash-matchscout-selectioncontainer">
                        <div className="phone-dash-matchscout-selectioncontainer-row">
                            <button
                                className="phone-dash-matchscout-selectioncontainer-row-modebutton"
                                disabled={isAuto}
                                onClick={() => setIsAuto(true)}
                            >
                                {t("auto")}
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
                                {t("teleop")}
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

function NotesPopUp({
    station,
    matchId,
    onClose,
}: {
    station: number;
    matchId: string;
    onClose: () => void;
}) {
    const { t } = useTranslation();

    const matchState = useMatches((state) => state.matches[matchId]);
    const [area, setArea] = useState(matchState.scores[station][9] ?? "");

    useEffect(() => {
        setArea(matchState.scores[station][9] ?? "");
    }, [matchState, station]);

    const handleAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setArea(event.target.value);
    };

    const handleAreaBlur = () => {
        if (area !== "") {
            updateNote(matchId, station, 9, area, true);
        } else {
            updateNote(matchId, station, 9, "", true);
        }
    };

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    style={{ height: "30vh" }}
                >
                    <button
                        className="desktop-dash-match-scorecontainer-popupclose"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "20px",
                            width: "90%",
                            flexDirection: "column",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: "1.2rem",
                            }}
                        >
                            Notes
                        </p>
                        <div className="desktop-dash-prescout-team-lncontainer">
                            <textarea
                                rows={3}
                                maxLength={400}
                                value={area}
                                onChange={handleAreaChange}
                                className={
                                    area.length === 400
                                        ? "desktop-popupinput-maxedinput"
                                        : undefined
                                }
                                onBlur={handleAreaBlur}
                            />
                            <p
                                style={
                                    area.length === 400
                                        ? { color: "red" }
                                        : undefined
                                }
                            >
                                {t("/400s", { num: area.length })}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                <div className="phone-warningpopup">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "20px",
                            width: "90%",
                            flexDirection: "column",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: "1.2rem",
                            }}
                        >
                            Notes
                        </p>
                        <div className="phone-dash-prescout-team-lncontainer">
                            <textarea
                                rows={7}
                                maxLength={400}
                                value={area}
                                onChange={handleAreaChange}
                                className={
                                    area.length === 400
                                        ? "phone-popupinput-maxedinput"
                                        : undefined
                                }
                                onBlur={handleAreaBlur}
                                style={{ width: "90%" }}
                            />
                            <p
                                style={
                                    area.length === 400
                                        ? { color: "red" }
                                        : undefined
                                }
                            >
                                {t("/400s", { num: area.length })}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardMatchPage;
