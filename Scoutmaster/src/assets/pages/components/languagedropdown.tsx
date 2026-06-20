import i18n from "i18next";

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
                style={{
                    background: "transparent",
                    border: "none",
                    color: color ? "var(--black)" : "var(--white)",
                    cursor: "pointer",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                }}
            >
                {`${currentLanguage.flag} ${currentLanguage.label}`} ▼
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
                    <div
                        style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "4px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                            backdropFilter: "blur(6px)",
                            minWidth: "5rem",
                            maxHeight: "10rem",
                            overflowY: "auto",
                        }}
                    >
                        {languages.map((lang: Language) => (
                            <div
                                key={lang.code}
                                onClick={() => {
                                    i18n.changeLanguage(lang.code);
                                    setLanguageMenuOpen(false);
                                }}
                                style={{
                                    padding: "0.5rem 1rem",
                                    cursor: "pointer",
                                    color: color
                                        ? "var(--black)"
                                        : "var(--white)",
                                    whiteSpace: "nowrap",
                                    transition: "background 0.2s",
                                    textAlign: "center",
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
                                {lang.flag} {lang.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
