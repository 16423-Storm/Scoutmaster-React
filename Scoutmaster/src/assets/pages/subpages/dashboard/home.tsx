import { useScreenType, useSignedIn } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardHome() {
    const { t } = useTranslation();
    const prescoutData = {
        labels: ["Scouted", "Partial", "Unscouted"],
        datasets: [
            {
                data: [12, 3, 3],
                backgroundColor: [
                    "rgba(99, 255, 107, 0.6)",
                    "rgba(255, 196, 0, 0.74)",
                    "rgba(235, 54, 54, 0.6)",
                ],
                borderColor: [
                    "rgba(99, 255, 107, 0.6)",
                    "rgba(255, 196, 0, 0.74)",
                    "rgba(235, 54, 54, 0.6)",
                ],
                borderWidth: 1,
                cutout: "50%",
            },
        ],
    };

    if (useScreenType() == "desktop") {
        return (
            <>
                <div className="desktop-dash-maincontainer">
                    <div className="desktop-dash-home-divider">
                        <div className="desktop-dash-home-infodisplay">
                            <div className="desktop-dash-home-infodisplay-chartcontainer">
                                <Doughnut data={prescoutData} />
                            </div>
                        </div>
                        <div className="desktop-dash-home-infodisplay"></div>
                        <div className="desktop-dash-home-infodisplay"></div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="phone-dash-maincontainer">
                    <div className="phone-dash-home-overflowhandler">
                        <div className="phone-dash-home-divider">
                            <div className="phone-dash-home-infodisplay">
                                <div className="phone-dash-home-infodisplay-chartcontainer">
                                    <Doughnut data={prescoutData} />
                                </div>
                            </div>
                            <div className="phone-dash-home-infodisplay"></div>
                            <div className="phone-dash-home-infodisplay"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default DashboardHome;
