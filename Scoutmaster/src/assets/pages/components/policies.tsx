import {
    useScreenType,
    useIsAkwardHeight
} from "../../scripts/multipageutils";
import { Blocker499 } from "./blocker";
import { useTranslation } from "react-i18next";

export function PrivacyPolicy({onClose} : {onClose: () => void }) {
    const { t } = useTranslation();
    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div
                    className="desktop-warningpopup"
                    style={{
                        padding: "12px",
                        height:"75vh",
                        width: "60vw",
                        backgroundColor: "#be0000"
                    }}
                >
                    <p className="desktop-warningpopup-title" style={{color: "white"}}>Privacy Policy</p>
                    <div className="desktop-signup-policybody">
                        <h2>Test</h2>
                        <p>new</p>
                        <button className="desktop-signup-button" style={{height: "unset"}} onClick={onClose}>Return</button>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Blocker499 />
                {/* <div className="phone-warningpopup" style={{ padding: "12px" }}>
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
                </div> */}
            </>
        );
    }
}