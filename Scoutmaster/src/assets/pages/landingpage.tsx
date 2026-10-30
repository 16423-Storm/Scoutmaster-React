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

// Icon Imports
import {
    FaDiscord,
    FaGavel,
    FaGlobe,
    FaInstagram,
    FaShieldAlt,
    FaTiktok,
} from "react-icons/fa";

// Image Imports
import LogoWhite from "../images/branding/logowhite.png";
import { PrivacyPolicy, TOS } from "./components/policies.js";

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
    const goToSignIn = useGoToPage("/signin");

    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        useSignedIn()
            .then((result) => {
                setSignedIn(result);
            })
            .catch(() => {
                setSignedIn(false);
            });
    }, []);

    const [showTos, setShowTos] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    const screenType = useScreenType();
    if (screenType === "phone") {
        return (
            <>
                {showPrivacy && (
                    <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
                )}
                {showTos && <TOS onClose={() => setShowTos(false)} />}
                <div className="phone-landing-hero">
                    <div className="phone-landing-navbar">
                        <LanguageDropdown
                            dropdownRef={dropdownRef}
                            setLanguageMenuOpen={setLanguageMenuOpen}
                            currentLanguage={currentLanguage}
                            languageMenuOpen={languageMenuOpen}
                            languages={languages}
                        />
                        {/* <button>{t("wiki")}</button>
                        <button>{t("about")}</button> */}
                        <button
                            className="phone-landing-signinbutton"
                            onClick={signedIn ? goToSignIn : goToSignUp}
                        >
                            {signedIn ? t("signin") : t("signup")}
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
                {/* <div className="fullpage">
                    <div className="centerdiv-top">
                        <p className="phone-landing-title1">
                            {t("landingtitle1")}
                        </p>
                        <p className="phone-landing-bodytext">
                            {t("landingbody1")}
                        </p>
                    </div>
                </div> */}
                <footer className="phone-landing-footer">
                    <div>
                        <p>{t("socials")}</p>
                        <a href="https://www.instagram.com/sdhs_stormbot16423/">
                            <FaInstagram /> {t("ourinstagram")}
                        </a>
                        <a href="https://www.tiktok.com/@sdhstormbot16423?_r=1&_t=ZS-9AljGz3Uesp">
                            <FaTiktok /> {t("ourtiktok")}
                        </a>
                        <a href="https://discord.gg/xB7YX7yww2">
                            <FaDiscord /> {t("scoutmasterdiscord")}
                        </a>
                        <a href="https://storm16423.ca/">
                            <FaGlobe /> {t("ourwebsite")}
                        </a>
                    </div>
                    <div>
                        <p>{t("resources")}</p>
                        <a onClick={() => setShowPrivacy(true)}>
                            <FaGavel /> {t("privacypolicy")}
                        </a>
                        <a onClick={() => setShowTos(true)}>
                            <FaShieldAlt /> {t("tos")}
                        </a>
                    </div>
                </footer>
            </>
        );
    }

    return (
        <>
            {showPrivacy && (
                <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
            )}
            {showTos && <TOS onClose={() => setShowTos(false)} />}
            <div className="desktop-landing-hero">
                <div className="desktop-landing-navbar">
                    <LanguageDropdown
                        dropdownRef={dropdownRef}
                        setLanguageMenuOpen={setLanguageMenuOpen}
                        currentLanguage={currentLanguage}
                        languageMenuOpen={languageMenuOpen}
                        languages={languages}
                    />
                    <div className="desktop-landing-navbardivider">
                        {/* <button>{t("wiki")}</button>
                        <button>{t("about")}</button> */}
                        <button
                            className="desktop-landing-signinbutton"
                            onClick={signedIn ? goToSignIn : goToSignUp}
                        >
                            {signedIn ? t("signin") : t("signup")}
                        </button>
                    </div>
                </div>
                <p className="desktop-landing-herotitle">Scoutmaster</p>
                <img src={LogoWhite} className="desktop-landing-herologo" />
                <div className="centerdiv">
                    {/* Laptop render of dashboard will go here */}
                    <p className="desktop-landing-heroslogan">{t("slogan")}</p>
                </div>
            </div>
            {/* <div className="fullpage">
                <div className="centerdiv-top">
                    <p className="desktop-landing-title1">
                        {t("landingtitle1")}
                    </p>
                    <p className="desktop-landing-bodytext">
                        {t("landingbody1")}
                    </p>
                </div>
            </div> */}
            <footer className="desktop-landing-footer">
                <div>
                    <p>{t("socials")}</p>
                    <a href="https://www.instagram.com/sdhs_stormbot16423/">
                        <FaInstagram /> {t("ourinstagram")}
                    </a>
                    <a href="https://www.tiktok.com/@sdhstormbot16423?_r=1&_t=ZS-9AljGz3Uesp">
                        <FaTiktok /> {t("ourtiktok")}
                    </a>
                    <a href="https://discord.gg/xB7YX7yww2">
                        <FaDiscord /> {t("scoutmasterdiscord")}
                    </a>
                    <a href="https://storm16423.ca/">
                        <FaGlobe /> {t("ourwebsite")}
                    </a>
                </div>
                <div>
                    <p>{t("resources")}</p>
                    <a onClick={() => setShowPrivacy(true)}>
                        <FaGavel /> {t("privacypolicy")}
                    </a>
                    <a onClick={() => setShowTos(true)}>
                        <FaShieldAlt /> {t("tos")}
                    </a>
                </div>
            </footer>
        </>
    );
}

export default LandingPage;
