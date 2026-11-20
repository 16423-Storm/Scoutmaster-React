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

// Contributor Logo Imports
import StormLogo from "../images/contributors/storm.png";
import AsteriaLogo from "../images/contributors/asteria.jpg";
import BruteForceLogo from "../images/contributors/bruteforce.png";

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
                <div
                    className="phone-landing-footer fullpage"
                    style={{
                        alignItems: "center",
                        paddingBottom: "50px",
                        height: "unset",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            width: "90%",
                        }}
                    >
                        <p
                            className="phone-landing-herotitle"
                            style={{ fontSize: "3.6rem" }}
                        >
                            Contributors
                        </p>
                        <p
                            className="phone-landing-heroslogan"
                            style={{ paddingTop: "3px" }}
                        >
                            Scoutmaster would not be possible without the
                            amazing FTC teams that have contributed to it!
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <p
                                className="phone-landing-herotitle"
                                style={{ fontSize: "1.6rem" }}
                            >
                                Founders
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    gap: "8px",
                                }}
                            >
                                <img
                                    src={StormLogo}
                                    className="phone-landing-contributorlogo"
                                />
                                <p style={{ color: "white" }}>#16423 STORM</p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <p
                                className="phone-landing-herotitle"
                                style={{ fontSize: "1.6rem" }}
                            >
                                Localization
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <img
                                        src={AsteriaLogo}
                                        className="phone-landing-contributorlogo"
                                    />
                                    <p style={{ color: "white" }}>
                                        #32334 ASTERIA
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        gap: "8px",
                                    }}
                                >
                                    <img
                                        src={BruteForceLogo}
                                        className="phone-landing-contributorlogo"
                                    />
                                    <p style={{ color: "white" }}>
                                        #22941 BRUTE FORCE
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            <div
                className="desktop-landing-footer fullpage"
                style={{
                    alignItems: "center",
                    paddingBottom: "50px",
                    height: "unset",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        width: "90%",
                    }}
                >
                    <p
                        className="desktop-landing-herotitle"
                        style={{ fontSize: "3.6rem" }}
                    >
                        Contributors
                    </p>
                    <p
                        className="desktop-landing-heroslogan"
                        style={{ paddingTop: "3px" }}
                    >
                        Scoutmaster would not be possible without the amazing
                        FTC teams that have contributed to it!
                    </p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <p
                            className="desktop-landing-herotitle"
                            style={{ fontSize: "1.6rem" }}
                        >
                            Founders
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <img
                                src={StormLogo}
                                className="desktop-landing-contributorlogo"
                            />
                            <p style={{ color: "white" }}>#16423 STORM</p>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <p
                            className="desktop-landing-herotitle"
                            style={{ fontSize: "1.6rem" }}
                        >
                            Localization
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: "20px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    gap: "8px",
                                }}
                            >
                                <img
                                    src={AsteriaLogo}
                                    className="desktop-landing-contributorlogo"
                                />
                                <p style={{ color: "white" }}>#32334 ASTERIA</p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    gap: "8px",
                                }}
                            >
                                <img
                                    src={BruteForceLogo}
                                    className="desktop-landing-contributorlogo"
                                />
                                <p style={{ color: "white" }}>
                                    #22941 BRUTE FORCE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
