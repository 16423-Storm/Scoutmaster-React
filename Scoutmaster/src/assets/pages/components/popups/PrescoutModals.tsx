import {
    useScreenType,
    useIsAkwardHeight,
    useSpecifyCustomCountry,
} from "../../../scripts/multipageutils";
import { Blocker499 } from "../blocker";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { ChangeEvent } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";

import {
    addSection,
    updateSection,
    getSection,
    getQuestion,
    updateQuestion,
} from "../../../scripts/localstorage";

import { IoMdStar } from "react-icons/io";
import { MdDragIndicator } from "react-icons/md";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import { errorToast } from "../../../scripts/misc/toastmanager";

/**
 * @param onCancel - What occurs when user presses cancel
 * @param onContinue - What occurs when user presses continue, NOTE: This function handles the logic to add the section on its own, onContinue is just for UI purposes
 * @returns The popup for adding a section
 */
export function AddSectionModal({
    onCancel,
    onContinue,
}: {
    onCancel: () => void;
    onContinue: () => void;
}) {
    const { t } = useTranslation();

    const [inputTitle, setInputTitle] = useState("");

    const handleTitleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputTitle(value);
    };

    function handleContinue() {
        addSection({
            title: inputTitle,
            headersize: selectedHeaderSize.id,
            questions: [],
            index: 0,
        });
        onContinue();
    }

    const headerSizes = [
        { id: 1, name: "h1" },
        { id: 2, name: "h2" },
        { id: 3, name: "h3" },
    ];

    const [selectedHeaderSize, setSelectedHeaderSize] = useState(
        headerSizes[0],
    );

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{ height: useIsAkwardHeight() ? "40vh" : "25vh" }}
                >
                    <p className="desktop-warningpopup-title">
                        {t("addsection")}
                    </p>
                    <div className="desktop-popupinput-highlightedbody">
                        <div className="desktop-popupinput-parentcontainer">
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("sectiontitle")}</p>
                                <input
                                    value={inputTitle}
                                    placeholder={t("sectiontitleplaceholder")}
                                    maxLength={50}
                                    onChange={handleTitleInputChange}
                                    className={
                                        inputTitle.length === 50
                                            ? "desktop-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                                <div
                                    style={
                                        inputTitle.length === 50
                                            ? { color: "red" }
                                            : undefined
                                    }
                                >
                                    {inputTitle.length}/50
                                </div>
                            </div>
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("headersize")}</p>
                                <Listbox
                                    value={selectedHeaderSize}
                                    onChange={setSelectedHeaderSize}
                                >
                                    <ListboxButton
                                        className={
                                            "desktop-popup-prescoutdropdownbutton"
                                        }
                                    >
                                        {selectedHeaderSize.name} ▼
                                    </ListboxButton>
                                    <ListboxOptions
                                        anchor="bottom"
                                        className="desktop-popup-prescoutdropdown"
                                    >
                                        {headerSizes.map(
                                            (selectedHeaderSize) => (
                                                <ListboxOption
                                                    key={selectedHeaderSize.id}
                                                    value={selectedHeaderSize}
                                                >
                                                    {selectedHeaderSize.name}
                                                </ListboxOption>
                                            ),
                                        )}
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="desktop-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={handleContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{ height: useIsAkwardHeight() ? "40vh" : "25vh" }}
                >
                    <p className="phone-warningpopup-title">
                        {t("addsection")}
                    </p>
                    <div className="phone-popupinput-highlightedbody">
                        <div className="phone-popupinput-parentcontainer">
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("sectiontitle")}</p>
                                <input
                                    value={inputTitle}
                                    placeholder={t("sectiontitleplaceholder")}
                                    maxLength={50}
                                    onChange={handleTitleInputChange}
                                    className={
                                        inputTitle.length === 50
                                            ? "phone-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                                <div
                                    style={
                                        inputTitle.length === 50
                                            ? { color: "red" }
                                            : undefined
                                    }
                                >
                                    {inputTitle.length}/50
                                </div>
                            </div>
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("headersize")}</p>
                                <Listbox
                                    value={selectedHeaderSize}
                                    onChange={setSelectedHeaderSize}
                                >
                                    <ListboxButton
                                        className={
                                            "phone-popup-prescoutdropdownbutton"
                                        }
                                    >
                                        {selectedHeaderSize.name} ▼
                                    </ListboxButton>
                                    <ListboxOptions
                                        anchor="bottom"
                                        className="phone-popup-prescoutdropdown"
                                    >
                                        {headerSizes.map(
                                            (selectedHeaderSize) => (
                                                <ListboxOption
                                                    key={selectedHeaderSize.id}
                                                    value={selectedHeaderSize}
                                                >
                                                    {selectedHeaderSize.name}
                                                </ListboxOption>
                                            ),
                                        )}
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="phone-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="phone-warningpopup-continue"
                            onClick={handleContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

/**
 * @param onCancel - What occurs when user presses cancel
 * @param onContinue - What occurs when user presses continue, NOTE: This function handles the logic to edit the section on its own, onContinue is just for UI purposes
 * @returns The popup for editing a section
 */
export function EditSectionModal({
    onCancel,
    onContinue,
    sectionId,
}: {
    sectionId: string;
    onCancel: () => void;
    onContinue: () => void;
}) {
    const section = getSection(sectionId);
    const { t } = useTranslation();

    const [inputTitle, setInputTitle] = useState(section.title);

    const handleTitleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setInputTitle(value);
    };

    function handleContinue() {
        updateSection(
            sectionId,
            {
                title: inputTitle,
                headersize: selectedHeaderSize.id,
            },
            false,
        );
        onContinue();
    }

    const headerSizes = [
        { id: 1, name: "h1" },
        { id: 2, name: "h2" },
        { id: 3, name: "h3" },
    ];

    const [selectedHeaderSize, setSelectedHeaderSize] = useState(
        headerSizes[section.headersize],
    );

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{ height: useIsAkwardHeight() ? "40vh" : "30vh" }}
                >
                    <p className="desktop-warningpopup-title">
                        {t("editsection")}
                    </p>
                    <div className="desktop-popupinput-highlightedbody">
                        <div className="desktop-popupinput-parentcontainer">
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("sectiontitle")}</p>
                                <input
                                    value={inputTitle}
                                    placeholder={t("sectiontitleplaceholder")}
                                    maxLength={50}
                                    onChange={handleTitleInputChange}
                                    className={
                                        inputTitle.length === 50
                                            ? "desktop-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                                <div
                                    style={
                                        inputTitle.length === 50
                                            ? { color: "red" }
                                            : undefined
                                    }
                                >
                                    {inputTitle.length}/50
                                </div>
                            </div>
                            <div className="desktop-popupinput-childcontainer">
                                <p>{t("headersize")}</p>
                                <Listbox
                                    value={selectedHeaderSize}
                                    onChange={setSelectedHeaderSize}
                                >
                                    <ListboxButton
                                        className={
                                            "desktop-popup-prescoutdropdownbutton"
                                        }
                                    >
                                        {selectedHeaderSize.name} ▼
                                    </ListboxButton>
                                    <ListboxOptions
                                        anchor="bottom"
                                        className="desktop-popup-prescoutdropdown"
                                    >
                                        {headerSizes.map(
                                            (selectedHeaderSize) => (
                                                <ListboxOption
                                                    key={selectedHeaderSize.id}
                                                    value={selectedHeaderSize}
                                                >
                                                    {selectedHeaderSize.name}
                                                </ListboxOption>
                                            ),
                                        )}
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="desktop-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={handleContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                <div
                    className="phone-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{ height: useIsAkwardHeight() ? "40vh" : "25vh" }}
                >
                    <p className="phone-warningpopup-title">
                        {t("editsection")}
                    </p>
                    <div className="phone-popupinput-highlightedbody">
                        <div className="phone-popupinput-parentcontainer">
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("sectiontitle")}</p>
                                <input
                                    value={inputTitle}
                                    placeholder={t("sectiontitleplaceholder")}
                                    maxLength={50}
                                    onChange={handleTitleInputChange}
                                    className={
                                        inputTitle.length === 50
                                            ? "phone-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                                <div
                                    style={
                                        inputTitle.length === 50
                                            ? { color: "red" }
                                            : undefined
                                    }
                                >
                                    {inputTitle.length}/50
                                </div>
                            </div>
                            <div className="phone-popupinput-childcontainer">
                                <p>{t("headersize")}</p>
                                <Listbox
                                    value={selectedHeaderSize}
                                    onChange={setSelectedHeaderSize}
                                >
                                    <ListboxButton
                                        className={
                                            "phone-popup-prescoutdropdownbutton"
                                        }
                                    >
                                        {selectedHeaderSize.name} ▼
                                    </ListboxButton>
                                    <ListboxOptions
                                        anchor="bottom"
                                        className="phone-popup-prescoutdropdown"
                                    >
                                        {headerSizes.map(
                                            (selectedHeaderSize) => (
                                                <ListboxOption
                                                    key={selectedHeaderSize.id}
                                                    value={selectedHeaderSize}
                                                >
                                                    {selectedHeaderSize.name}
                                                </ListboxOption>
                                            ),
                                        )}
                                    </ListboxOptions>
                                </Listbox>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="phone-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="phone-warningpopup-continue"
                            onClick={handleContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

/**
 * @param onCancel - What occurs when user presses cancel
 * @param onContinue - What occurs when user presses continue, NOTE: This function handles the logic to edit the section on its own, onContinue is just for UI purposes
 * @returns The popup for editing a section
 */
export function EditQuestionModal({
    onCancel,
    onContinue,
    questionId,
}: {
    questionId: string;
    onCancel: () => void;
    onContinue: () => void;
}) {
    const question = getQuestion(questionId);

    const { t } = useTranslation();

    function handleContinue() {
        if (question.type === "mc" || question.type === "sc") {
            updateQuestion(
                questionId,
                {
                    opt: Object.fromEntries(
                        choices.map((choice) => [choice.id, choice.title]),
                    ),
                },
                false,
            );
        } else if (question.type === "r") {
            updateQuestion(
                questionId,
                {
                    minmax: [min, max],
                },
                false,
            );
        } else if (question.type === "st") {
            updateQuestion(
                questionId,
                {
                    stars: numOfStars,
                },
                false,
            );
        }

        onContinue();
    }

    // Stars
    const [numOfStars, setNumOfStars] = useState(
        question.type === "st" ? question.stars : 1,
    );

    const handleStarsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNumOfStars(Number(value));
    };

    // Slider
    const [min, setMin] = useState(
        question.type === "r" ? question.minmax[0] : 0,
    );
    const [max, setMax] = useState(
        question.type === "r" ? question.minmax[1] : 0,
    );

    const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setMin(Number(value));
    };

    const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setMax(Number(value));
    };

    // Multiple Choice
    const [choices, setChoices] = useState<{ id: string; title: string }[]>(
        question.type === "mc" || question.type === "sc"
            ? Object.entries(question.opt ?? {}).map(([id, title]) => ({
                  id,
                  title,
              }))
            : [],
    );

    function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        setChoices(
            reorder(choices, result.source.index, result.destination.index),
        );
    };

    const handleChoiceChange = (
        id: string,
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setChoices((prevChoices) =>
            prevChoices.map((choice) =>
                choice.id === id
                    ? { ...choice, title: event.target.value }
                    : choice,
            ),
        );
    };

    function handleChoiceDelete(id: string) {
        setChoices((prevChoices) =>
            prevChoices
                .filter((choice) => choice.id !== id)
                .map((choice, index) => ({
                    ...choice,
                    id: String(index + 1),
                })),
        );
    }

    function handleChoiceAdd() {
        if (choices.length < 10) {
            setChoices((prevChoices) => {
                const usedIds = prevChoices.map((choice) => Number(choice.id));
                let nextId = 0;

                while (usedIds.includes(nextId)) {
                    nextId++;
                }

                return [
                    ...prevChoices,
                    {
                        id: String(nextId),
                        title: t("newchoice", { num: String(nextId) }),
                    },
                ];
            });
        } else {
            errorToast(t("maxchoices"), 3000);
        }
    }

    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{ height: useIsAkwardHeight() ? "60vh" : "45vh" }}
                >
                    <p className="desktop-warningpopup-title">
                        {t("editquestion")}
                    </p>
                    <div className="desktop-popupinput-highlightedbody">
                        <div
                            className="desktop-popupinput-parentcontainer"
                            style={{
                                justifyContent: "center",
                            }}
                        >
                            {question.type == "mc" || question.type == "sc" ? (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        flexDirection: "column",
                                    }}
                                >
                                    <button
                                        className="desktop-popupinput-addchoice"
                                        onClick={handleChoiceAdd}
                                    >
                                        {t("+addchoice")}
                                    </button>
                                    <div
                                        className="desktop-popupinput-childcontainer"
                                        style={{
                                            width: "90%",
                                            maxHeight: "200px",
                                            overflowY: "scroll",
                                            border: "1px solid var(--clr-surface-tonal-a20)",
                                            borderRadius: "10px",
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                        }}
                                    >
                                        <DragDropContext
                                            onDragEnd={handleDragEnd}
                                        >
                                            <Droppable droppableId="list">
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                    >
                                                        {choices.map(
                                                            (choice, index) => (
                                                                <Draggable
                                                                    key={
                                                                        choice.id
                                                                    }
                                                                    draggableId={
                                                                        choice.id
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided,
                                                                        snapshot,
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            className="desktop-popup-choice"
                                                                            data-shadow={
                                                                                snapshot.isDragging ||
                                                                                undefined
                                                                            }
                                                                        >
                                                                            <p
                                                                                onClick={() =>
                                                                                    handleChoiceDelete(
                                                                                        choice.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                X
                                                                            </p>
                                                                            <div>
                                                                                <input
                                                                                    value={
                                                                                        choice.title
                                                                                    }
                                                                                    onChange={(
                                                                                        event,
                                                                                    ) =>
                                                                                        handleChoiceChange(
                                                                                            choice.id,
                                                                                            event,
                                                                                        )
                                                                                    }
                                                                                    maxLength={
                                                                                        50
                                                                                    }
                                                                                    className={
                                                                                        choice
                                                                                            .title
                                                                                            .length ===
                                                                                        50
                                                                                            ? "desktop-popupinput-maxedinput"
                                                                                            : undefined
                                                                                    }
                                                                                />
                                                                                <div
                                                                                    style={
                                                                                        choice
                                                                                            .title
                                                                                            .length ===
                                                                                        50
                                                                                            ? {
                                                                                                  color: "red",
                                                                                              }
                                                                                            : undefined
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        choice
                                                                                            .title
                                                                                            .length
                                                                                    }
                                                                                    /50
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                {...provided.dragHandleProps}
                                                                                className="desktop-popup-draghandle"
                                                                            >
                                                                                <MdDragIndicator />
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ),
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </div>
                                </div>
                            ) : question.type == "st" ? (
                                <div
                                    className="desktop-popupinput-childcontainer"
                                    style={{ width: "80%" }}
                                >
                                    <p>{t("stars", { num: numOfStars })}</p>
                                    <input
                                        value={numOfStars}
                                        type="range"
                                        min={1}
                                        max={10}
                                        onChange={handleStarsChange}
                                        className="desktop-popupinput-starslider"
                                    />
                                    <div
                                        style={{
                                            fontSize: "1.2rem",
                                            justifyContent: "center",
                                            display: "flex",
                                        }}
                                    >
                                        {Array.from({ length: numOfStars }).map(
                                            (_, index) => (
                                                <IoMdStar key={index} />
                                            ),
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="desktop-popupinput-childcontainer">
                                        <p>{t("min")}</p>
                                        <input
                                            type="number"
                                            min={-999999}
                                            max={99999}
                                            value={min}
                                            onChange={handleMinChange}
                                        />
                                    </div>
                                    <div className="desktop-popupinput-childcontainer">
                                        <p>{t("max")}</p>
                                        <input
                                            type="number"
                                            min={-999999}
                                            max={99999}
                                            value={max}
                                            onChange={handleMaxChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        <button
                            className="desktop-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={handleContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                <div
                    className="phone-warningpopup"
                    id="avoidwarningpopupheight"
                    style={{ height: useIsAkwardHeight() ? "60vh" : "45vh" }}
                >
                    <p className="phone-warningpopup-title">
                        {t("editquestion")}
                    </p>
                    <div className="phone-popupinput-highlightedbody">
                        <div
                            className="phone-popupinput-parentcontainer"
                            style={{
                                justifyContent: "center",
                            }}
                        >
                            {question.type == "mc" || question.type == "sc" ? (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        flexDirection: "column",
                                    }}
                                >
                                    <button
                                        className="phone-popupinput-addchoice"
                                        onClick={handleChoiceAdd}
                                    >
                                        {t("+addchoice")}
                                    </button>
                                    <div
                                        className="phone-popupinput-childcontainer"
                                        style={{
                                            width: "90%",
                                            maxHeight: "200px",
                                            overflowY: "scroll",
                                            border: "1px solid var(--clr-surface-tonal-a20)",
                                            borderRadius: "10px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <DragDropContext
                                            onDragEnd={handleDragEnd}
                                        >
                                            <Droppable droppableId="list">
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
                                                            flexDirection:
                                                                "column",
                                                            gap: "15px",
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        {choices.map(
                                                            (choice, index) => (
                                                                <Draggable
                                                                    key={
                                                                        choice.id
                                                                    }
                                                                    draggableId={
                                                                        choice.id
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided,
                                                                        snapshot,
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            className="phone-popup-choice"
                                                                            data-shadow={
                                                                                snapshot.isDragging ||
                                                                                undefined
                                                                            }
                                                                        >
                                                                            <p
                                                                                onClick={() =>
                                                                                    handleChoiceDelete(
                                                                                        choice.id,
                                                                                    )
                                                                                }
                                                                            >
                                                                                X
                                                                            </p>
                                                                            <div>
                                                                                <input
                                                                                    value={
                                                                                        choice.title
                                                                                    }
                                                                                    onChange={(
                                                                                        event,
                                                                                    ) =>
                                                                                        handleChoiceChange(
                                                                                            choice.id,
                                                                                            event,
                                                                                        )
                                                                                    }
                                                                                    maxLength={
                                                                                        50
                                                                                    }
                                                                                    className={
                                                                                        choice
                                                                                            .title
                                                                                            .length ===
                                                                                        50
                                                                                            ? "phone-popupinput-maxedinput"
                                                                                            : undefined
                                                                                    }
                                                                                />
                                                                                <div
                                                                                    style={
                                                                                        choice
                                                                                            .title
                                                                                            .length ===
                                                                                        50
                                                                                            ? {
                                                                                                  color: "red",
                                                                                              }
                                                                                            : undefined
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        choice
                                                                                            .title
                                                                                            .length
                                                                                    }
                                                                                    /50
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                {...provided.dragHandleProps}
                                                                                className="phone-popup-draghandle"
                                                                            >
                                                                                <MdDragIndicator />
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ),
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </div>
                                </div>
                            ) : question.type == "st" ? (
                                <div
                                    className="phone-popupinput-childcontainer"
                                    style={{ width: "80%" }}
                                >
                                    <p>{t("stars", { num: numOfStars })}</p>
                                    <input
                                        value={numOfStars}
                                        type="range"
                                        min={1}
                                        max={10}
                                        onChange={handleStarsChange}
                                        className="phone-popupinput-starslider"
                                    />
                                    <div
                                        style={{
                                            fontSize: "1.2rem",
                                            justifyContent: "center",
                                            display: "flex",
                                        }}
                                    >
                                        {Array.from({ length: numOfStars }).map(
                                            (_, index) => (
                                                <IoMdStar key={index} />
                                            ),
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="phone-popupinput-childcontainer">
                                        <p>{t("min")}</p>
                                        <input
                                            type="number"
                                            min={-999999}
                                            max={99999}
                                            value={min}
                                            onChange={handleMinChange}
                                        />
                                    </div>
                                    <div className="phone-popupinput-childcontainer">
                                        <p>{t("max")}</p>
                                        <input
                                            type="number"
                                            min={-999999}
                                            max={99999}
                                            value={max}
                                            onChange={handleMaxChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        <button
                            className="phone-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="phone-warningpopup-continue"
                            onClick={handleContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
