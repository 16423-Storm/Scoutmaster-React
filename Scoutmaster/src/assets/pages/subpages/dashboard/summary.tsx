import { useState } from "react";

import { useScreenType } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import {
    useMatches,
    useTeams,
    updateSummary,
    getNumOfTeams,
} from "../../../scripts/localstorage";

import { FaRegStar, FaMountain } from "react-icons/fa";
import { BsAlignMiddle } from "react-icons/bs";

import type { ChangeEvent } from "react";

function DashboardSummary() {
    const { t } = useTranslation();

    const teams = useTeams((state) => state.teams);
    const matches = useMatches((state) => state.matches);

    const [position, setPosition] = useState(1);

    const handlePosBlur = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        updateSummary({ pos: Number(value) });
    };

    if (useScreenType() == "desktop") {
        return (
            <>
                <div
                    className="desktop-dash-maincontainer"
                    style={{
                        paddingLeft: "50px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                    }}
                >
                    <div className="desktop-dash-summary-topbar">
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <FaRegStar style={{ color: "#4F81A8" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>12345</p>
                                <p>Highest Average</p>
                            </div>
                        </div>
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <BsAlignMiddle style={{ color: "#4F9A91" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>12345</p>
                                <p>Highest Median</p>
                            </div>
                        </div>
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <FaMountain style={{ color: "#C28A4A" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>12345</p>
                                <p>Highest Peak</p>
                            </div>
                        </div>
                    </div>
                    <div className="desktop-dash-summary-infocontainer">
                        <div className="desktop-dash-summary-infocontainer-tabcontainer">
                            <div className="desktop-dash-summary-infocontainer-tabgroup">
                                <div className="desktop-dash-summary-infocontainer-tab">
                                    All Teams
                                </div>
                                <div className="desktop-dash-summary-infocontainer-tab">
                                    Top Picks
                                </div>
                                <div className="desktop-dash-summary-infocontainer-tab">
                                    Accept/Reject
                                </div>
                            </div>
                            <div className="desktop-dash-summary-infocontainer-tabgroup">
                                <div className="desktop-dash-summary-infocontainer-tab">
                                    <p>Position</p>
                                    <input
                                        type="number"
                                        value={position}
                                        onChange={(e) =>
                                            setPosition(Number(e.target.value))
                                        }
                                        onBlur={handlePosBlur}
                                        min={1}
                                        max={getNumOfTeams(false)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="desktop-dash-summary-tablecontainer">
                            <div className="desktop-dash-summary-header-row"></div>
                            <div className="desktop-dash-summary-table"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
}

export default DashboardSummary;
