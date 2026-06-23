// Script Imports
import { useScreenType } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { getCompKey } from "../../../scripts/localstorageutils";
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";

import data from "./comps.json";

import { FaRegSadTear } from "react-icons/fa";

import { WarningModal } from "../../components/popups";

function DashboardCompetition() {
    const { t } = useTranslation();

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearch(value);
        filterData(value);
    };

    const filterData = (search: string) => {
        const filteredData = data
            .filter(
                (item) =>
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.key.toLowerCase().includes(search.toLowerCase()),
            )
            .slice(0, 6);
        setFilteredData(filteredData);
    };

    useEffect(() => {
        if (search == "") {
            setFilteredData([]);
        }
    }, [search]);

    if (useScreenType() == "desktop") {
        return (
            <>
                <div className="desktop-dash-maincontainer">
                    <div className="desktop-dash-comp-divider">
                        <div className="desktop-dash-comp-infodisplay">
                            <p className="desktop-dash-comp-infodisplay-title">
                                Currently Scouting: ...
                            </p>
                            <div className="desktop-dash-comp-searchcontainer">
                                <input
                                    className="desktop-dash-comp-search"
                                    value={search}
                                    onChange={handleInputChange}
                                />
                                {search && (
                                    <div className="desktop-dash-comp-searchdrop">
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item) => (
                                                <div key={item.key}>
                                                    <p>{item.name}</p>
                                                    <p className="notetext">
                                                        {item.key}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>
                                                <FaRegSadTear
                                                    style={{
                                                        paddingRight: "8px",
                                                    }}
                                                />
                                                No Results Found
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                className="desktop-dash-comp-infodisplay-button"
                                style={{ marginTop: "10px" }}
                            >
                                Switch to Custom
                            </button>
                            <p className="notetext" style={{ padding: "10px" }}>
                                If you want to scout a custom competition, type
                                "CUSTOM", you can also switch the current
                                competition to a custom one.
                            </p>
                            <div
                                className="desktop-dash-comp-infodisplay-bordercontainer"
                                style={{ fontSize: "1.5rem" }}
                            >
                                List of Teams:
                                <div className="desktop-dash-comp-infodisplay-table">
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                    <div>16423</div>
                                </div>
                            </div>
                        </div>
                        <div className="desktop-dash-comp-infodisplay"></div>
                        <div className="desktop-dash-comp-infodisplay"></div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="phone-dash-maincontainer">
                    <div className="phone-dash-comp-overflowhandler">
                        <div className="phone-dash-comp-divider">
                            <div className="phone-dash-comp-infodisplay"></div>
                            <div className="phone-dash-comp-infodisplay"></div>
                            <div className="phone-dash-comp-infodisplay"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardCompetition;
