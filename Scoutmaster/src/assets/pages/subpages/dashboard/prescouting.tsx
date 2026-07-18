import { useScreenType, useIsAdmin } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import {
    deleteQuestion,
    updateQuestion,
    useQuestions,
    useSections,
    updateSection,
    deleteSection,
    addQuestion,
} from "../../../scripts/localstorage";

import { useState, useRef } from "react";
import type { ChangeEvent } from "react";

import { useTeams } from "../../../scripts/localstorage";

import { Progress3 } from "../../components/progressbar";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { WarningModal, WarningModal3Button } from "../../components/popups";

import Flag from "../../components/flag";

import { getNumOfQuestions } from "../../../scripts/localstorage";

import { FaGhost, FaTrash, FaImage } from "react-icons/fa";
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

import type { Question, QuestionSection } from "../../../scripts/localstorage";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { AddSectionModal } from "../../components/popups/PrescoutModals";

function DashboardPrescout() {
    const { t } = useTranslation();

    const teams = useTeams((state) => state.teams);

    const percentageCounts = [0, 0, 0];

    Object.values(teams).forEach((team) => {
        const numOfQuestions = getNumOfQuestions();
        if (team.data.length === numOfQuestions) {
            percentageCounts[2]++;
        } else if (team.data.length > 0) {
            percentageCounts[1]++;
        } else {
            percentageCounts[0]++;
        }
    });

    const percentageTotal =
        percentageCounts[0] + percentageCounts[1] + percentageCounts[2];
    const percentages = [
        (percentageCounts[2] / percentageTotal) * 100,
        (percentageCounts[1] / percentageTotal) * 100,
        (percentageCounts[0] / percentageTotal) * 100,
    ];

    const sections = useSections((state) => state.sections);

    const [deleteWarningVisible, setDeleteWarningVisible] = useState(false);

    const [questionToDelete, setQuestionToDelete] = useState("");

    function promptDelete(target: string) {
        setDeleteWarningVisible(true);
        setQuestionToDelete(target);
    }

    function handleDelete() {
        setDeleteWarningVisible(false);
        deleteQuestion(questionToDelete, false);
    }

    const [deleteSectionWarningVisible, setDeleteSectionWarningVisible] =
        useState(false);

    const [sectionToDelete, setSectionToDelete] = useState("");

    function promptSectionDelete(target: string) {
        setDeleteSectionWarningVisible(true);
        setSectionToDelete(target);
    }

    function handleSectionDelete(deleteQuestions: boolean = false) {
        setDeleteSectionWarningVisible(false);
        deleteSection(sectionToDelete, deleteQuestions, false);
    }

    const [addSectionVisible, setAddSectionVisible] = useState(false);

    if (useScreenType() == "desktop") {
        return (
            <>
                {deleteWarningVisible && (
                    <WarningModal
                        title={t("warning!")}
                        message={t("deletequestionwarning")}
                        onCancel={() => setDeleteWarningVisible(false)}
                        onContinue={handleDelete}
                    />
                )}
                {deleteSectionWarningVisible && (
                    <WarningModal3Button
                        title={t("warning!")}
                        message={t("deletequestionwarning")}
                        onMiddleMessage="Continue & Delete Questions"
                        onCancel={() => setDeleteSectionWarningVisible(false)}
                        onMiddle={() => handleSectionDelete(true)}
                        onContinue={() => handleSectionDelete(false)}
                    />
                )}

                {addSectionVisible && (
                    <AddSectionModal
                        onContinue={() => setAddSectionVisible(false)}
                        onCancel={() => setAddSectionVisible(false)}
                    />
                )}

                <div className="desktop-dash-maincontainer">
                    <div className="desktop-dash-prescout-divider">
                        <div className="desktop-dash-prescout-infodisplay">
                            <div className="desktop-dash-prescout-infodisplay-titlecontainer">
                                <p>
                                    Fully Scouted:{" "}
                                    <span
                                        style={{
                                            color: "rgba(99, 255, 107, 0.6)",
                                        }}
                                    >
                                        {percentageCounts[2]}
                                    </span>
                                </p>

                                <p>
                                    Partially Scouted:{" "}
                                    <span
                                        style={{
                                            color: "rgba(255, 196, 0, 0.74)",
                                        }}
                                    >
                                        {percentageCounts[1]}
                                    </span>
                                </p>
                                <p>
                                    Not Scouted:{" "}
                                    <span
                                        style={{
                                            color: "rgba(235, 54, 54, 0.6)",
                                        }}
                                    >
                                        {percentageCounts[0]}
                                    </span>
                                </p>
                            </div>
                            <Progress3
                                color3="rgb(146, 45, 45)"
                                color2="rgb(221, 169, 0)"
                                color1="rgb(45, 146, 50)"
                                percents={percentages}
                            />
                            <div
                                className="desktop-dash-prescout-infodisplay-bordercontainer"
                                style={{
                                    fontSize: "1.5rem",
                                    marginTop: "10px",
                                }}
                            >
                                {t("listofteams")}
                                <div className="desktop-dash-prescout-infodisplay-table">
                                    {Object.entries(teams).map(
                                        ([teamNum, team]) => (
                                            <div key={teamNum}>
                                                <StatusColor
                                                    numAnswered={
                                                        team.data.length
                                                    }
                                                />
                                                {teamNum} - {team.name}{" "}
                                                {team.code ? (
                                                    <Flag
                                                        code={team.code}
                                                        imageClass="desktop-dash-prescout-infodisplay-table-flag"
                                                    />
                                                ) : (
                                                    <div></div>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className="desktop-dash-prescout-admin-infodisplay"
                            style={
                                useIsAdmin()
                                    ? undefined
                                    : { borderStyle: "dashed" }
                            }
                        >
                            {useIsAdmin() ? (
                                <>
                                    <div className="desktop-dash-comp-infodisplay-admin-controlbuttons">
                                        <button
                                            onClick={() =>
                                                setAddSectionVisible(true)
                                            }
                                        >
                                            + Add Section
                                        </button>
                                        <p className="desktop-dash-comp-infodisplay-title">
                                            Questions:
                                        </p>
                                        <button onClick={() => addQuestion()}>
                                            + Add Question
                                        </button>
                                    </div>
                                    <DragDropContext
                                        onDragEnd={(result) => {
                                            const {
                                                source,
                                                destination,
                                                type,
                                            } = result;

                                            if (!destination) return;

                                            if (type === "SECTION") {
                                                const sectionIds =
                                                    Object.entries(sections)
                                                        .sort(
                                                            ([, a], [, b]) =>
                                                                a.index -
                                                                b.index,
                                                        )
                                                        .map(([id]) => id);

                                                const reordered =
                                                    Array.from(sectionIds);

                                                const [movedSection] =
                                                    reordered.splice(
                                                        source.index,
                                                        1,
                                                    );

                                                reordered.splice(
                                                    destination.index,
                                                    0,
                                                    movedSection,
                                                );

                                                reordered.forEach(
                                                    (id, index) => {
                                                        updateSection(
                                                            id,
                                                            {
                                                                index,
                                                            },
                                                            false,
                                                        );
                                                    },
                                                );

                                                return;
                                            }

                                            const sourceSectionId =
                                                source.droppableId.replace(
                                                    "section-",
                                                    "",
                                                );

                                            const destinationSectionId =
                                                destination.droppableId.replace(
                                                    "section-",
                                                    "",
                                                );

                                            const currentSections =
                                                useSections.getState().sections;

                                            const sourceQuestions = [
                                                ...currentSections[
                                                    sourceSectionId
                                                ].questions,
                                            ];

                                            const destinationQuestions =
                                                sourceSectionId ===
                                                destinationSectionId
                                                    ? sourceQuestions
                                                    : [
                                                          ...currentSections[
                                                              destinationSectionId
                                                          ].questions,
                                                      ];

                                            const [movedQuestion] =
                                                sourceQuestions.splice(
                                                    source.index,
                                                    1,
                                                );

                                            destinationQuestions.splice(
                                                destination.index,
                                                0,
                                                movedQuestion,
                                            );

                                            updateSection(
                                                sourceSectionId,
                                                {
                                                    questions: sourceQuestions,
                                                },
                                                false,
                                            );

                                            if (
                                                sourceSectionId !==
                                                destinationSectionId
                                            ) {
                                                updateSection(
                                                    destinationSectionId,
                                                    {
                                                        questions:
                                                            destinationQuestions,
                                                    },
                                                    false,
                                                );
                                            }
                                        }}
                                    >
                                        <Droppable
                                            droppableId="sections"
                                            type="SECTION"
                                        >
                                            {(provided) => (
                                                <ul
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className="desktop-dash-prescout-admin-infodisplay-questionlist"
                                                >
                                                    {Object.entries(sections)
                                                        .sort(
                                                            ([, a], [, b]) =>
                                                                a.index -
                                                                b.index,
                                                        )
                                                        .map(
                                                            (
                                                                [id, section],
                                                                index,
                                                            ) => (
                                                                <DesktopSection
                                                                    key={id}
                                                                    id={id}
                                                                    deletePrompt={
                                                                        promptDelete
                                                                    }
                                                                    section={
                                                                        section
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                    sectionDeletePrompt={
                                                                        promptSectionDelete
                                                                    }
                                                                    numOfSections={
                                                                        Object.keys(
                                                                            sections,
                                                                        ).length
                                                                    }
                                                                />
                                                            ),
                                                        )}

                                                    {provided.placeholder}
                                                </ul>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </>
                            ) : (
                                <p
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <FaGhost
                                        style={{
                                            paddingRight: "8px",
                                        }}
                                    />
                                    {t("nothingtoseehere")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
}

export default DashboardPrescout;

function StatusColor({ numAnswered }: { numAnswered: number }) {
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

function DesktopSection({
    id,
    index,
    section,
    deletePrompt,
    sectionDeletePrompt,
    numOfSections,
}: {
    id: string;
    index: number;
    section: QuestionSection;
    deletePrompt: (target: string) => void;
    sectionDeletePrompt: (target: string) => void;
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
                                        <FaPencilAlt className="desktop-dash-prescout-admin-infodisplay-managecontainer-editbutton" />
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
}: {
    question: Question;
    id: number;
    index: number;
    deletePrompt: (target: string) => void;
}) {
    const questionTypes = [
        { id: "ln", name: "Long Note" },
        { id: "sn", name: "Short Note" },
        { id: "cb", name: "Checkbox" },
        { id: "mc", name: "Multichoice" },
        { id: "a", name: "Autonomous Path" },
        { id: "img", name: "Image" },
        { id: "n", name: "Number" },
        { id: "r", name: "Slider" },
        { id: "st", name: "Stars" },
        { id: "sc", name: "Single Choice" },
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
                            <FaPencilAlt className="desktop-dash-prescout-admin-infodisplay-managecontainer-editbutton" />
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
                                        { type: type.id },
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

function isMoreFieldsNeeded(type: string) {
    if (type == "r" || type == "st" || type == "mc" || type == "sc") {
        return true;
    }
    return false;
}
