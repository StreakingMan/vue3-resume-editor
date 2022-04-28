import { Item } from '../interface/Item';

export const calcSelectedItem = (rect: number[][], items: Item[]): Item[] => {
    const [[x1, y1], [x2, y2]] = rect;
    return items.filter(({ x, y, w = 100, h = 100 }) => {
        // 块与选区有交集视为选中
        // 两矩形不重叠情况取反即为交集
        return !(y + h <= y1 || y >= y2 || x + w <= x1 || x >= x2);
    });
};

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

// 计算矩形中心旋转后的位置信息
export const centerRotateRect: (rect: Rect) => Rect = ({ x, y, w, h }) => {
    const [centerX, centerY] = [x + w / 2, y + h / 2];
    return { x: centerX - h / 2, y: centerY - w / 2, w: h, h: w };
};
