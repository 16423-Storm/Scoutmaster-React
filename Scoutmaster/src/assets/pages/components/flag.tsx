function Flag({
    code,
    imageClass = "",
}: {
    code: string | undefined;
    imageClass?: string;
}) {
    if (code) {
        return (
            <img
                src={`/flags/${code}.svg`}
                className={imageClass}
                alt={`${code} - flag`}
            />
        );
    } else {
        return <></>;
    }
}

export default Flag;
