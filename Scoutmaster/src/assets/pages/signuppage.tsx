import { useState, useMemo, type ChangeEvent, type FormEvent } from "react";
import { useScreenType } from "../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { signUp } from "../scripts/auth.js";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";

import type { UserData, SignUpFocus } from "../scripts/auth.js";
import { useGoToPage } from "../scripts/multipageutils";

import logobanner from "../images/branding/logowhitebanner.png";

import { MoonLoader } from "react-spinners";

function SignUpPage() {
    const { t } = useTranslation();
    const screenType = useScreenType();

    const [form, setForm] = useState<UserData>({
        email: "",
        password: "",
    });

    const [focus, setFocus] = useState<SignUpFocus>({
        email: false,
        password: false,
    });

    const updateField =
        (field: keyof UserData) => (e: ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const hasRules = useMemo(() => {
        const p = form.password;
        return {
            length: p.length >= 8,
            upper: /[A-Z]/.test(p),
            lower: /[a-z]/.test(p),
            number: /\d/.test(p),
            symbol: /[^A-Za-z0-9]/.test(p),
        };
    }, [form.password]);

    const emailValid = useMemo(() => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    }, [form.email]);

    const passwordValid = useMemo(() => {
        return Object.values(hasRules).every(Boolean);
    }, [hasRules]);

    const showPasswordRules = focus.password || form.password.length > 0;

    const inputClass = (valid: boolean) => (valid ? "valid" : "invalid");

    const [successSignUp, setSuccessSignUp] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [currentError, setCurrentError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;

        setSpinner(true);

        const result = await signUp(form);

        if (result == "Success") {
            setSuccessSignUp(true);
            setSpinner(false);
            setCurrentError("");
        } else if (result == "Error") {
            setSpinner(false);
            setCurrentError("other_error");
        }
    };

    const canSubmit = emailValid && passwordValid;

    const goToSignIn = useGoToPage("/signin");

    if (screenType === "phone" || screenType === "tablet") {
        return (
            <div className="phone-signup-maincontainer">
                <img className="image85" src={logobanner} />
                {successSignUp ? (
                    <></>
                ) : (
                    <div className="phone-signup-infocontainer">
                        <p className="phone-signup-title">{t("signup")}</p>

                        <form
                            onSubmit={handleSubmit}
                            className="phone-signup-form"
                        >
                            <p className="phone-signup-text">
                                <MdOutlineEmail className="phone-signup-input-icon" />{" "}
                                {t("emailwithcolon")}
                            </p>
                            <input
                                className={`phone-signup-input ${form.email.length > 0 && !emailValid ? "invalid" : ""}`}
                                value={form.email}
                                name="email"
                                onChange={updateField("email")}
                                autoFocus
                            />

                            <p className="phone-signup-text">
                                <MdOutlineLock className="phone-signup-input-icon" />{" "}
                                {t("passwordwithcolon")}
                            </p>
                            <input
                                className={`phone-signup-input ${
                                    form.password.length > 0 && !passwordValid
                                        ? "invalid"
                                        : ""
                                }`}
                                type="password"
                                value={form.password}
                                name="password"
                                onChange={updateField("password")}
                            />

                            <p
                                className={`phone-signup-text-hidden ${
                                    showPasswordRules ? "show" : ""
                                }`}
                            >
                                {t("mustinclude")}
                            </p>

                            <ul
                                className={`phone-signup-passwordlist ${
                                    showPasswordRules ? "show" : ""
                                }`}
                            >
                                <li className={inputClass(hasRules.length)}>
                                    {t("passwordrequirement1")}
                                </li>
                                <li className={inputClass(hasRules.upper)}>
                                    {t("passwordrequirement2")}
                                </li>
                                <li className={inputClass(hasRules.lower)}>
                                    {t("passwordrequirement3")}
                                </li>
                                <li className={inputClass(hasRules.number)}>
                                    {t("passwordrequirement4")}
                                </li>
                                <li className={inputClass(hasRules.symbol)}>
                                    {t("passwordrequirement5")}
                                </li>
                            </ul>

                            {currentError !== "" && <p>{t(currentError)}</p>}

                            <button
                                type="submit"
                                className="phone-signup-button"
                                disabled={!canSubmit || spinner}
                            >
                                {spinner ? (
                                    <MoonLoader size={30} />
                                ) : (
                                    t("signup")
                                )}
                            </button>

                            <a className="phone-signup-bottomtext">
                                {t("alreadyhaveaccount")}{" "}
                                <span
                                    className="phone-signup-bottomlink"
                                    onClick={goToSignIn}
                                >
                                    {t("clickhere")}
                                </span>
                            </a>

                            <p className="phone-signup-bottomtext">
                                {t("bysigningupyouagree")}{" "}
                                <span className="phone-signup-bottomlink">
                                    {t("privacypolicylowercase")}
                                </span>
                            </p>
                        </form>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="desktop-signup-maincontainer">
            <img className="image35" src={logobanner} />
            {successSignUp ? (
                <div className="desktop-signup-infocontainer">Success</div>
            ) : (
                <div className="desktop-signup-infocontainer">
                    <p className="desktop-signup-title">{t("signup")}</p>

                    <form
                        onSubmit={handleSubmit}
                        className="desktop-signup-form"
                    >
                        <p className="desktop-signup-text">
                            <MdOutlineEmail className="desktop-signup-input-icon" />{" "}
                            {t("emailwithcolon")}
                        </p>
                        <input
                            className={`desktop-signup-input ${form.email.length > 0 && !emailValid ? "invalid" : ""}`}
                            value={form.email}
                            name="email"
                            onChange={updateField("email")}
                            autoFocus
                        />

                        <p className="desktop-signup-text">
                            <MdOutlineLock className="desktop-signup-input-icon" />{" "}
                            {t("passwordwithcolon")}
                        </p>
                        <input
                            className={`desktop-signup-input ${
                                form.password.length > 0 && !passwordValid
                                    ? "invalid"
                                    : ""
                            }`}
                            type="password"
                            value={form.password}
                            name="password"
                            onChange={updateField("password")}
                        />

                        <p
                            className={`desktop-signup-text-hidden ${
                                showPasswordRules ? "show" : ""
                            }`}
                        >
                            {t("mustinclude")}
                        </p>

                        <ul
                            className={`desktop-signup-passwordlist ${
                                showPasswordRules ? "show" : ""
                            }`}
                        >
                            <li className={inputClass(hasRules.length)}>
                                {t("passwordrequirement1")}
                            </li>
                            <li className={inputClass(hasRules.upper)}>
                                {t("passwordrequirement2")}
                            </li>
                            <li className={inputClass(hasRules.lower)}>
                                {t("passwordrequirement3")}
                            </li>
                            <li className={inputClass(hasRules.number)}>
                                {t("passwordrequirement4")}
                            </li>
                            <li className={inputClass(hasRules.symbol)}>
                                {t("passwordrequirement5")}
                            </li>
                        </ul>

                        {currentError !== "" && <p>{t(currentError)}</p>}

                        <button
                            type="submit"
                            className="desktop-signup-button"
                            disabled={!canSubmit || spinner}
                        >
                            {spinner ? <MoonLoader size={30} /> : t("signup")}
                        </button>

                        <a className="desktop-signup-bottomtext">
                            {t("alreadyhaveaccount")}{" "}
                            <span
                                className="desktop-signup-bottomlink"
                                onClick={goToSignIn}
                            >
                                {t("clickhere")}
                            </span>
                        </a>

                        <p className="desktop-signup-bottomtext">
                            {t("bysigningupyouagree")}{" "}
                            <span className="desktop-signup-bottomlink">
                                {t("privacypolicylowercase")}
                            </span>
                        </p>
                    </form>
                </div>
            )}
        </div>
    );
}

export default SignUpPage;
