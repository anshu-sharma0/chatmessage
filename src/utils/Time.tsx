function formatTime(inputTime: string): string {
    const inputDate: Date = new Date(inputTime);
    const now: Date = new Date();

    const isSameDay = (d1: Date, d2: Date): boolean =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const isYesterday = (d1: Date, d2: Date): boolean => {
        const yesterday: Date = new Date(d2);
        yesterday.setDate(d2.getDate() - 1);
        return isSameDay(d1, yesterday);
    };

    const formatTimeOnly = (date: Date): string =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formatDateWithoutYear = (date: Date): string =>
        date.toLocaleDateString([], {
            month: 'long',
            day: 'numeric'
        });

    const diffSeconds: number = Math.floor((now.getTime() - inputDate.getTime()) / 1000);
    if (diffSeconds < 60) {
        return "just now";
    }

    if (isSameDay(inputDate, now)) {
        return `${formatTimeOnly(inputDate)}`;
    }

    if (isYesterday(inputDate, now)) {
        return `yesterday at ${formatTimeOnly(inputDate)}`;
    }

    return `${formatDateWithoutYear(inputDate)} at ${formatTimeOnly(inputDate)}`;
}

export { formatTime }