import { useTranslation } from "react-i18next";
import { useScreenType } from "../../../../scripts/multipageutils";
import type { Question } from "../../../../scripts/localstorage";
import {
    useSections,
    useQuestions,
    useTeams,
    updateTeamQuestion,
} from "../../../../scripts/localstorage";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { IoMdStar } from "react-icons/io";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Blocker499 from "../../../components/blocker";

import fieldImage from "../../../../images/biobuzzdark.webp";

export function TeamPage({
    onBack,
    teamNum,
}: {
    onBack: () => void;
    teamNum: string;
}) {
    const { t } = useTranslation();

    const sections = useSections((state) => state.sections);
    const questions = useQuestions((state) => state.questions);
    const teams = useTeams((state) => state.teams);

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

                                        return (
                                            <div
                                                key={questionId}
                                                className="desktop-dash-prescout-team-question"
                                            >
                                                <p>{question.title}:</p>
                                                <RenderQuestion
                                                    team={teamNum}
                                                    question={question}
                                                    questionId={questionId}
                                                    data={
                                                        Object.hasOwn(
                                                            teams[teamNum].data,
                                                            questionId,
                                                        )
                                                            ? teams[teamNum]
                                                                  .data[
                                                                  questionId
                                                              ]
                                                            : undefined
                                                    }
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
                        &lt; Back
                    </button>
                    <p className="phone-dash-prescout-team-title">
                        {teamNum} - {teams[teamNum].name}
                    </p>
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

                                        return (
                                            <div
                                                key={questionId}
                                                className="phone-dash-prescout-team-question"
                                            >
                                                <p>{question.title}:</p>
                                                <RenderQuestion
                                                    team={teamNum}
                                                    question={question}
                                                    questionId={questionId}
                                                    data={
                                                        Object.hasOwn(
                                                            teams[teamNum].data,
                                                            questionId,
                                                        )
                                                            ? teams[teamNum]
                                                                  .data[
                                                                  questionId
                                                              ]
                                                            : undefined
                                                    }
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

function RenderQuestion({
    team,
    question,
    questionId,
    data,
}: {
    team: string;
    question: Question;
    questionId: string;
    data?:
        | string
        | number
        | boolean
        | string[]
        | number[]
        | boolean[]
        | [number, number, string?][][];
}) {
    const { t } = useTranslation();

    const [heightSetting, setHeightSetting] = useState(25);
    const [pathStage, setPathStage] = useState(0);
    const [pathsOpen, setPathsOpen] = useState(false);

    const screenType = useScreenType();
    const isDesktop = screenType === "desktop";

    const pathCanvasSize = isDesktop ? "min(300px, 70vw)" : "min(280px, 78vw)";

    const pathPopupHeight = isDesktop ? "60vh" : "85vh";

    const pathButtonWidth = isDesktop ? "75%" : "85%";

    const pathButtonFontSize = isDesktop ? "1.2rem" : "1rem";

    type Point = [number, number, string?];
    type Paths = Point[][];

    if (isDesktop) {
        if (question.type == "ln") {
            const [area, setArea] = useState(
                typeof data === "string" ? data : "",
            );

            useEffect(() => {
                setArea(typeof data === "string" ? data : "");
            }, [data]);

            const handleAreaChange = (
                event: ChangeEvent<HTMLTextAreaElement>,
            ) => {
                setArea(event.target.value);
            };

            const handleAreaBlur = () => {
                if (area !== "") {
                    updateTeamQuestion(team, questionId, area);
                } else {
                    updateTeamQuestion(team, questionId, undefined);
                }
            };

            return (
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
                            area.length === 400 ? { color: "red" } : undefined
                        }
                    >
                        {area.length}/400
                    </p>
                </div>
            );
        } else if (question.type == "sn") {
            const [input, setInput] = useState(
                typeof data === "string" ? data.slice(0, 100) : "",
            );

            useEffect(() => {
                setInput(typeof data === "string" ? data.slice(0, 100) : "");
            }, [data]);

            const handleAreaChange = (event: ChangeEvent<HTMLInputElement>) => {
                setInput(event.target.value);
            };

            const handleAreaBlur = () => {
                if (input !== "") {
                    updateTeamQuestion(team, questionId, input);
                } else {
                    updateTeamQuestion(team, questionId, undefined);
                }
            };

            return (
                <div className="desktop-dash-prescout-team-lncontainer">
                    <input
                        maxLength={100}
                        value={input}
                        onChange={handleAreaChange}
                        className={
                            input.length === 100
                                ? "desktop-popupinput-maxedinput"
                                : undefined
                        }
                        onBlur={handleAreaBlur}
                    />
                    <p
                        style={
                            input.length === 100 ? { color: "red" } : undefined
                        }
                    >
                        {input.length}/100
                    </p>
                </div>
            );
        } else if (question.type == "cb") {
            const [check, setCheck] = useState(
                typeof data === "boolean" ? data : false,
            );

            useEffect(() => {
                setCheck(typeof data === "boolean" ? data : false);
            }, [data]);

            useEffect(() => {
                if (data === undefined) {
                    updateTeamQuestion(team, questionId, false);
                }
            }, []);

            const handleCheckChange = (
                event: ChangeEvent<HTMLInputElement>,
            ) => {
                const { checked } = event.target;
                setCheck(checked);
                updateTeamQuestion(team, questionId, checked);
            };

            return (
                <input
                    type="checkbox"
                    checked={check}
                    onChange={handleCheckChange}
                    className="desktop-dash-prescout-team-checkbox"
                />
            );
        } else if (question.type == "a") {
            const [paths, setPaths] = useState<Paths>([]);
            const [selectedColor, setSelectedColor] = useState("r");

            const colors = [
                { key: "r", color: "red" },
                { key: "g", color: "green" },
                { key: "b", color: "blue" },
                { key: "y", color: "yellow" },
                { key: "p", color: "purple" },
                { key: "o", color: "orange" },
            ];

            const getColor = (color?: string) => {
                switch (color) {
                    case "r":
                        return "red";
                    case "g":
                        return "green";
                    case "b":
                        return "blue";
                    case "y":
                        return "yellow";
                    case "p":
                        return "purple";
                    case "o":
                        return "orange";
                    default:
                        return "black";
                }
            };

            const openPaths = () => {
                let initialPaths: Paths;

                if (Array.isArray(data)) {
                    initialPaths = (data as Paths).map((path) =>
                        path.map((point) => [...point] as Point),
                    );
                } else {
                    initialPaths = [[]];
                }

                if (initialPaths.length === 0) {
                    initialPaths = [[]];
                }

                setPaths(initialPaths);
                setPathStage(Math.min(initialPaths.length - 1, 2));
                setSelectedColor("r");
                setPathsOpen(true);
            };

            const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
                const rect = event.currentTarget.getBoundingClientRect();

                const x = Math.round(
                    ((event.clientX - rect.left) / rect.width) * 600,
                );

                const y = Math.round(
                    ((event.clientY - rect.top) / rect.height) * 600,
                );

                const newPaths: Paths = paths.map((path) =>
                    path.map((point) => [...point] as Point),
                );

                if (!newPaths[pathStage]) {
                    newPaths[pathStage] = [];
                }

                const currentPath = newPaths[pathStage];

                const newPoint: Point =
                    currentPath.length === 0 ? [x, y] : [x, y, selectedColor];

                newPaths[pathStage] = [...currentPath, newPoint];

                setPaths(newPaths);
            };

            const handleAddPath = () => {
                if (paths.length >= 3) return;

                const newPaths: Paths = [...paths, []];

                setPaths(newPaths);

                setPathStage(newPaths.length - 1);
            };

            const handleDeletePath = () => {
                if (paths.length <= 1) return;

                const newPaths = paths.filter(
                    (_, index) => index !== pathStage,
                );

                setPaths(newPaths);

                setPathStage(Math.min(pathStage, newPaths.length - 1));
            };

            const handleExit = () => {
                updateTeamQuestion(team, questionId, paths);

                setPathsOpen(false);
            };

            return (
                <>
                    {pathsOpen && (
                        <>
                            <Blocker499 />

                            <div
                                className="desktop-warningpopup"
                                style={{
                                    height: pathPopupHeight,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: isDesktop ? "20px" : "12px",
                                        width: "90%",
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            if (pathStage > 0) {
                                                setPathStage(
                                                    (prev) => prev - 1,
                                                );
                                            }
                                        }}
                                        disabled={pathStage === 0}
                                        style={{
                                            fontSize: isDesktop
                                                ? "2rem"
                                                : "1.5rem",
                                            padding: isDesktop
                                                ? "5px 15px"
                                                : "4px 12px",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor:
                                                pathStage === 0
                                                    ? "default"
                                                    : "pointer",
                                        }}
                                    >
                                        ←
                                    </button>

                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: isDesktop
                                                ? "1.2rem"
                                                : "1rem",
                                        }}
                                    >
                                        Path {pathStage + 1} / {paths.length}
                                    </p>

                                    <button
                                        onClick={() => {
                                            if (pathStage < paths.length - 1) {
                                                setPathStage(
                                                    (prev) => prev + 1,
                                                );
                                            }
                                        }}
                                        disabled={
                                            pathStage === paths.length - 1
                                        }
                                        style={{
                                            fontSize: isDesktop
                                                ? "2rem"
                                                : "1.5rem",
                                            padding: isDesktop
                                                ? "5px 15px"
                                                : "4px 12px",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor:
                                                pathStage === paths.length - 1
                                                    ? "default"
                                                    : "pointer",
                                        }}
                                    >
                                        →
                                    </button>
                                </div>

                                <div
                                    style={{
                                        width: pathCanvasSize,
                                        height: pathCanvasSize,
                                        aspectRatio: "1 / 1",
                                        position: "relative",
                                        margin: "0 auto",
                                        flexShrink: 0,
                                    }}
                                >
                                    <img
                                        src={fieldImage}
                                        alt=""
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "fill",
                                            pointerEvents: "none",
                                            userSelect: "none",
                                        }}
                                    />

                                    <svg
                                        viewBox="0 0 600 600"
                                        width="100%"
                                        height="100%"
                                        onClick={handleSvgClick}
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            display: "block",
                                            cursor: "crosshair",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        {paths[pathStage]?.length > 0 && (
                                            <>
                                                {paths[pathStage]
                                                    .slice(1)
                                                    .map(
                                                        (
                                                            [x, y, color],
                                                            pointIndex,
                                                        ) => {
                                                            const [
                                                                prevX,
                                                                prevY,
                                                            ] =
                                                                paths[
                                                                    pathStage
                                                                ][pointIndex];

                                                            return (
                                                                <line
                                                                    key={`line-${pointIndex}`}
                                                                    x1={prevX}
                                                                    y1={prevY}
                                                                    x2={x}
                                                                    y2={y}
                                                                    stroke={getColor(
                                                                        color,
                                                                    )}
                                                                    strokeWidth={
                                                                        isDesktop
                                                                            ? 4
                                                                            : 3
                                                                    }
                                                                    strokeLinecap="round"
                                                                />
                                                            );
                                                        },
                                                    )}

                                                {paths[pathStage].map(
                                                    ([x, y], pointIndex) => (
                                                        <circle
                                                            key={`point-${pointIndex}`}
                                                            cx={x}
                                                            cy={y}
                                                            r={
                                                                isDesktop
                                                                    ? 6
                                                                    : 5
                                                            }
                                                            fill="white"
                                                            stroke="black"
                                                            strokeWidth={
                                                                isDesktop
                                                                    ? 2
                                                                    : 1.5
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </>
                                        )}
                                    </svg>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: isDesktop ? "8px" : "5px",
                                        margin: isDesktop ? "8px 0" : "5px 0",
                                        flexWrap: "wrap",
                                        width: "90%",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: isDesktop
                                                ? undefined
                                                : "0.9rem",
                                        }}
                                    >
                                        Color:
                                    </span>

                                    {colors.map(({ key, color }) => (
                                        <button
                                            key={key}
                                            onClick={() =>
                                                setSelectedColor(key)
                                            }
                                            style={{
                                                width: isDesktop
                                                    ? "30px"
                                                    : "25px",
                                                height: isDesktop
                                                    ? "30px"
                                                    : "25px",
                                                padding: 0,
                                                borderRadius: "50%",
                                                border:
                                                    selectedColor === key
                                                        ? "3px solid black"
                                                        : "2px solid #ccc",
                                                backgroundColor: color,
                                                cursor: "pointer",
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    className="desktop-warningpopup-continue"
                                    style={{
                                        padding: isDesktop
                                            ? "10px 0px"
                                            : "8px 0px",
                                        width: pathButtonWidth,
                                        fontSize: pathButtonFontSize,
                                        borderRadius: "10px",
                                        border: "none",
                                        boxShadow:
                                            "0 6px 18px rgba(0, 0, 0, 0.25)",
                                    }}
                                    onClick={handleAddPath}
                                    disabled={paths.length >= 3}
                                >
                                    Add New Path
                                </button>

                                {paths.length > 1 && (
                                    <button
                                        className="desktop-warningpopup-cancel"
                                        style={{
                                            padding: isDesktop
                                                ? "10px 0px"
                                                : "8px 0px",
                                            width: pathButtonWidth,
                                            fontSize: pathButtonFontSize,
                                            borderRadius: "10px",
                                            border: "none",
                                            boxShadow:
                                                "0 6px 18px rgba(0, 0, 0, 0.25)",
                                        }}
                                        onClick={handleDeletePath}
                                    >
                                        Delete Path
                                    </button>
                                )}

                                <button
                                    className="desktop-warningpopup-cancel"
                                    style={{
                                        padding: isDesktop
                                            ? "10px 0px"
                                            : "8px 0px",
                                        width: pathButtonWidth,
                                        fontSize: pathButtonFontSize,
                                        borderRadius: "10px",
                                        border: "none",
                                        boxShadow:
                                            "0 6px 18px rgba(0, 0, 0, 0.25)",
                                    }}
                                    onClick={handleExit}
                                >
                                    Exit
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        className="desktop-dash-comp-infodisplay-button"
                        onClick={openPaths}
                    >
                        Auto Paths
                    </button>
                </>
            );
        } else if (question.type == "n") {
            const [input, setInput] = useState(
                typeof data === "number"
                    ? Number(data.toString().slice(0, 20))
                    : 0,
            );

            useEffect(() => {
                setInput(
                    typeof data === "number"
                        ? Number(data.toString().slice(0, 20))
                        : 0,
                );
            }, [data]);

            const handleNumChange = (event: ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                const num = Number(value.slice(0, 20));

                if (!Number.isNaN(num) && num >= -999999 && num <= 999999) {
                    setInput(num);
                    updateTeamQuestion(team, questionId, num);
                }
            };

            return (
                <input
                    className="desktop-dash-prescout-team-numinput"
                    value={input}
                    min={-999999}
                    max={999999}
                    onChange={handleNumChange}
                />
            );
        } else if (question.type == "mc") {
            const [checked, setChecked] = useState<{ [key: string]: boolean }>(
                Object.fromEntries(
                    Object.keys(question.opt).map((key) => [
                        key,
                        Array.isArray(data) &&
                            data.every((item) => typeof item === "string") &&
                            data.includes(key),
                    ]),
                ),
            );

            useEffect(() => {
                setChecked(
                    Object.fromEntries(
                        Object.keys(question.opt).map((key) => [
                            key,
                            Array.isArray(data) &&
                                data.every(
                                    (item) => typeof item === "string",
                                ) &&
                                data.includes(key),
                        ]),
                    ),
                );
            }, [data, question.opt]);

            const handleCheckChange = (key: string) => {
                setChecked((prev) => {
                    const next = {
                        ...prev,
                        [key]: !prev[key],
                    };

                    const selected = Object.keys(next).filter(
                        (optionKey) => next[optionKey],
                    );

                    updateTeamQuestion(team, questionId, selected);

                    return next;
                });
            };

            return (
                <div className="desktop-dash-prescout-team-mccontainer">
                    {Object.entries(question.opt).length === 0 ? (
                        <p className="notetext">{t("nooptions")}</p>
                    ) : (
                        Object.entries(question.opt).map(([key, value]) => (
                            <div key={key}>
                                <input
                                    type="checkbox"
                                    checked={checked[key]}
                                    onChange={() => handleCheckChange(key)}
                                />
                                <label>{value}</label>
                            </div>
                        ))
                    )}
                </div>
            );
        } else if (question.type == "sc") {
            const [selected, setSelected] = useState<string | undefined>(
                typeof data === "string" && Object.hasOwn(question.opt, data)
                    ? data
                    : undefined,
            );

            useEffect(() => {
                setSelected(
                    typeof data === "string" &&
                        Object.hasOwn(question.opt, data)
                        ? data
                        : undefined,
                );
            }, [data, question.opt]);

            const handleSelectChange = (key: string) => {
                setSelected(key);
                updateTeamQuestion(team, questionId, key);
            };

            return (
                <div className="desktop-dash-prescout-team-mccontainer">
                    {Object.entries(question.opt).length === 0 ? (
                        <p className="notetext">{t("nooptions")}</p>
                    ) : (
                        Object.entries(question.opt).map(([key, value]) => (
                            <div key={key}>
                                <input
                                    type="radio"
                                    name={questionId}
                                    checked={selected === key}
                                    onChange={() => handleSelectChange(key)}
                                />
                                <label>{value}</label>
                            </div>
                        ))
                    )}
                </div>
            );
        } else if (question.type == "r") {
            const [value, setValue] = useState(
                typeof data === "number" ? data : question.minmax[0],
            );

            useEffect(() => {
                setValue(typeof data === "number" ? data : question.minmax[0]);
            }, [data, question.minmax]);

            useEffect(() => {
                if (data === undefined) {
                    updateTeamQuestion(team, questionId, question.minmax[0]);
                }
            }, []);

            return (
                <div style={{ width: "80%" }}>
                    <Slider
                        className="desktop-dash-prescout-team-range"
                        min={question.minmax[0]}
                        max={question.minmax[1]}
                        step={1}
                        value={value}
                        onChange={(newValue) => {
                            if (typeof newValue === "number") {
                                setValue(newValue);
                            }
                        }}
                        onChangeComplete={(newValue) => {
                            if (typeof newValue === "number") {
                                updateTeamQuestion(team, questionId, newValue);
                            }
                        }}
                    />
                    <p>{value}</p>
                </div>
            );
        } else if (question.type == "st") {
            const [selected, setSelected] = useState(
                typeof data === "number" ? data : 0,
            );

            useEffect(() => {
                setSelected(typeof data === "number" ? data : 0);
            }, [data]);

            useEffect(() => {
                if (data === undefined) {
                    updateTeamQuestion(team, questionId, 0);
                }
            }, []);

            return (
                <div className="desktop-dash-prescout-team-starcontainer">
                    {Array.from({ length: question.stars }, (_, index) => {
                        const star = index + 1;

                        return (
                            <IoMdStar
                                key={star}
                                size={30}
                                onClick={() => {
                                    setSelected(star);
                                    updateTeamQuestion(team, questionId, star);
                                }}
                                style={{
                                    cursor: "pointer",
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
    } else {
        if (question.type == "ln") {
            const [area, setArea] = useState(
                typeof data === "string" ? data : "",
            );

            useEffect(() => {
                setArea(typeof data === "string" ? data : "");
            }, [data]);

            const handleAreaChange = (
                event: ChangeEvent<HTMLTextAreaElement>,
            ) => {
                setArea(event.target.value);
            };

            const handleAreaBlur = () => {
                if (area !== "") {
                    updateTeamQuestion(team, questionId, area);
                } else {
                    updateTeamQuestion(team, questionId, undefined);
                }
            };

            return (
                <div className="phone-dash-prescout-team-lncontainer">
                    <textarea
                        rows={3}
                        maxLength={400}
                        value={area}
                        onChange={handleAreaChange}
                        className={
                            area.length === 400
                                ? "phone-popupinput-maxedinput"
                                : undefined
                        }
                        onBlur={handleAreaBlur}
                    />
                    <p
                        style={
                            area.length === 400 ? { color: "red" } : undefined
                        }
                    >
                        {area.length}/400
                    </p>
                </div>
            );
        } else if (question.type == "sn") {
            const [input, setInput] = useState(
                typeof data === "string" ? data.slice(0, 100) : "",
            );

            useEffect(() => {
                setInput(typeof data === "string" ? data.slice(0, 100) : "");
            }, [data]);

            const handleAreaChange = (event: ChangeEvent<HTMLInputElement>) => {
                setInput(event.target.value);
            };

            const handleAreaBlur = () => {
                if (input !== "") {
                    updateTeamQuestion(team, questionId, input);
                } else {
                    updateTeamQuestion(team, questionId, undefined);
                }
            };

            return (
                <div className="phone-dash-prescout-team-lncontainer">
                    <input
                        maxLength={100}
                        value={input}
                        onChange={handleAreaChange}
                        className={
                            input.length === 100
                                ? "phone-popupinput-maxedinput"
                                : undefined
                        }
                        onBlur={handleAreaBlur}
                    />
                    <p
                        style={
                            input.length === 100 ? { color: "red" } : undefined
                        }
                    >
                        {input.length}/100
                    </p>
                </div>
            );
        } else if (question.type == "cb") {
            const [check, setCheck] = useState(
                typeof data === "boolean" ? data : false,
            );

            useEffect(() => {
                setCheck(typeof data === "boolean" ? data : false);
            }, [data]);

            useEffect(() => {
                if (data === undefined) {
                    updateTeamQuestion(team, questionId, false);
                }
            }, []);

            const handleCheckChange = (
                event: ChangeEvent<HTMLInputElement>,
            ) => {
                const { checked } = event.target;
                setCheck(checked);
                updateTeamQuestion(team, questionId, checked);
            };

            return (
                <input
                    type="checkbox"
                    checked={check}
                    onChange={handleCheckChange}
                    className="phone-dash-prescout-team-checkbox"
                />
            );
        } else if (question.type == "a") {
            type Point = [number, number, string?];
            type Paths = Point[][];

            const [paths, setPaths] = useState<Paths>([]);
            const [selectedColor, setSelectedColor] = useState("r");

            const colors = [
                { key: "r", color: "red" },
                { key: "g", color: "green" },
                { key: "b", color: "blue" },
                { key: "y", color: "yellow" },
                { key: "p", color: "purple" },
                { key: "o", color: "orange" },
            ];

            const getColor = (color?: string) => {
                switch (color) {
                    case "r":
                        return "red";
                    case "g":
                        return "green";
                    case "b":
                        return "blue";
                    case "y":
                        return "yellow";
                    case "p":
                        return "purple";
                    case "o":
                        return "orange";
                    default:
                        return "black";
                }
            };

            const openPaths = () => {
                let initialPaths: Paths;

                if (Array.isArray(data)) {
                    initialPaths = (data as Paths).map((path) => [...path]);
                } else {
                    initialPaths = [[]];
                }

                if (initialPaths.length === 0) {
                    initialPaths = [[]];
                }

                initialPaths = initialPaths.slice(0, 3);

                setPaths(initialPaths);
                setPathStage(Math.min(initialPaths.length - 1, 2));
                setPathsOpen(true);
            };

            const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
                const rect = event.currentTarget.getBoundingClientRect();

                const x = Math.round(
                    ((event.clientX - rect.left) / rect.width) * 600,
                );

                const y = Math.round(
                    ((event.clientY - rect.top) / rect.height) * 600,
                );

                const newPaths: Paths = paths.map((path) => [...path]);

                if (!newPaths[pathStage]) {
                    newPaths[pathStage] = [];
                }

                const currentPath = newPaths[pathStage];

                const newPoint: Point =
                    currentPath.length === 0 ? [x, y] : [x, y, selectedColor];

                newPaths[pathStage] = [...currentPath, newPoint];

                setPaths(newPaths);
            };

            const handleAddPath = () => {
                if (paths.length >= 3) return;

                const newPaths: Paths = [...paths, []];

                setPaths(newPaths);
                setPathStage(newPaths.length - 1);
            };

            const handleDeletePath = () => {
                if (paths.length <= 1) return;

                const newPaths = paths.filter(
                    (_, index) => index !== pathStage,
                );

                setPaths(newPaths);

                setPathStage(Math.min(pathStage, newPaths.length - 1));
            };

            const handleExit = () => {
                updateTeamQuestion(team, questionId, paths);

                setPathsOpen(false);
            };

            return (
                <>
                    {pathsOpen && (
                        <>
                            <Blocker499 />

                            <div
                                className="desktop-warningpopup"
                                style={{
                                    height: "90vh",
                                    width: "95vw",
                                    maxWidth: "500px",
                                    boxSizing: "border-box",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    overflowY: "auto",
                                    padding: "15px 10px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "15px",
                                        width: "100%",
                                        flexShrink: 0,
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            if (pathStage > 0) {
                                                setPathStage(
                                                    (prev) => prev - 1,
                                                );
                                            }
                                        }}
                                        disabled={pathStage === 0}
                                        style={{
                                            fontSize: "1.7rem",
                                            padding: "4px 12px",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor:
                                                pathStage === 0
                                                    ? "default"
                                                    : "pointer",
                                        }}
                                    >
                                        ←
                                    </button>

                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "1rem",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Path {pathStage + 1} / {paths.length}
                                    </p>

                                    <button
                                        onClick={() => {
                                            if (pathStage < paths.length - 1) {
                                                setPathStage(
                                                    (prev) => prev + 1,
                                                );
                                            }
                                        }}
                                        disabled={
                                            pathStage === paths.length - 1
                                        }
                                        style={{
                                            fontSize: "1.7rem",
                                            padding: "4px 12px",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor:
                                                pathStage === paths.length - 1
                                                    ? "default"
                                                    : "pointer",
                                        }}
                                    >
                                        →
                                    </button>
                                </div>

                                <div
                                    style={{
                                        width: "min(85vw, 380px)",
                                        height: "min(85vw, 380px)",
                                        aspectRatio: "1 / 1",
                                        position: "relative",
                                        margin: "12px auto",
                                        flexShrink: 0,
                                    }}
                                >
                                    <img
                                        src={fieldImage}
                                        alt=""
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "fill",
                                            pointerEvents: "none",
                                            userSelect: "none",
                                        }}
                                    />

                                    <svg
                                        viewBox="0 0 600 600"
                                        preserveAspectRatio="xMidYMid meet"
                                        width="100%"
                                        height="100%"
                                        onClick={handleSvgClick}
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            display: "block",
                                            width: "100%",
                                            height: "100%",
                                            cursor: "crosshair",
                                            touchAction: "none",
                                        }}
                                    >
                                        {paths[pathStage]?.length > 0 && (
                                            <>
                                                {paths[pathStage]
                                                    .slice(1)
                                                    .map(
                                                        (
                                                            [x, y, color],
                                                            pointIndex,
                                                        ) => {
                                                            const [
                                                                prevX,
                                                                prevY,
                                                            ] =
                                                                paths[
                                                                    pathStage
                                                                ][pointIndex];

                                                            return (
                                                                <line
                                                                    key={`line-${pointIndex}`}
                                                                    x1={prevX}
                                                                    y1={prevY}
                                                                    x2={x}
                                                                    y2={y}
                                                                    stroke={getColor(
                                                                        color,
                                                                    )}
                                                                    strokeWidth={
                                                                        4
                                                                    }
                                                                    strokeLinecap="round"
                                                                />
                                                            );
                                                        },
                                                    )}

                                                {paths[pathStage].map(
                                                    ([x, y], pointIndex) => (
                                                        <circle
                                                            key={`point-${pointIndex}`}
                                                            cx={x}
                                                            cy={y}
                                                            r={6}
                                                            fill="white"
                                                            stroke="black"
                                                            strokeWidth={2}
                                                        />
                                                    ),
                                                )}
                                            </>
                                        )}
                                    </svg>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexWrap: "wrap",
                                        gap: "7px",
                                        width: "100%",
                                        margin: "5px 0 10px",
                                        flexShrink: 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        Color:
                                    </span>

                                    {colors.map(({ key, color }) => (
                                        <button
                                            key={key}
                                            onClick={() =>
                                                setSelectedColor(key)
                                            }
                                            style={{
                                                width: "27px",
                                                height: "27px",
                                                padding: 0,
                                                borderRadius: "50%",
                                                border:
                                                    selectedColor === key
                                                        ? "3px solid black"
                                                        : "2px solid #ccc",
                                                backgroundColor: color,
                                                cursor: "pointer",
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    className="desktop-warningpopup-continue"
                                    style={{
                                        padding: "9px 0px",
                                        width: "85%",
                                        fontSize: "1rem",
                                        borderRadius: "10px",
                                        border: "none",
                                        boxShadow:
                                            "0 6px 18px rgba(0, 0, 0, 0.25)",
                                        marginBottom: "8px",
                                        flexShrink: 0,
                                    }}
                                    onClick={handleAddPath}
                                    disabled={paths.length >= 3}
                                >
                                    Add New Path
                                </button>

                                {paths.length > 1 && (
                                    <button
                                        className="desktop-warningpopup-cancel"
                                        style={{
                                            padding: "9px 0px",
                                            width: "85%",
                                            fontSize: "1rem",
                                            borderRadius: "10px",
                                            border: "none",
                                            boxShadow:
                                                "0 6px 18px rgba(0, 0, 0, 0.25)",
                                            marginBottom: "8px",
                                            flexShrink: 0,
                                        }}
                                        onClick={handleDeletePath}
                                    >
                                        Delete Path
                                    </button>
                                )}

                                <button
                                    className="desktop-warningpopup-cancel"
                                    style={{
                                        padding: "9px 0px",
                                        width: "85%",
                                        fontSize: "1rem",
                                        borderRadius: "10px",
                                        border: "none",
                                        boxShadow:
                                            "0 6px 18px rgba(0, 0, 0, 0.25)",
                                        flexShrink: 0,
                                    }}
                                    onClick={handleExit}
                                >
                                    Exit
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        className="phone-dash-comp-infodisplay-button"
                        onClick={openPaths}
                    >
                        Auto Paths
                    </button>
                </>
            );
        } else if (question.type == "n") {
            const [input, setInput] = useState(
                typeof data === "number"
                    ? Number(data.toString().slice(0, 20))
                    : 0,
            );

            useEffect(() => {
                setInput(
                    typeof data === "number"
                        ? Number(data.toString().slice(0, 20))
                        : 0,
                );
            }, [data]);

            const handleNumChange = (event: ChangeEvent<HTMLInputElement>) => {
                const { value } = event.target;
                const num = Number(value.slice(0, 20));

                if (!Number.isNaN(num) && num >= -999999 && num <= 999999) {
                    setInput(num);
                    updateTeamQuestion(team, questionId, num);
                }
            };

            return (
                <input
                    className="phone-dash-prescout-team-numinput"
                    value={input}
                    min={-999999}
                    max={999999}
                    onChange={handleNumChange}
                />
            );
        } else if (question.type == "mc") {
            const [checked, setChecked] = useState<{ [key: string]: boolean }>(
                Object.fromEntries(
                    Object.keys(question.opt).map((key) => [
                        key,
                        Array.isArray(data) &&
                            data.every((item) => typeof item === "string") &&
                            data.includes(key),
                    ]),
                ),
            );

            useEffect(() => {
                setChecked(
                    Object.fromEntries(
                        Object.keys(question.opt).map((key) => [
                            key,
                            Array.isArray(data) &&
                                data.every(
                                    (item) => typeof item === "string",
                                ) &&
                                data.includes(key),
                        ]),
                    ),
                );
            }, [data, question.opt]);

            const handleCheckChange = (key: string) => {
                setChecked((prev) => {
                    const next = {
                        ...prev,
                        [key]: !prev[key],
                    };

                    const selected = Object.keys(next).filter(
                        (optionKey) => next[optionKey],
                    );

                    if (selected.length === 0) {
                        updateTeamQuestion(team, questionId, undefined);
                    } else {
                        updateTeamQuestion(team, questionId, selected);
                    }

                    return next;
                });
            };

            return (
                <div className="phone-dash-prescout-team-mccontainer">
                    {Object.entries(question.opt).length === 0 ? (
                        <p className="notetext">{t("nooptions")}</p>
                    ) : (
                        Object.entries(question.opt).map(([key, value]) => (
                            <div key={key}>
                                <input
                                    type="checkbox"
                                    checked={checked[key]}
                                    onChange={() => handleCheckChange(key)}
                                />
                                <label>{value}</label>
                            </div>
                        ))
                    )}
                </div>
            );
        } else if (question.type == "sc") {
            const [selected, setSelected] = useState<string | undefined>(
                typeof data === "string" && Object.hasOwn(question.opt, data)
                    ? data
                    : undefined,
            );

            useEffect(() => {
                setSelected(
                    typeof data === "string" &&
                        Object.hasOwn(question.opt, data)
                        ? data
                        : undefined,
                );
            }, [data, question.opt]);

            const handleSelectChange = (key: string) => {
                setSelected(key);
                updateTeamQuestion(team, questionId, key);
            };

            return (
                <div className="phone-dash-prescout-team-mccontainer">
                    {Object.entries(question.opt).length === 0 ? (
                        <p className="notetext">{t("nooptions")}</p>
                    ) : (
                        Object.entries(question.opt).map(([key, value]) => (
                            <div key={key}>
                                <input
                                    type="radio"
                                    name={questionId}
                                    checked={selected === key}
                                    onChange={() => handleSelectChange(key)}
                                />
                                <label>{value}</label>
                            </div>
                        ))
                    )}
                </div>
            );
        } else if (question.type == "r") {
            const [value, setValue] = useState(
                typeof data === "number" ? data : question.minmax[0],
            );

            useEffect(() => {
                setValue(typeof data === "number" ? data : question.minmax[0]);
            }, [data, question.minmax]);

            useEffect(() => {
                if (data === undefined) {
                    updateTeamQuestion(team, questionId, question.minmax[0]);
                }
            }, []);

            return (
                <div style={{ width: "80%" }}>
                    <Slider
                        className="phone-dash-prescout-team-range"
                        min={question.minmax[0]}
                        max={question.minmax[1]}
                        step={1}
                        value={value}
                        onChange={(newValue) => {
                            if (typeof newValue === "number") {
                                setValue(newValue);
                            }
                        }}
                        onChangeComplete={(newValue) => {
                            if (typeof newValue === "number") {
                                updateTeamQuestion(team, questionId, newValue);
                            }
                        }}
                    />
                    <p>{value}</p>
                </div>
            );
        } else if (question.type == "st") {
            const [selected, setSelected] = useState(
                typeof data === "number" ? data : 0,
            );

            useEffect(() => {
                setSelected(typeof data === "number" ? data : 0);
            }, [data]);

            useEffect(() => {
                if (data === undefined) {
                    updateTeamQuestion(team, questionId, 0);
                }
            }, []);

            return (
                <div className="phone-dash-prescout-team-starcontainer">
                    {Array.from({ length: question.stars }, (_, index) => {
                        const star = index + 1;

                        return (
                            <IoMdStar
                                key={star}
                                size={30}
                                onClick={() => {
                                    setSelected(star);
                                    updateTeamQuestion(team, questionId, star);
                                }}
                                style={{
                                    cursor: "pointer",
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
    }
}
