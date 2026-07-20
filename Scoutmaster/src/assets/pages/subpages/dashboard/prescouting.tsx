import { useScreenType, useIsAdmin } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import {
    deleteQuestion,
    useSections,
    updateSection,
    deleteSection,
    addQuestion,
} from "../../../scripts/localstorage";
import { useState } from "react";
import { useTeams } from "../../../scripts/localstorage";
import { Progress3 } from "../../components/progressbar";
import { WarningModal, WarningModal3Button } from "../../components/popups";
import Flag from "../../components/flag";
import { getNumOfQuestions } from "../../../scripts/localstorage";
import { FaGhost } from "react-icons/fa";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Bounce, ToastContainer } from "react-toastify";
import {
    AddSectionModal,
    EditSectionModal,
    EditQuestionModal,
} from "../../components/popups/PrescoutModals";
import { StatusColor, DesktopSection } from "./prescouting/desktoputils";
import { PhoneSection } from "./prescouting/phoneutils";

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
        setSectionToDelete(target);
        setDeleteSectionWarningVisible(true);
    }

    function handleSectionDelete(deleteQuestions: boolean = false) {
        setDeleteSectionWarningVisible(false);
        deleteSection(sectionToDelete, deleteQuestions, false);
    }

    const [addSectionVisible, setAddSectionVisible] = useState(false);

    const [editSectionVisible, setEditSectionVisible] = useState(false);
    const [sectionToEdit, setSectionToEdit] = useState("0");

    function promptSectionEdit(target: string) {
        setSectionToEdit(target);
        setEditSectionVisible(true);
    }

    const [editQuestionVisible, setEditQuestionVisible] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState("0");

    function promptQuestionEdit(target: string) {
        setQuestionToEdit(target);
        setEditQuestionVisible(true);
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <ToastContainer
                    position="bottom-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Bounce}
                />
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
                        onMiddleMessage={t("continue&deletequest")}
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

                {editSectionVisible && (
                    <EditSectionModal
                        onContinue={() => setEditSectionVisible(false)}
                        onCancel={() => setEditSectionVisible(false)}
                        sectionId={sectionToEdit}
                    />
                )}

                {editQuestionVisible && (
                    <EditQuestionModal
                        questionId={questionToEdit}
                        onContinue={() => setEditQuestionVisible(false)}
                        onCancel={() => setEditQuestionVisible(false)}
                    />
                )}

                <div className="desktop-dash-maincontainer">
                    <div className="desktop-dash-prescout-divider">
                        <div className="desktop-dash-prescout-infodisplay">
                            <div className="desktop-dash-prescout-infodisplay-titlecontainer">
                                <p>
                                    {t("fullyscouted")}{" "}
                                    <span
                                        style={{
                                            color: "rgba(99, 255, 107, 0.6)",
                                        }}
                                    >
                                        {percentageCounts[2]}
                                    </span>
                                </p>

                                <p>
                                    {t("partiallyscouted")}{" "}
                                    <span
                                        style={{
                                            color: "rgba(255, 196, 0, 0.74)",
                                        }}
                                    >
                                        {percentageCounts[1]}
                                    </span>
                                </p>
                                <p>
                                    {t("notscouted")}{" "}
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
                                            {t("+addsection")}
                                        </button>
                                        <p className="desktop-dash-comp-infodisplay-title">
                                            {t("questions")}
                                        </p>
                                        <button onClick={() => addQuestion()}>
                                            {t("+addquestion")}
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
                                                                    questionEdit={
                                                                        promptQuestionEdit
                                                                    }
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
                                                                    editPrompt={
                                                                        promptSectionEdit
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
        return (
            <>
                <ToastContainer
                    position="bottom-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    transition={Bounce}
                />
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
                        onMiddleMessage={t("continue&deletequest")}
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

                {editSectionVisible && (
                    <EditSectionModal
                        onContinue={() => setEditSectionVisible(false)}
                        onCancel={() => setEditSectionVisible(false)}
                        sectionId={sectionToEdit}
                    />
                )}

                {editQuestionVisible && (
                    <EditQuestionModal
                        questionId={questionToEdit}
                        onContinue={() => setEditQuestionVisible(false)}
                        onCancel={() => setEditQuestionVisible(false)}
                    />
                )}

                <div className="phone-dash-maincontainer">
                    <div className="phone-dash-prescout-divider">
                        <div className="phone-dash-prescout-infodisplay">
                            <div className="phone-dash-prescout-infodisplay-titlecontainer">
                                <p>
                                    {t("fullyscouted")}{" "}
                                    <span
                                        style={{
                                            color: "rgba(99, 255, 107, 0.6)",
                                        }}
                                    >
                                        {percentageCounts[2]}
                                    </span>
                                </p>

                                <p>
                                    {t("partiallyscouted")}{" "}
                                    <span
                                        style={{
                                            color: "rgba(255, 196, 0, 0.74)",
                                        }}
                                    >
                                        {percentageCounts[1]}
                                    </span>
                                </p>
                                <p>
                                    {t("notscouted")}{" "}
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
                                className="phone-dash-prescout-infodisplay-bordercontainer"
                                style={{
                                    fontSize: "1.5rem",
                                    marginTop: "10px",
                                    gap: "5px",
                                }}
                            >
                                {t("listofteams")}
                                <div className="phone-dash-prescout-infodisplay-table">
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
                                                        imageClass="phone-dash-prescout-infodisplay-table-flag"
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
                            className="phone-dash-prescout-admin-infodisplay"
                            style={
                                useIsAdmin()
                                    ? undefined
                                    : { borderStyle: "dashed" }
                            }
                        >
                            {useIsAdmin() ? (
                                <>
                                    <div className="phone-dash-comp-infodisplay-admin-controlbuttons">
                                        <p className="phone-dash-comp-infodisplay-title">
                                            {t("questions")}
                                        </p>
                                        <button
                                            onClick={() =>
                                                setAddSectionVisible(true)
                                            }
                                        >
                                            {t("+addsection")}
                                        </button>
                                        <button onClick={() => addQuestion()}>
                                            {t("+addquestion")}
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
                                                    className="phone-dash-prescout-admin-infodisplay-questionlist"
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
                                                                <PhoneSection
                                                                    questionEdit={
                                                                        promptQuestionEdit
                                                                    }
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
                                                                    editPrompt={
                                                                        promptSectionEdit
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
    }
}

export default DashboardPrescout;
