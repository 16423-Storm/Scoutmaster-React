import { useTranslation } from "react-i18next";
import Flag from "../../../components/flag";
import { useScreenType } from "../../../../scripts/multipageutils";
import type { Team, Question } from "../../../../scripts/localstorage";
import {
    useSections,
    useQuestions,
    useTeams,
    updateTeamQuestion,
    getQuestion,
} from "../../../../scripts/localstorage";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { IoMdStar } from "react-icons/io";

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
                        &lt; Back
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
        return <></>;
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
    data?: string | number | boolean | string[] | number[] | boolean[];
}) {
    const { t } = useTranslation();
    if (question.type == "ln") {
        const [area, setArea] = useState(typeof data === "string" ? data : "");

        useEffect(() => {
            if (area === "") {
                if (data !== undefined) {
                    updateTeamQuestion(team, questionId, undefined);
                }
                return;
            }

            if (data !== area) {
                updateTeamQuestion(team, questionId, area);
            }
        }, [area]);

        const handleAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value;
            setArea(value);

            if (value === "") {
                updateTeamQuestion(team, questionId, undefined);
            } else {
                updateTeamQuestion(team, questionId, value);
            }
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
                <p style={area.length === 400 ? { color: "red" } : undefined}>
                    {area.length}/400
                </p>
            </div>
        );
    } else if (question.type == "sn") {
        const [input, setInput] = useState(
            typeof data === "string" ? data.slice(0, 100) : "",
        );
        useEffect(() => {
            if (input === "") {
                if (data !== undefined) {
                    updateTeamQuestion(team, questionId, undefined);
                }
                return;
            }

            if (data !== input) {
                updateTeamQuestion(team, questionId, input);
            }
        }, [input]);
        const handleAreaChange = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            setInput(value);
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
                <p style={input.length === 100 ? { color: "red" } : undefined}>
                    {input.length}/100
                </p>
            </div>
        );
    } else if (question.type == "cb") {
        const [check, setCheck] = useState(
            typeof data === "boolean" ? data : false,
        );
        useEffect(() => {
            if (data !== check) {
                updateTeamQuestion(team, questionId, check);
            }
        }, []);
        const handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
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
        return <></>;
    } else if (question.type == "n") {
        const [input, setInput] = useState(
            typeof data === "number" ? Number(data.toString().slice(0, 20)) : 0,
        );
        useEffect(() => {
            if (data !== input) {
                updateTeamQuestion(team, questionId, input);
            }
        }, [input]);
        const handleNumChange = (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            const num = Number(value.slice(0, 20));
            if (!Number.isNaN(num)) {
                setInput(num);
                updateTeamQuestion(team, questionId, num);
            }
        };

        return (
            <input
                className="desktop-dash-prescout-team-numinput"
                value={input}
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
            const selected = Object.keys(checked).filter((key) => checked[key]);
            if (selected.length === 0) {
                if (data !== undefined) {
                    updateTeamQuestion(team, questionId, undefined);
                }
            } else {
                updateTeamQuestion(team, questionId, selected);
            }
        }, [checked]);
        const handleCheckChange = (key: string) => {
            setChecked((prev) => ({
                ...prev,
                [key]: !prev[key],
            }));
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
            if (selected !== undefined) {
                updateTeamQuestion(team, questionId, selected);
            } else if (data !== undefined) {
                updateTeamQuestion(team, questionId, undefined);
            }
        }, [selected]);

        const handleSelectChange = (key: string) => {
            setSelected(key);
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
        const [value, setValue] = useState(typeof data === "number" ? data : 0);
        useEffect(() => {
            if (data !== value) {
                updateTeamQuestion(team, questionId, value);
            }
        }, [value]);
        const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
            const newValue = Number(event.target.value);
            setValue(newValue);
            updateTeamQuestion(team, questionId, newValue);
        };

        return (
            <div style={{ width: "80%" }}>
                <input
                    className="desktop-dash-prescout-team-range"
                    type="range"
                    value={value}
                    min={question.minmax[0]}
                    max={question.minmax[1]}
                    onChange={handleRangeChange}
                />
                <p>{value}</p>
            </div>
        );
    } else if (question.type == "st") {
        const [selected, setSelected] = useState(
            typeof data === "number" ? data : 0,
        );

        useEffect(() => {
            if (data !== selected) {
                updateTeamQuestion(team, questionId, selected);
            }
        }, [selected]);

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
                                color: star <= selected ? "#FFD700" : "#B0B0B0",
                            }}
                        />
                    );
                })}
            </div>
        );
    }
}
