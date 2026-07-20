import {
    useScreenType,
    useIsAkwardHeight,
    useSpecifyCustomCountry,
} from "../../scripts/multipageutils";
import { Blocker499 } from "./blocker";
import { useTranslation } from "react-i18next";

type PropsOfWarningModal = {
    title: string;
    message: string;
    onContinue: () => void;
    onCancel: () => void;
};
/**
 * Confirms whether user wants to continue with action
 */
export function WarningModal({
    title,
    message,
    onContinue,
    onCancel,
}: PropsOfWarningModal) {
    const { t } = useTranslation();
    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    style={{ padding: "12px" }}
                >
                    <p className="desktop-warningpopup-title">{title}</p>
                    <p className="desktop-warningpopup-message">{message}</p>
                    <div>
                        <button
                            className="desktop-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={onContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                <div className="phone-warningpopup" style={{ padding: "12px" }}>
                    <p className="phone-warningpopup-title">{title}</p>
                    <p className="phone-warningpopup-message">{message}</p>
                    <div>
                        <button
                            className="phone-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="phone-warningpopup-continue"
                            onClick={onContinue}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

/**
 * Confirms whether user wants to continue with action
 */
export function WarningModal3Button({
    title,
    message,
    onMiddleMessage,
    onContinue,
    onMiddle,
    onCancel,
}: {
    title: string;
    message: string;
    onMiddleMessage: string;
    onContinue: () => void;
    onMiddle: () => void;
    onCancel: () => void;
}) {
    const { t } = useTranslation();
    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    style={{ padding: "12px" }}
                >
                    <p className="desktop-warningpopup-title">{title}</p>
                    <p className="desktop-warningpopup-message">{message}</p>
                    <div>
                        <button
                            className="desktop-warningpopup-cancel"
                            onClick={onCancel}
                            style={{ fontSize: "unset", width: "30%" }}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={onMiddle}
                            style={{ fontSize: "unset", width: "30%" }}
                        >
                            {onMiddleMessage}
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={onContinue}
                            style={{ fontSize: "unset", width: "30%" }}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                <div className="phone-warningpopup" style={{ padding: "12px" }}>
                    <p className="phone-warningpopup-title">{title}</p>
                    <p className="phone-warningpopup-message">{message}</p>
                    <div>
                        <button
                            className="phone-warningpopup-cancel"
                            onClick={onCancel}
                            style={{ fontSize: "unset", width: "30%" }}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className="phone-warningpopup-continue"
                            onClick={onMiddle}
                            style={{ fontSize: "unset", width: "30%" }}
                        >
                            {onMiddleMessage}
                        </button>
                        <button
                            className="phone-warningpopup-continue"
                            onClick={onContinue}
                            style={{ fontSize: "unset", width: "30%" }}
                        >
                            {t("continue")}
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
