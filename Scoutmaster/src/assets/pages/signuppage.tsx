import { useState, useMemo, type ChangeEvent, type FormEvent } from "react";
import { useScreenType } from "../scripts/multipageutils";
import { useTranslation } from "react-i18next";
import { signUp } from "../scripts/auth.js";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";

import type { SignUpData, SignUpFocus } from "../scripts/auth.js";

import logobanner from "../images/branding/logowhitebanner.png";

function SignUpPage() {
    const { t } = useTranslation();
    const screenType = useScreenType();

    const [form, setForm] = useState<SignUpData>({
        email: "",
        password: "",
    });

    const [focus, setFocus] = useState<SignUpFocus>({
        email: false,
        password: false,
    });

    const updateField =
        (field: keyof SignUpData) => (e: ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;
        signUp(form);
    };

    const canSubmit = emailValid && passwordValid;
    if (screenType === "phone") {
        return (
            <div className="phone-signup-maincontainer">
                <img className="image85" src={logobanner} />
                <div className="phone-signup-infocontainer">
                    <p className="phone-signup-title">{t("signup")}</p>

                    <form onSubmit={handleSubmit} className="phone-signup-form">
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
                        <button
                            type="submit"
                            className="phone-signup-button"
                            disabled={!canSubmit}
                        >
                            {t("signup")}
                        </button>

                        <a className="phone-signup-bottomtext">
                            {t("alreadyhaveaccount")}{" "}
                            <span className="phone-signup-bottomlink">
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
            </div>
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

export default SignUpPage;
