import { FaTrash, FaImage } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { MdNotes } from "react-icons/md";
import { FaRegStickyNote } from "react-icons/fa";
import { MdCheckBox } from "react-icons/md";
import { GrRadialSelected } from "react-icons/gr";
import { PiPath } from "react-icons/pi";
import { Bs123 } from "react-icons/bs";
import { RxSlider } from "react-icons/rx";
import { GiStarsStack } from "react-icons/gi";
import { useTranslation } from "react-i18next";

import type {
    Question,
    QuestionSection,
} from "../../../../scripts/localstorage";
import { getNumOfQuestions } from "../../../../scripts/localstorage";

import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";

import { useState } from "react";
import type { ChangeEvent } from "react";

import { updateQuestion, useQuestions } from "../../../../scripts/localstorage";

import { Droppable, Draggable } from "@hello-pangea/dnd";

export function StatusColor({ numAnswered }: { numAnswered: number }) {
    const numOfQuestions = getNumOfQuestions();
    if (numOfQuestions == numAnswered) {
        return (
            <div className="desktop-dash-prescout-infodisplay-table-statusindicator-green"></div>
        );
    } else if (numAnswered > 0) {
        return (
            <div className="desktop-dash-prescout-infodisplay-table-statusindicator-yellow"></div>
        );
    } else {
        return (
            <div className="desktop-dash-prescout-infodisplay-table-statusindicator-red"></div>
        );
    }
}

export function DesktopSection({
    id,
    index,
    section,
    deletePrompt,
    sectionDeletePrompt,
    editPrompt,
    numOfSections,
    questionEdit,
}: {
    id: string;
    index: number;
    section: QuestionSection;
    deletePrompt: (target: string) => void;
    sectionDeletePrompt: (target: string) => void;
    editPrompt: (target: string) => void;
    questionEdit: (target: string) => void;
    numOfSections: number;
}) {
    const questions = useQuestions((state) => state.questions);

    const correctQuestions = section.questions.filter(
        (questionId) => questions[questionId],
    );

    return (
        <Draggable draggableId={`section-${id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    data-shadow={snapshot.isDragging || undefined}
                    style={{
                        ...provided.draggableProps.style,
                        width: snapshot.isDragging
                            ? (
                                  provided.draggableProps
                                      .style as React.CSSProperties
                              )?.width
                            : "100%",
                    }}
                >
                    <Droppable droppableId={`section-${id}`} type="QUESTION">
                        {(dropProvided) => (
                            <div
                                className="desktop-dash-prescout-admin-infodisplay-questionlist"
                                style={{
                                    overflowY: "unset",
                                    borderWidth: "2px",
                                    height: "unset",
                                }}
                                ref={dropProvided.innerRef}
                                {...dropProvided.droppableProps}
                            >
                                <div className="desktop-dash-prescout-admin-infodisplay-sectionheader">
                                    <div className="desktop-dash-prescout-admin-infodisplay-sectionheader-splitter">
                                        <FaPencilAlt
                                            className="desktop-dash-prescout-admin-infodisplay-managecontainer-editbutton"
                                            onClick={() => editPrompt(id)}
                                        />
                                        <FaTrash
                                            className={
                                                numOfSections > 1
                                                    ? "desktop-dash-prescout-admin-infodisplay-managecontainer-deletebutton"
                                                    : "desktop-dash-prescout-admin-infodisplay-managecontainer-deletebutton inactive"
                                            }
                                            onClick={() =>
                                                sectionDeletePrompt(id)
                                            }
                                        />
                                    </div>
                                    {section.headersize === 1 ? (
                                        <h1>{section.title}</h1>
                                    ) : section.headersize === 2 ? (
                                        <h2>{section.title}</h2>
                                    ) : section.headersize === 3 ? (
                                        <h3>{section.title}</h3>
                                    ) : null}
                                    <div
                                        {...provided.dragHandleProps}
                                        className={
                                            numOfSections > 1
                                                ? "desktop-dash-prescout-admin-infodisplay-question-handle"
                                                : "desktop-dash-prescout-admin-infodisplay-question-handle inactive"
                                        }
                                        style={{
                                            position: "absolute",
                                            right: "30px",
                                            height: "unset",
                                        }}
                                    >
                                        <MdDragIndicator />
                                    </div>
                                </div>

                                {correctQuestions.map((questionId, index) => (
                                    <DesktopSortableQuestion
                                        key={questionId}
                                        id={Number(questionId)}
                                        question={questions[questionId]}
                                        index={index}
                                        deletePrompt={deletePrompt}
                                        editPrompt={questionEdit}
                                    />
                                ))}

                                {dropProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
}

function DesktopSortableQuestion({
    question,
    id,
    index,
    deletePrompt,
    editPrompt,
}: {
    question: Question;
    id: number;
    index: number;
    deletePrompt: (target: string) => void;
    editPrompt: (target: string) => void;
}) {
    const { t } = useTranslation();

    const questionTypes = [
        { id: "ln", name: t("longnote") },
        { id: "sn", name: t("shortnote") },
        { id: "cb", name: t("checkbox") },
        { id: "mc", name: t("multichoice") },
        { id: "a", name: t("autonomouspath") },
        { id: "img", name: t("image") },
        { id: "n", name: t("number") },
        { id: "r", name: t("slider") },
        { id: "st", name: t("starsnocolon") },
        { id: "sc", name: t("singlechoice") },
    ] as const;

    const [selectedType, setSelectedType] = useState(
        questionTypes.find((type) => type.id === question?.type) ??
            questionTypes[0],
    );

    const [titleInput, setTitleInput] = useState(question?.title ?? "");
    const handleTitleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTitleInput(value);
    };

    const handleTitleInputBlur = () => {
        updateQuestion(id.toString(), { title: titleInput }, false);
    };

    return (
        <Draggable draggableId={id.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="desktop-dash-prescout-admin-infodisplay-question"
                    data-shadow={snapshot.isDragging || undefined}
                >
                    <div className="desktop-dashprescout-admin-infodisplay-managecontainer">
                        {isMoreFieldsNeeded(selectedType.id) && (
                            <FaPencilAlt
                                onClick={() => editPrompt(String(id))}
                                className="desktop-dash-prescout-admin-infodisplay-managecontainer-editbutton"
                            />
                        )}
                        <FaTrash
                            className="desktop-dash-prescout-admin-infodisplay-managecontainer-deletebutton"
                            onClick={() => deletePrompt(String(id))}
                        />
                    </div>

                    <div className="desktop-dash-prescout-admin-infodisplay-questionlayoutcontainer1">
                        <QuestionIcon type={selectedType.id} />

                        <div className="desktop-dash-prescout-admin-infodisplay-dropdowncontainer">
                            <Listbox
                                value={selectedType}
                                onChange={(type) => {
                                    setSelectedType(type);

                                    updateQuestion(
                                        id.toString(),
                                        {
                                            type: type.id,
                                            title: titleInput,
                                            ...(type.id === "mc" ||
                                            type.id === "sc"
                                                ? { opt: {} }
                                                : type.id === "r"
                                                  ? { minmax: [0, 100] }
                                                  : type.id === "st"
                                                    ? { stars: 1 }
                                                    : {}),
                                        },
                                        false,
                                    );
                                }}
                            >
                                <ListboxButton className="desktop-dash-prescout-admin-infodisplay-dropdownbutton">
                                    {selectedType.name} ▼
                                </ListboxButton>

                                <ListboxOptions
                                    anchor="bottom"
                                    className="desktop-dash-prescout-admin-infodisplay-dropdownbody"
                                >
                                    {questionTypes.map((question) => (
                                        <ListboxOption
                                            key={question.id}
                                            value={question}
                                            className="desktop-dash-prescout-admin-infodisplay-dropdownoption"
                                        >
                                            {question.name}
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </Listbox>

                            {isMoreFieldsNeeded(selectedType.id) && (
                                <p className="notetext">
                                    More fields required, press edit (pencil),
                                    to finish
                                </p>
                            )}
                        </div>

                        <div className="desktop-dash-prescout-admin-infodisplay-questioninputcontainer">
                            <input
                                value={titleInput}
                                onChange={handleTitleInputChange}
                                onBlur={handleTitleInputBlur}
                                maxLength={100}
                                className={
                                    titleInput.length === 100
                                        ? "desktop-popupinput-maxedinput"
                                        : undefined
                                }
                            />
                            <p
                                style={
                                    titleInput.length === 100
                                        ? { color: "red" }
                                        : undefined
                                }
                            >
                                {titleInput.length}/100
                            </p>
                        </div>
                    </div>

                    <button
                        {...(provided.dragHandleProps ?? {})}
                        className="desktop-dash-prescout-admin-infodisplay-question-handle"
                    >
                        <MdDragIndicator />
                    </button>
                </div>
            )}
        </Draggable>
    );
}

function QuestionIcon({ type }: { type: string }) {
    if (type == "ln") {
        return (
            <MdNotes className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    } else if (type == "sn") {
        return (
            <FaRegStickyNote className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    } else if (type == "cb") {
        return (
            <MdCheckBox className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    } else if (type == "mc" || type == "sc") {
        return (
            <GrRadialSelected className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    } else if (type == "a") {
        return (
            <PiPath className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    } else if (type == "img") {
        return (
            <FaImage className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    } else if (type == "n") {
        return (
            <Bs123 className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    } else if (type == "r") {
        return (
            <RxSlider className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    } else {
        return (
            <GiStarsStack className="desktop-dash-prescout-admin-infodisplay-questionicon" />
        );
    }
}

export function isMoreFieldsNeeded(type: string) {
    if (type == "r" || type == "st" || type == "mc" || type == "sc") {
        return true;
    }
    return false;
}
