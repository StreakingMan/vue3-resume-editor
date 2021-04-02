import { Item } from '../interface/Item';
import _ from 'lodash';

export const sortByGroup = (items: Item[]): Item[] => {
    const res: Item[] = [];
    const pool = items.slice();

    do {
        const item = pool.shift();
        if (!item) break;

        // 查找相同分组，于最后一个后插入
        const findLastSameGroupItemIndex = _.findLastIndex(
            res,
            (r) => r.groupName === item.groupName
        );
        if (findLastSameGroupItemIndex !== -1) {
            res.splice(findLastSameGroupItemIndex + 1, 0, item);
            continue;
        }

        // 查找父分组，于第一个父分组前插入
        const findFirstParentGroupItemIndex = res.findIndex((r) =>
            item.groupName.startsWith(r.groupName)
        );
        if (findFirstParentGroupItemIndex !== -1) {
            res.splice(findFirstParentGroupItemIndex, 0, item);
            continue;
        }

        // 查找子分组，于最后一个子分组后插入
        const findLastChildGroupItemIndex = _.findLastIndex(res, (r) =>
            r.groupName.startsWith(item.groupName)
        );
        if (findLastChildGroupItemIndex !== -1) {
            res.splice(findLastChildGroupItemIndex + 1, 0, item);
            continue;
        }

        res.push(item);
    } while (pool.length > 0);

    return res;
};

// 根据两个连续元素的分组名之间的差异获取虚拟分组
// 简单说就是返回后者相异于前者的分组
// root.A.B,root.A.C -> C
// root.A.B,root.C.D -> C,D
export const getGroupsByGroupNameDiff = (
    preGroupName: string,
    curGroupName: string
): string[] => {
    if (preGroupName === curGroupName) return [];
    if (preGroupName.startsWith(curGroupName)) return [];

    const preGroups = preGroupName.split('.');
    const curGroups = curGroupName.split('.');

    const findFistDiffIndex = curGroups.findIndex((g, i) => g !== preGroups[i]);
    return curGroups.slice(findFistDiffIndex, curGroups.length);
};
