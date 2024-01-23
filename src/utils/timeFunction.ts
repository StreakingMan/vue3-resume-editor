export const easeInOut = (option: {
    start: number;
    end: number;
    duration?: number;
    callback?: (value: number) => void;
}) => {
    const { start, end, duration = 300, callback } = option;
    let startTime = 0;
    let endTime = 0;
    const easeInOut = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    const step = (timestamp: number): void => {
        if (!startTime) {
            startTime = timestamp;
        }
        if (!endTime) {
            endTime = startTime + duration;
        }
        const progress = Math.min(1, (timestamp - startTime) / duration);
        const _value = start + (end - start) * easeInOut(progress);
        callback?.(_value);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
};
