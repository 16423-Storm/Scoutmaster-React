import i18n from "i18next";

import Flag from "./flag";

type Language = {
    code: string;
    flag: string;
    label: string;
};

type Parameters = {
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    setLanguageMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentLanguage: Language;
    languageMenuOpen: boolean;
    languages: Language[];
    color?: boolean;
};

export function LanguageDropdown({
    dropdownRef,
    setLanguageMenuOpen,
    currentLanguage,
    languageMenuOpen,
    languages,
    color = false,
}: Parameters) {
    return (
        <div
            className="nav-language-dropdown"
            ref={dropdownRef}
            style={{ position: "relative" }}
        >
            <button
                onClick={() => setLanguageMenuOpen((prev: boolean) => !prev)}
                className="localization-menuopenbutton"
                style={{
                    color: color ? "var(--black)" : "var(--white)",
                }}
            >
                <Flag
                    code={currentLanguage.flag}
                    imageClass="localization-dropdownflag1"
                />{" "}
                {`${currentLanguage.label}`} {languageMenuOpen ? "▲" : "▼"}
            </button>

            {languageMenuOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10,
                    }}
                >
                    <div className="localization-selectiondiv">
                        {languages.map((lang: Language) => (
                            <div
                                key={lang.code}
                                onClick={() => {
                                    i18n.changeLanguage(lang.code);
                                    setLanguageMenuOpen(false);
                                }}
                                style={{
                                    padding: "0.5rem",
                                    cursor: "pointer",
                                    color: color
                                        ? "var(--black)"
                                        : "var(--white)",
                                    whiteSpace: "nowrap",
                                    transition: "background 0.2s",
                                    textAlign: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "rgba(255,255,255,0.1)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "transparent")
                                }
                            >
                                <Flag
                                    code={lang.flag}
                                    imageClass="localization-dropdownflag2"
                                />{" "}
                                {lang.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
