export const downloadHref = (href: string, filename: string): void => {
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    eleLink.href = href;
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
};

export const downloadJSON = (data: Record<any, any>, filename: string): void => {
    const blob = new Blob([JSON.stringify(data, null, 4)]);
    const objURL = URL.createObjectURL(blob);
    downloadHref(objURL, filename);
    URL.revokeObjectURL(objURL);
};
