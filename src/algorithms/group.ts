import { Item } from '../interface/Item';

export const sortByGroup = (items: Item[]): Item[] => {
    const res: Item[] = [];
    const pool = items.slice();

    do {
        const item = pool.shift();
        if (!item) break;
        const findLastSameGroupItemIndex =
            res.length -
            1 -
            res
                .slice()
                .reverse()
                .findIndex((r) => r.groupName === item.groupName);
        if (findLastSameGroupItemIndex < res.length - 1) {
            res.splice(findLastSameGroupItemIndex + 1, 0, item);
            continue;
        }
        const findFirstParentGroupItemIndex = res.findIndex((r) =>
            item.groupName.startsWith(r.groupName)
        );
        if (findFirstParentGroupItemIndex !== -1) {
            res.splice(findFirstParentGroupItemIndex, 0, item);
            continue;
        }
        res.push(item);
    } while (pool.length > 0);

    return res;
};
