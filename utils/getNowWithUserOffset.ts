
export default function getNowUserOffset(offset?: number) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - (offset !== undefined ? offset : 0));
    return now;
}
