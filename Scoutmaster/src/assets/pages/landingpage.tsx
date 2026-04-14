import { useScreenType, useSignedIn } from "../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import i18n from "i18next";
import { languages } from "../scripts/localization.js";

import { LanguageDropdown } from "./components/languagedropdown.js";

import LogoWhite from "../images/branding/logowhite.png";

function LandingPage() {
    const { t } = useTranslation();
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const currentLanguage =
        languages.find((lang) => lang.code === i18n.language) || languages[0];

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setLanguageMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const screenType = useScreenType();
    if (screenType === "phone") {
        return (
            <>
                <div className="phone-landing-hero">
                    <div className="phone-landing-navbar">
                        <LanguageDropdown
                            dropdownRef={dropdownRef}
                            setLanguageMenuOpen={setLanguageMenuOpen}
                            currentLanguage={currentLanguage}
                            languageMenuOpen={languageMenuOpen}
                            languages={languages}
                        />
                        <button>{t("wiki")}</button>
                        <button>{t("about")}</button>
                        <button className="phone-landing-signinbutton">
                            {useSignedIn() ? t("signin") : t("signup")}
                        </button>
                    </div>
                    <p className="phone-landing-herotitle">Scoutmaster</p>
                    <img src={LogoWhite} className="phone-landing-herologo" />
                    <div className="rowcontainer-fillrest">
                        <div className="halfcontainer">
                            <ul className="phone-landing-ul">
                                <li>{t("point1")}</li>
                                <li>{t("point2")}</li>
                                <li>{t("point3")}</li>
                            </ul>
                        </div>
                        <div className="halfcontainer"></div>
                    </div>
                </div>
            </>
        );
    }

    if (screenType === "tablet") {
        return (
            <div>
                <p>hello</p>
            </div>
        );
    }

    return (
        <div>
            <p>helloe</p>
        </div>
    );
}

export default LandingPage;
