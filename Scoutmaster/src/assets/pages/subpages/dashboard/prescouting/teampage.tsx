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
    data?: string | number | boolean | string[] | number[] | boolean[];
}) {
    const { t } = useTranslation();

    if (useScreenType() == "desktop") {
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
            return <></>;
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
            return <></>;
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
