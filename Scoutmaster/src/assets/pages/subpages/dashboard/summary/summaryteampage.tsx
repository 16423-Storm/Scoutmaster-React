import { useScreenType } from "../../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import { FaRegStar, FaMountain } from "react-icons/fa";
import { BsAlignMiddle } from "react-icons/bs";
import { IoMdStar } from "react-icons/io";

import {
    useMatches,
    useQuestions,
    useSections,
    useTeams,
    type Question,
} from "../../../../scripts/localstorage";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
);

export function SummaryTeamPage({
    onBack,
    teamNum,
    average,
    median,
    peak,
}: {
    onBack: () => void;
    teamNum: string;
    average: number;
    median: number;
    peak: number;
}) {
    const { t } = useTranslation();

    const sections = useSections((state) => state.sections);
    const questions = useQuestions((state) => state.questions);

    const teams = useTeams((state) => state.teams);
    const matches = useMatches((state) => state.matches);

    const matchScores = Object.values(matches)
        .map((match, index) => {
            const teamIndex = match.teams.indexOf(Number(teamNum));
            if (teamIndex === -1) {
                return null;
            }

            const scores = match.scores[teamIndex];

            const score0 = scores[0] * 3;
            const score1 = scores[1];
            const score2 = scores[2] * 2;
            const score3 = scores[3] * 3;
            const score4 = scores[4] * 3;
            const score5 = scores[5];
            const score6 = scores[6] * 2;
            const score7 = scores[7] * 5;

            const scoresMultiplied = [
                score0,
                score1,
                score2,
                score3,
                score4,
                score5,
                score6,
                score7,
            ];

            return {
                match: `Match ${index + 1}`,
                scores: scoresMultiplied,
            };
        })
        .filter(
            (
                match,
            ): match is {
                match: string;
                scores: number[];
            } => match !== null,
        );

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: true,
            },
        },

        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Points",
                },
            },

            x: {
                title: {
                    display: true,
                    text: "Match",
                },
            },
        },
    };

    const chartDataTotal = {
        labels: matchScores.map((match) => match.match),
        datasets: [
            {
                label: t("totalpoints"),
                data: matchScores.map((match) =>
                    match.scores.reduce((sum, score) => sum + score, 0),
                ),
                borderColor: "#3B82F6",
                backgroundColor: "#3B82F6",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("autonomouspoints"),
                data: matchScores.map((match) =>
                    match.scores
                        .slice(0, 4)
                        .reduce((sum, score) => sum + score, 0),
                ),
                borderColor: "#14B8A6",
                backgroundColor: "#14B8A6",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("teleoppoints"),
                data: matchScores.map((match) =>
                    match.scores
                        .slice(4, 8)
                        .reduce((sum, score) => sum + score, 0),
                ),
                borderColor: "#8B5CF6",
                backgroundColor: "#8B5CF6",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
        ],
    };

    const chartDataAuto = {
        labels: matchScores.map((match) => match.match),
        datasets: [
            {
                label: t("autonomouspoints"),
                data: matchScores.map((match) =>
                    match.scores
                        .slice(0, 4)
                        .reduce((sum, score) => sum + score, 0),
                ),
                borderColor: "#14B8A6",
                backgroundColor: "#14B8A6",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("classified"),
                data: matchScores.map((match) => match.scores[0]),
                borderColor: "#EC4899",
                backgroundColor: "#EC4899",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("overflow"),
                data: matchScores.map((match) => match.scores[1]),
                borderColor: "#F97316",
                backgroundColor: "#F97316",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("pattern"),
                data: matchScores.map((match) => match.scores[2]),
                borderColor: "#22C55E",
                backgroundColor: "#22C55E",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("leave"),
                data: matchScores.map((match) => match.scores[3]),
                borderColor: "#6366F1",
                backgroundColor: "#6366F1",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
        ],
    };

    const chartDataTeleOp = {
        labels: matchScores.map((match) => match.match),
        datasets: [
            {
                label: t("teleoppoints"),
                data: matchScores.map((match) =>
                    match.scores
                        .slice(4, 8)
                        .reduce((sum, score) => sum + score, 0),
                ),
                borderColor: "#8B5CF6",
                backgroundColor: "#8B5CF6",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("classified"),
                data: matchScores.map((match) => match.scores[4]),
                borderColor: "#EC4899",
                backgroundColor: "#EC4899",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("overflow"),
                data: matchScores.map((match) => match.scores[5]),
                borderColor: "#F97316",
                backgroundColor: "#F97316",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("pattern"),
                data: matchScores.map((match) => match.scores[6]),
                borderColor: "#22C55E",
                backgroundColor: "#22C55E",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
            {
                label: t("base"),
                data: matchScores.map((match) => match.scores[7]),
                borderColor: "#EAB308",
                backgroundColor: "#EAB308",
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0,
            },
        ],
    };

    if (useScreenType() == "desktop") {
        return (
            <>
                <div className="desktop-dash-prescout-team-maincontainer">
                    <button
                        className="desktop-dash-prescout-team-backbutton"
                        onClick={onBack}
                    >
                        &lt; {t("back")}
                    </button>
                    <p className="desktop-dash-prescout-team-title">
                        {teamNum} - {teams[teamNum].name}
                    </p>
                    <div className="desktop-dash-summary-topbar">
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <FaRegStar style={{ color: "#4F81A8" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>{average}</p>
                                <p>{t("averagepoints")}</p>
                            </div>
                        </div>
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <BsAlignMiddle style={{ color: "#4F9A91" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>{median}</p>
                                <p>{t("medianpoints")}</p>
                            </div>
                        </div>
                        <div className="desktop-dash-summary-topbar-item">
                            <div className="desktop-dash-summary-topbar-item-icon">
                                <FaMountain style={{ color: "#C28A4A" }} />
                            </div>
                            <div className="desktop-dash-summary-topbar-item-text">
                                <p>{peak}</p>
                                <p>{t("peak")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="desktop-dash-summary-teampage-rowdiv">
                        <div
                            style={{
                                width: "33%",
                                height: "400px",
                                marginTop: "40px",
                            }}
                        >
                            <Line
                                data={chartDataTotal}
                                options={chartOptions}
                            />
                        </div>
                        <div
                            style={{
                                width: "33%",
                                height: "400px",
                                marginTop: "40px",
                            }}
                        >
                            <Line data={chartDataAuto} options={chartOptions} />
                        </div>
                        <div
                            style={{
                                width: "33%",
                                height: "400px",
                                marginTop: "40px",
                            }}
                        >
                            <Line
                                data={chartDataTeleOp}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                    <div className="desktop-dash-prescout-team-questioncontainer">
                        {Object.entries(sections)
                            .sort(([, a], [, b]) => a.index - b.index)
                            .map(([sectionId, section]) => (
                                <div
                                    key={sectionId}
                                    className="desktop-dash-prescout-team-sectioncontainer"
                                >
                                    {section.headersize === 1 && (
                                        <>
                                            <h1>{section.title}</h1>
                                            <hr />
                                        </>
                                    )}

                                    {section.headersize === 2 && (
                                        <>
                                            <h2>{section.title}</h2>
                                            <hr />
                                        </>
                                    )}

                                    {section.headersize === 3 && (
                                        <>
                                            <h3>{section.title}</h3>
                                            <hr />
                                        </>
                                    )}

                                    {section.questions.map((questionId) => {
                                        const question = questions[questionId];

                                        if (!question) return null;

                                        const data = Object.hasOwn(
                                            teams[teamNum].data,
                                            questionId,
                                        )
                                            ? teams[teamNum].data[questionId]
                                            : undefined;

                                        return (
                                            <div
                                                key={questionId}
                                                className="desktop-dash-prescout-team-question"
                                            >
                                                <p>{question.title}:</p>

                                                <RenderQuestionAnswer
                                                    question={question}
                                                    questionId={questionId}
                                                    data={data}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div
                    className="phone-dash-prescout-team-maincontainer"
                    style={{ overflowY: "scroll" }}
                >
                    <button
                        className="phone-dash-prescout-team-backbutton"
                        onClick={onBack}
                    >
                        &lt; {t("back")}
                    </button>
                    <p className="phone-dash-prescout-team-title">
                        {teamNum} - {teams[teamNum].name}
                    </p>
                    <div className="phone-dash-summary-topbar">
                        <div className="phone-dash-summary-topbar-item">
                            <div className="phone-dash-summary-topbar-item-icon">
                                <FaRegStar style={{ color: "#4F81A8" }} />
                            </div>
                            <div className="phone-dash-summary-topbar-item-text">
                                <p>{average}</p>
                                <p>{t("averagepoints")}</p>
                            </div>
                        </div>
                        <div className="phone-dash-summary-topbar-item">
                            <div className="phone-dash-summary-topbar-item-icon">
                                <BsAlignMiddle style={{ color: "#4F9A91" }} />
                            </div>
                            <div className="phone-dash-summary-topbar-item-text">
                                <p>{median}</p>
                                <p>{t("medianpoints")}</p>
                            </div>
                        </div>
                        <div className="phone-dash-summary-topbar-item">
                            <div className="phone-dash-summary-topbar-item-icon">
                                <FaMountain style={{ color: "#C28A4A" }} />
                            </div>
                            <div className="phone-dash-summary-topbar-item-text">
                                <p>{peak}</p>
                                <p>{t("peak")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="phone-dash-summary-teampage-rowdiv">
                        <div
                            style={{
                                width: "95%",
                                height: "400px",
                                marginTop: "40px",
                            }}
                        >
                            <Line
                                data={chartDataTotal}
                                options={chartOptions}
                            />
                        </div>
                        <div
                            style={{
                                width: "95%",
                                height: "400px",
                                marginTop: "40px",
                            }}
                        >
                            <Line data={chartDataAuto} options={chartOptions} />
                        </div>
                        <div
                            style={{
                                width: "95%",
                                height: "400px",
                                marginTop: "40px",
                            }}
                        >
                            <Line
                                data={chartDataTeleOp}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                    <div className="phone-dash-prescout-team-questioncontainer">
                        {Object.entries(sections)
                            .sort(([, a], [, b]) => a.index - b.index)
                            .map(([sectionId, section]) => (
                                <div
                                    key={sectionId}
                                    className="phone-dash-prescout-team-sectioncontainer"
                                >
                                    {section.headersize === 1 && (
                                        <>
                                            <h1>{section.title}</h1>
                                            <hr />
                                        </>
                                    )}

                                    {section.headersize === 2 && (
                                        <>
                                            <h2>{section.title}</h2>
                                            <hr />
                                        </>
                                    )}

                                    {section.headersize === 3 && (
                                        <>
                                            <h3>{section.title}</h3>
                                            <hr />
                                        </>
                                    )}

                                    {section.questions.map((questionId) => {
                                        const question = questions[questionId];

                                        if (!question) return null;

                                        const data = Object.hasOwn(
                                            teams[teamNum].data,
                                            questionId,
                                        )
                                            ? teams[teamNum].data[questionId]
                                            : undefined;

                                        return (
                                            <div
                                                key={questionId}
                                                className="phone-dash-prescout-team-question"
                                            >
                                                <p>{question.title}:</p>

                                                <RenderQuestionAnswer
                                                    question={question}
                                                    questionId={questionId}
                                                    data={data}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                    </div>
                </div>
            </>
        );
    }
}

function RenderQuestionAnswer({
    question,
    questionId,
    data,
}: {
    question: Question;
    questionId: string;
    data?: string | number | boolean | string[] | number[] | boolean[];
}) {
    const { t } = useTranslation();

    const screenType = useScreenType();

    const prefix =
        screenType === "desktop"
            ? "desktop-dash-prescout-team"
            : "phone-dash-prescout-team";

    if (question.type === "a") {
        return null;
    }

    if (data === undefined) {
        return <p className="notetext">{t("noanswer")}</p>;
    }

    switch (question.type) {
        case "ln":
        case "sn": {
            const value = typeof data === "string" ? data : String(data);

            return (
                <div className={`${prefix}-lncontainer`}>
                    <p style={{ whiteSpace: "pre-wrap" }}>{value}</p>
                </div>
            );
        }

        case "cb":
            return (
                <input
                    type="checkbox"
                    checked={data === true}
                    disabled
                    readOnly
                    className={`${prefix}-checkbox`}
                />
            );

        case "n":
            return (
                <input
                    className={`${prefix}-numinput`}
                    value={typeof data === "number" ? data : ""}
                    readOnly
                />
            );

        case "mc": {
            const selected =
                Array.isArray(data) &&
                data.every((item) => typeof item === "string")
                    ? data
                    : [];

            return (
                <div className={`${prefix}-mccontainer`}>
                    {Object.entries(question.opt).length === 0 ? (
                        <p className="notetext">{t("nooptions")}</p>
                    ) : (
                        Object.entries(question.opt).map(([key, value]) => (
                            <div key={key}>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(key)}
                                    disabled
                                    readOnly
                                />
                                <label>{value}</label>
                            </div>
                        ))
                    )}
                </div>
            );
        }

        case "sc": {
            const selected =
                typeof data === "string" && Object.hasOwn(question.opt, data)
                    ? data
                    : undefined;

            return (
                <div className={`${prefix}-mccontainer`}>
                    {Object.entries(question.opt).length === 0 ? (
                        <p className="notetext">{t("nooptions")}</p>
                    ) : (
                        Object.entries(question.opt).map(([key, value]) => (
                            <div key={key}>
                                <input
                                    type="radio"
                                    name={`answer-${questionId}`}
                                    checked={selected === key}
                                    disabled
                                    readOnly
                                />
                                <label>{value}</label>
                            </div>
                        ))
                    )}
                </div>
            );
        }

        case "r": {
            const value = typeof data === "number" ? data : 0;

            return (
                <div style={{ width: "80%" }}>
                    <input
                        className={`${prefix}-range`}
                        type="range"
                        value={value}
                        min={question.minmax[0]}
                        max={question.minmax[1]}
                        disabled
                        readOnly
                    />
                    <p>{value}</p>
                </div>
            );
        }

        case "st": {
            const selected = typeof data === "number" ? data : 0;

            return (
                <div className={`${prefix}-starcontainer`}>
                    {Array.from({ length: question.stars }, (_, index) => {
                        const star = index + 1;

                        return (
                            <IoMdStar
                                key={star}
                                size={30}
                                style={{
                                    color:
                                        star <= selected
                                            ? "#FFD700"
                                            : "#B0B0B0",
                                }}
                            />
                        );
                    })}
                </div>
            );
        }

        default:
            return null;
    }
}
