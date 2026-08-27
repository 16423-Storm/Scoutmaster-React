import { useState, useMemo, type ChangeEvent, type FormEvent } from "react";
import { useScreenType } from "../scripts/multipageutils.js";
import { useTranslation } from "react-i18next";
import { signIn } from "../scripts/auth.js";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import type { UserData, SignUpFocus } from "../scripts/auth.js";
import { useGoToPage } from "../scripts/multipageutils.js";

import logobanner from "../images/branding/logowhitebanner.png";

function SignInPage() {
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!canSubmit) return;

        const result = await signIn(form);

        if (result === "Success") {
            goToDash();
        } else {
            console.error(result);
        }
    };

    const canSubmit = emailValid && passwordValid;

    const goToSignUp = useGoToPage("/signup");
    const goToDash = useGoToPage("/dashboard");
    const [showPassword, setShowPassword] = useState(false);

    if (screenType === "phone" || screenType === "tablet") {
        return (
            <div className="phone-signup-maincontainer">
                <img className="image85" src={logobanner} />
                <div className="phone-signup-infocontainer">
                    <p className="phone-signup-title">{t("signin")}</p>

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
                        <div className="phone-signup-password-input-wrapper">
                            <input
                                className={"phone-signup-input"}
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                name="password"
                                onChange={updateField("password")}
                            />

                            <button
                                type="button"
                                className="phone-signup-eye-icon"
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    setShowPassword((prev) => !prev);
                                }}
                            >
                                {showPassword ? (
                                    <IoMdEyeOff size={20} />
                                ) : (
                                    <IoMdEye size={20} />
                                )}
                            </button>
                        </div>
                        <button type="submit" className="phone-signup-button">
                            {t("signin")}
                        </button>

                        <a className="phone-signup-bottomtext">
                            {t("donthaveaccount")}{" "}
                            <span
                                className="phone-signup-bottomlink"
                                onClick={goToSignUp}
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
            </div>
        );
    }

    return (
        <div className="desktop-signup-maincontainer">
            <img className="image5" src={logobanner} />
            <div className="desktop-signup-infocontainer">
                <p className="desktop-signup-title">{t("signin")}</p>

                <form onSubmit={handleSubmit} className="desktop-signup-form">
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
                    <div className="desktop-signup-password-input-wrapper">
                        <input
                            className={"desktop-signup-input"}
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            name="password"
                            onChange={updateField("password")}
                        />

                        <button
                            type="button"
                            className="desktop-signup-eye-icon"
                            onPointerDown={(e) => {
                                e.preventDefault();
                                setShowPassword((prev) => !prev);
                            }}
                        >
                            {showPassword ? (
                                <IoMdEyeOff size={20} />
                            ) : (
                                <IoMdEye size={20} />
                            )}
                        </button>
                    </div>
                    <button type="submit" className="desktop-signup-button">
                        {t("signin")}
                    </button>

                    <a className="desktop-signup-bottomtext">
                        {t("donthaveaccount")}{" "}
                        <span
                            className="desktop-signup-bottomlink"
                            onClick={goToSignUp}
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
        </div>
    );
}

export default SignInPage;
