export const calcCellingValue: (value: number, cellSize: number, ceil?: boolean) => number = (
    value,
    cellSize,
    ceil,
) => {
    const newValue = Math.round(value);
    const offset = newValue % cellSize;
    if (offset > cellSize / 2 || (offset && ceil)) {
        return newValue - offset + cellSize;
    } else {
        return newValue - offset;
    }
};
