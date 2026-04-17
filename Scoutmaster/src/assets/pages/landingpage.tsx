// Library Imports
import {
    useScreenType,
    useSignedIn,
    useGoToPage,
} from "../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import i18n from "i18next";

// Script Imports
import { languages } from "../scripts/localization.js";

// Component Imports
import { LanguageDropdown } from "./components/languagedropdown.js";

// Image Imports
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

    const goToSignUp = useGoToPage("/signup");

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
                        <button
                            className="phone-landing-signinbutton"
                            onClick={goToSignUp}
                        >
                            {useSignedIn() ? t("signin") : t("signup")}
                        </button>
                    </div>
                    <p className="phone-landing-herotitle">Scoutmaster</p>
                    <img src={LogoWhite} className="phone-landing-herologo" />
                    <div className="centerdiv">
                        {/* Laptop render of dashboard will go here */}
                        <p className="phone-landing-heroslogan">
                            {t("slogan")}
                        </p>
                    </div>
                </div>
                <div className="fullpage">
                    <div className="centerdiv-top">
                        <p className="phone-landing-title1">
                            {t("landingtitle1")}
                        </p>
                        <p className="phone-landing-bodytext">
                            {t("landingbody1")}
                        </p>
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
