import { useScreenType } from "../../scripts/multipageutils";
import { Blocker499 } from "./blocker";

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
    if (useScreenType() == "desktop") {
        return (
            <>
                <Blocker499 />
                <div className="desktop-warningpopup">
                    <p className="desktop-warningpopup-title">{title}</p>
                    <p className="desktop-warningpopup-message">{message}</p>
                    <div>
                        <button
                            className="desktop-warningpopup-cancel"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="desktop-warningpopup-continue"
                            onClick={onContinue}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
}
