function Flag({
    code,
    imageClass = "",
}: {
    code: string;
    imageClass?: string;
}) {
    return (
        <img
            src={`/flags/${code}.svg`}
            className={imageClass}
            alt={`${code} - flag`}
        />
    );
}

export default Flag;
