
export default function daysBetweenDates(d1: Date, d2: Date) {
    const timediff = d2.getTime() - d1.getTime();
    return Math.ceil(timediff / (1000 * 3600 * 24));
}
