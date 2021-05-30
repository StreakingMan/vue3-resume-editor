const STRING_POOL = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;

export const uniqueString = (length = 4): string => {
    let uniqueString = '';
    while (length > 0) {
        uniqueString += STRING_POOL[Math.floor(Math.random() * (STRING_POOL.length - 1))];
        length--;
    }
    return uniqueString;
};
