import { useScreenType } from "../../scripts/multipageutils";

/**
 * @param {string} color1 first color
 * @param {string} color2 second color
 * @param {string} color3 third color
 * @param {string} tooltip1 text for hover tooltip for first segment
 * @param {string} tooltip2 text for hover tooltip for second segment
 * @param {string} tooltip3 text for hover tooltip for third segment
 * @param {number[]} percents the percents of each segments, NOTE: MUST ADD TO 100
 */
export function Progress3({
    color1,
    color2,
    color3,
    percents,
}: {
    color1: string;
    color2: string;
    color3: string;
    percents: number[];
}) {
    if (useScreenType() == "desktop") {
        return (
            <div className="progressbar-maincontainer">
                <div
                    className="progressbar-progress"
                    style={{
                        width: `${percents[0]}%`,
                        backgroundColor: color1,
                    }}
                ></div>
                <div
                    className="progressbar-progress"
                    style={{
                        width: `${percents[1]}%`,
                        backgroundColor: color2,
                    }}
                ></div>
                <div
                    className="progressbar-progress"
                    style={{
                        width: `${percents[2]}%`,
                        backgroundColor: color3,
                    }}
                ></div>
            </div>
        );
    } else {
        return (
            <div className="progressbar-maincontainer">
                <div
                    className="progressbar-progress"
                    style={{
                        width: `${percents[0]}%`,
                        backgroundColor: color1,
                    }}
                ></div>
                <div
                    className="progressbar-progress"
                    style={{
                        width: `${percents[1]}%`,
                        backgroundColor: color2,
                    }}
                ></div>
                <div
                    className="progressbar-progress"
                    style={{
                        width: `${percents[2]}%`,
                        backgroundColor: color3,
                    }}
                ></div>
            </div>
        );
    }
}
