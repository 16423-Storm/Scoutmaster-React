import { useTranslation } from "react-i18next";
import Flag from "../../../components/flag";
import { useScreenType } from "../../../../scripts/multipageutils";
import type { Team } from "../../../../scripts/localstorage";

import { useSections, useQuestions } from "../../../../scripts/localstorage";

export function TeamPage({ onBack, team }: { onBack: () => void; team: Team }) {
    const { t } = useTranslation();

    const sections = useSections((state) => state.sections);
    const questions = useQuestions((state) => state.questions);

    if (useScreenType() == "desktop") {
        return (
            <>
                <div className="desktop-dash-prescout-team-maincontainer">
                    <button
                        className="desktop-dash-prescout-team-backbutton"
                        onClick={onBack}
                    >
                        &lt; Back
                    </button>
                    <p className="desktop-dash-prescout-team-title">
                        16423 - Storm
                    </p>
                    <div className="desktop-dash-prescout-team-questioncontainer">
                        {Object.entries(sections)
                            .sort(([, a], [, b]) => a.index - b.index)
                            .map(([sectionId, section]) => (
                                <div key={sectionId}>
                                    {section.headersize === 1 && (
                                        <h1>{section.title}</h1>
                                    )}
                                    {section.headersize === 2 && (
                                        <h2>{section.title}</h2>
                                    )}
                                    {section.headersize === 3 && (
                                        <h3>{section.title}</h3>
                                    )}

                                    {section.questions.map((questionId) => {
                                        const question = questions[questionId];

                                        if (!question) return null;

                                        return (
                                            <div key={questionId}>
                                                <p>{question.title}:</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                    </div>
                </div>
            </>
        );
    } else {
        return <></>;
    }
}
