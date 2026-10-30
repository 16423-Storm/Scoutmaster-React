import { useScreenType } from "../../scripts/multipageutils";
import { Blocker499 } from "./blocker";
import { useTranslation } from "react-i18next";

export function PrivacyPolicy({ onClose }: { onClose: () => void }) {
    const isDesktop = useScreenType() === "desktop";
    const { t } = useTranslation();

    const policyContent = (
        <>
            <section>
                <h2>{t("privacy.t1")}</h2>
                <p>{t("privacy.p1")}</p>
                <p>{t("privacy.p1/2")}</p>
            </section>

            <section>
                <h2>{t("privacy.t2")}</h2>
                <p>{t("privacy.p2")}</p>
                <p>{t("privacy.p2/2")}</p>
                <p>{t("privacy.p2/3")}</p>
            </section>

            <section>
                <h2>{t("privacy.t3")}</h2>
                <p>{t("privacy.p3")}</p>
                <ul>
                    <li>
                        <strong>{t("privacy.3/1")}</strong> {t("privacy.p3/1")}
                    </li>
                    <li>
                        <strong>{t("privacy.3/2")}</strong> {t("privacy.p3/2")}
                    </li>
                </ul>
                <p>{t("privacy.p3/3")}</p>
            </section>

            <section>
                <h2>{t("privacy.t4")}</h2>
                <p>{t("privacy.p4")}</p>
                <ul>
                    <li>{t("privacy.p4/1")}</li>
                    <li>{t("privacy.p4/2")}</li>
                    <li>{t("privacy.p4/3")}</li>
                    <li>{t("privacy.p4/4")}</li>
                </ul>
                <p>{t("privacy.p4/5")}</p>
            </section>

            <section>
                <h2>{t("privacy.t5")}</h2>
                <p>{t("privacy.p5")}</p>
                <p>{t("privacy.p5/2")}</p>
                <p>{t("privacy.p5/3")}</p>
                <ul>
                    <li>
                        <strong>Supabase:</strong> {t("privacy.p5/4")}
                    </li>
                    <li>
                        <strong>Render:</strong> {t("privacy.p5/5")}
                    </li>
                    <li>
                        <strong>Resend:</strong> {t("privacy.p5/6")}
                    </li>
                </ul>
                <p>{t("privacy.p5/7")}</p>
                <p>{t("privacy.p5/8")}</p>
            </section>

            <section>
                <h2>{t("privacy.t6")}</h2>
                <p>{t("privacy.p6")}</p>
                <p>{t("privacy.p6/2")}</p>
            </section>

            <section>
                <h2>{t("privacy.t7")}</h2>
                <p>{t("privacy.p7")}</p>
                <p>{t("privacy.p7/2")}</p>
                <p>{t("privacy.p7/3")}</p>
            </section>

            <section>
                <h2>{t("privacy.t8")}</h2>
                <p>{t("privacy.p8")}</p>
                <p>{t("privacy.p8/2")}</p>
                <p>{t("privacy.p8/3")}</p>
            </section>

            <section>
                <h2>{t("privacy.t9")}</h2>
                <p>{t("privacy.p9")}</p>
                <p>{t("privacy.p9/2")}</p>
            </section>

            <section>
                <h2>{t("privacy.t10")}</h2>
                <p>{t("privacy.p10")}</p>
                <p>{t("privacy.p10/2")}</p>
            </section>

            <section>
                <h2>{t("privacy.t11")}</h2>
                <p>{t("privacy.p11")}</p>
                <p>{t("privacy.p11/2")}</p>
                <p>{t("privacy.p11/3")}</p>
            </section>

            <section>
                <h2>{t("privacy.t12")}</h2>
                <p>{t("privacy.p12")}</p>
                <p>{t("privacy.p12/2")}</p>
            </section>

            <section>
                <h2>{t("privacy.t13")}</h2>
                <p>{t("privacy.p13")}</p>
            </section>

            <section>
                <h2>{t("privacy.t14")}</h2>
                <p>{t("privacy.p14")}</p>
                <p>
                    <strong>{t("privacy.p14/2")}</strong>{" "}
                    <a href="mailto:sdhs_stormbot16423@outlook.com">
                        sdhs_stormbot16423@outlook.com
                    </a>
                </p>
            </section>
        </>
    );

    return (
        <>
            <Blocker499 />

            <div
                className={
                    isDesktop ? "desktop-privacy-popup" : "phone-privacy-popup"
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="privacy-title"
                style={{
                    width: isDesktop ? "60vw" : "100%",
                    height: isDesktop ? "75vh" : "100%",
                    backgroundColor: "#be0000",
                }}
            >
                <header
                    className={
                        isDesktop
                            ? "desktop-privacy-header"
                            : "phone-privacy-header"
                    }
                    style={{ backgroundColor: "#be0000" }}
                >
                    <h1
                        id="privacy-title"
                        style={{
                            margin: 0,
                            color: "white",
                            fontSize: "1.8rem",
                            fontWeight: 600,
                        }}
                    >
                        {t("privacypolicy")}
                    </h1>

                    <p style={{ marginBottom: 0, color: "#eee" }}>
                        {t("privacy.effective")}
                    </p>

                    <p style={{ marginBottom: 0, color: "#eee" }}>
                        {t("privacy.learnhowscoutmasterhandles")}
                    </p>
                </header>

                <div
                    className={
                        isDesktop
                            ? "desktop-signup-policybody"
                            : "phone-signup-policybody"
                    }
                >
                    {policyContent}
                </div>

                <footer
                    className={
                        isDesktop
                            ? "desktop-privacy-footer"
                            : "phone-privacy-footer"
                    }
                >
                    <button
                        className={
                            isDesktop
                                ? "desktop-privacy-button"
                                : "phone-privacy-button"
                        }
                        onClick={onClose}
                        type="button"
                    >
                        {t("back")}
                    </button>
                </footer>
            </div>
        </>
    );
}

export function TOS({ onClose }: { onClose: () => void }) {
    const isDesktop = useScreenType() === "desktop";
    const { t } = useTranslation();

    const termsContent = (
        <>
            <section>
                <h2>{t("terms.t1")}</h2>
                <p>{t("terms.p1")}</p>
                <p>{t("terms.p1/2")}</p>
            </section>

            <section>
                <h2>{t("terms.t2")}</h2>
                <p>{t("terms.p2")}</p>
                <p>{t("terms.p2/2")}</p>
            </section>

            <section>
                <h2>{t("terms.t3")}</h2>
                <p>{t("terms.p3")}</p>
                <p>{t("terms.p3/2")}</p>
            </section>

            <section>
                <h2>{t("terms.t4")}</h2>
                <p>{t("terms.p4")}</p>
            </section>

            <section>
                <h2>{t("terms.t5")}</h2>
                <p>{t("terms.p5")}</p>
                <ul>
                    <li>{t("terms.p5/1")}</li>
                    <li>{t("terms.p5/2")}</li>
                    <li>{t("terms.p5/3")}</li>
                    <li>{t("terms.p5/4")}</li>
                    <li>{t("terms.p5/5")}</li>
                </ul>
            </section>

            <section>
                <h2>{t("terms.t6")}</h2>
                <p>{t("terms.p6")}</p>
                <p>{t("terms.p6/2")}</p>
                <p>{t("terms.p6/3")}</p>
                <p>{t("terms.p6/4")}</p>
            </section>

            <section>
                <h2>{t("terms.t7")}</h2>
                <p>{t("terms.p7")}</p>
                <p>{t("terms.p7/2")}</p>
            </section>

            <section>
                <h2>{t("terms.t8")}</h2>
                <p>{t("terms.p8")}</p>
                <p>{t("terms.p8/2")}</p>
            </section>

            <section>
                <h2>{t("terms.t9")}</h2>
                <p>{t("terms.p9")}</p>
                <p>{t("terms.p9/2")}</p>
                <p>{t("terms.p9/3")}</p>
            </section>

            <section>
                <h2>{t("terms.t10")}</h2>
                <p>{t("terms.p10")}</p>
                <p>{t("terms.p10/2")}</p>
                <p>{t("terms.p10/3")}</p>
            </section>

            <section>
                <h2>{t("terms.t11")}</h2>
                <p>{t("terms.p11")}</p>
                <p>{t("terms.p11/2")}</p>
            </section>

            <section>
                <h2>{t("terms.t12")}</h2>
                <p>{t("terms.p12")}</p>
                <p>{t("terms.p12/2")}</p>
                <p>{t("terms.p12/3")}</p>
            </section>

            <section>
                <h2>{t("terms.t13")}</h2>
                <p>{t("terms.p13")}</p>
            </section>

            <section>
                <h2>{t("terms.t14")}</h2>
                <p>{t("terms.p14")}</p>
                <p>{t("terms.p14/2")}</p>
            </section>

            <section>
                <h2>{t("terms.t15")}</h2>
                <p>{t("terms.p15")}</p>
                <p>{t("terms.p15/2")}</p>
            </section>

            <section>
                <h2>{t("terms.t16")}</h2>
                <p>{t("terms.p16")}</p>
                <p>
                    <strong>{t("terms.p16/2")}</strong>{" "}
                    <a href="mailto:sdhs_stormbot16423@outlook.com">
                        sdhs_stormbot16423@outlook.com
                    </a>
                </p>
                <p>{t("terms.p16/3")}</p>
            </section>
        </>
    );

    return (
        <>
            <Blocker499 />

            <div
                className={
                    isDesktop ? "desktop-privacy-popup" : "phone-privacy-popup"
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="tos-title"
                style={{
                    width: isDesktop ? "60vw" : "100%",
                    height: isDesktop ? "75vh" : "100%",
                    backgroundColor: "#be0000",
                }}
            >
                <header
                    className={
                        isDesktop
                            ? "desktop-privacy-header"
                            : "phone-privacy-header"
                    }
                    style={{ backgroundColor: "#be0000" }}
                >
                    <h1
                        id="tos-title"
                        style={{
                            margin: 0,
                            color: "white",
                            fontSize: "1.8rem",
                            fontWeight: 600,
                        }}
                    >
                        {t("tos")}
                    </h1>

                    <p style={{ marginBottom: 0, color: "#eee" }}>
                        {t("privacy.effective")}
                    </p>

                    <p style={{ marginBottom: 0, color: "#eee" }}>
                        {t("terms.description")}
                    </p>
                </header>

                <div
                    className={
                        isDesktop
                            ? "desktop-signup-policybody"
                            : "phone-signup-policybody"
                    }
                >
                    {termsContent}
                </div>

                <footer
                    className={
                        isDesktop
                            ? "desktop-privacy-footer"
                            : "phone-privacy-footer"
                    }
                >
                    <button
                        className={
                            isDesktop
                                ? "desktop-privacy-button"
                                : "phone-privacy-button"
                        }
                        onClick={onClose}
                        type="button"
                    >
                        {t("back")}
                    </button>
                </footer>
            </div>
        </>
    );
}
