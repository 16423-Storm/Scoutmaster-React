import { useTranslation } from "react-i18next";
import Flag from "../../../components/flag";
import { useScreenType } from "../../../../scripts/multipageutils";
import type { Team, Question } from "../../../../scripts/localstorage";
import {
    useSections,
    useQuestions,
    useTeams,
    updateTeamQuestion,
} from "../../../../scripts/localstorage";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

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
        if (data !== undefined) {
            return <></>;
        }
        return <></>;
    } else if (question.type == "n") {
        if (data !== undefined) {
            return <></>;
        }
        return <></>;
    } else if (question.type == "mc") {
        if (data !== undefined) {
            return <></>;
        }
        return <></>;
    } else if (question.type == "sc") {
        if (data !== undefined) {
            return <></>;
        }
        return <></>;
    } else if (question.type == "r") {
        if (data !== undefined) {
            return <></>;
        }
        return <></>;
    } else {
        if (data !== undefined) {
            return <></>;
        }
        return <></>;
    }
}
