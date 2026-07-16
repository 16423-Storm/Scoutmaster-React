import { useScreenType, useIsAdmin } from "../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

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

import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";

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

    const [items, setItems] = useState(createRange(100));

    if (useScreenType() == "desktop") {
        return (
            <div className="desktop-dash-maincontainer">
                <div className="desktop-dash-prescout-divider">
                    <div className="desktop-dash-prescout-infodisplay">
                        <div className="desktop-dash-prescout-infodisplay-titlecontainer">
                            <p>
                                Fully Scouted:{" "}
                                <span
                                    style={{ color: "rgba(99, 255, 107, 0.6)" }}
                                >
                                    {percentageCounts[2]}
                                </span>
                            </p>

                            <p>
                                Partially Scouted:{" "}
                                <span
                                    style={{ color: "rgba(255, 196, 0, 0.74)" }}
                                >
                                    {percentageCounts[1]}
                                </span>
                            </p>
                            <p>
                                Not Scouted:{" "}
                                <span
                                    style={{ color: "rgba(235, 54, 54, 0.6)" }}
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
                            style={{ fontSize: "1.5rem", marginTop: "10px" }}
                        >
                            {t("listofteams")}
                            <div className="desktop-dash-prescout-infodisplay-table">
                                {Object.entries(teams).map(
                                    ([teamNum, team]) => (
                                        <div key={teamNum}>
                                            <StatusColor
                                                numAnswered={team.data.length}
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
                            useIsAdmin() ? undefined : { borderStyle: "dashed" }
                        }
                    >
                        {useIsAdmin() ? (
                            <>
                                <p className="desktop-dash-comp-infodisplay-title">
                                    Questions:
                                </p>
                                <DragDropProvider
                                    onDragEnd={(event) => {
                                        setItems((items) => move(items, event));
                                    }}
                                >
                                    <ul className="desktop-dash-prescout-admin-infodisplay-questionlist">
                                        {items.map((id, index) => (
                                            <DesktopSortableQuestion
                                                key={id}
                                                id={id}
                                                index={index}
                                            />
                                        ))}
                                    </ul>
                                </DragDropProvider>
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

function DesktopSortableQuestion({
    question,
    section,
    id,
    index,
}:
    | {
          question?: Question;
          section?: never;
          id: number;
          index: number;
      }
    | {
          question?: never;
          section?: QuestionSection;
          id: number;
          index: number;
      }) {
    const [element, setElement] = useState<Element | null>(null);
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const { isDragging } = useSortable({
        id,
        index,
        element,
        handle: handleRef,
    });

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
    ];

    const [selectedType, setSelectedType] = useState(questionTypes[0]);

    const [titleInput, setTitleInput] = useState("");
    const handleTitleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTitleInput(value);
    };

    return (
        <div
            ref={setElement}
            className="desktop-dash-prescout-admin-infodisplay-question"
            data-shadow={isDragging || undefined}
        >
            <div className="desktop-dashprescout-admin-infodisplay-managecontainer">
                <FaPencilAlt className="desktop-dash-prescout-admin-infodisplay-managecontainer-editbutton" />
                <FaTrash className="desktop-dash-prescout-admin-infodisplay-managecontainer-deletebutton" />
            </div>
            <div className="desktop-dash-prescout-admin-infodisplay-questionlayoutcontainer1">
                <QuestionIcon type={selectedType.id} />
                <div className="desktop-dash-prescout-admin-infodisplay-dropdowncontainer">
                    <Listbox value={selectedType} onChange={setSelectedType}>
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
                            More fields required, press edit (pencil) to finish
                        </p>
                    )}
                </div>
                <div className="desktop-dash-prescout-admin-infodisplay-questioninputcontainer">
                    <input
                        value={titleInput}
                        onChange={handleTitleInputChange}
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
                ref={handleRef}
                className="desktop-dash-prescout-admin-infodisplay-question-handle"
            >
                <MdDragIndicator />
            </button>
        </div>
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

function createRange(length: number) {
    return Array.from({ length }, (_, i) => i + 1);
}
