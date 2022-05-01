export const stringArrayDiff: (
    beforeArray: string[],
    afterArray: string[]
) => { added: string[]; removed: string[] } = (beforeArray, afterArray) => {
    // 暴力，复杂度 n^2
    const _beforeArray = [...new Set(beforeArray.slice())];
    const _afterArray = [...new Set(afterArray.slice())];
    const removed = [];
    for (const item of _beforeArray) {
        let idx = 0;
        let isRemoved = true;
        while (idx < _afterArray.length) {
            if (_afterArray[idx] === item) {
                isRemoved = false;
                break;
            }
            idx++;
        }
        if (isRemoved) {
            removed.push(item);
        } else {
            _afterArray.splice(idx, 1);
        }
    }
    return { added: _afterArray, removed };
};
