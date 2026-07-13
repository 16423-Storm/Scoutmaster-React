import { useScreenType } from "../../../../scripts/multipageutils";
import { useTranslation } from "react-i18next";

import { useSortable } from "@dnd-kit/react/sortable";

export function CompetitionQuestion({
    id,
    index,
    text,
}: {
    id: number;
    index: number;
    text: string;
}) {
    const { ref } = useSortable({ id, index });
    if (useScreenType() == "desktop") {
        return (
            <li ref={ref} className="item">
                {text}
            </li>
        );
    } else {
        return <></>;
    }
}
