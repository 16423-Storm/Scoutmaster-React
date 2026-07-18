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

import { addSection } from "../../../scripts/localstorage";

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
        addSection(
            {
                title: inputTitle,
                headersize: selectedHeaderSize.id,
                questions: [],
                index: 0,
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
                    <p className="desktop-warningpopup-title">Add Section</p>
                    <div className="desktop-popupinput-highlightedbody">
                        <div className="desktop-popupinput-parentcontainer">
                            <div className="desktop-popupinput-childcontainer">
                                <p>Section Title:</p>
                                <input
                                    value={inputTitle}
                                    placeholder="Section Title:"
                                    maxLength={90}
                                    onChange={handleTitleInputChange}
                                    className={
                                        inputTitle.length === 90
                                            ? "desktop-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                                <div
                                    style={
                                        inputTitle.length === 90
                                            ? { color: "red" }
                                            : undefined
                                    }
                                >
                                    {inputTitle.length}/90
                                </div>
                            </div>
                            <div className="desktop-popupinput-childcontainer">
                                <p>Header Size:</p>
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
                    style={{ height: useIsAkwardHeight() ? "40vh" : "30vh" }}
                >
                    <p className="phone-warningpopup-title">{t("addteam")}</p>
                    <div className="phone-popupinput-highlightedbody">
                        <div className="phone-popupinput-parentcontainer">
                            <div className="phone-popupinput-childcontainer">
                                <p>Section Title:</p>
                                <input
                                    value={inputTitle}
                                    placeholder="Section Title"
                                    maxLength={90}
                                    onChange={handleTitleInputChange}
                                    className={
                                        inputTitle.length === 90
                                            ? "phone-popupinput-maxedinput"
                                            : undefined
                                    }
                                />
                                <div
                                    style={
                                        inputTitle.length === 90
                                            ? { color: "red" }
                                            : undefined
                                    }
                                >
                                    {inputTitle.length}/90
                                </div>
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
