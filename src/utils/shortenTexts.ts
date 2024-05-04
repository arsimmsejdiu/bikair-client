export const shortenTexts = (text: any) => {
    const lastDigits = String(text).slice(-2);
    return `${Number(lastDigits)}`;
};
