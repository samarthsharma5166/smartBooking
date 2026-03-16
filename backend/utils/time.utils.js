export const DAY_START = 7 * 60;   // 07:00
export const DAY_END = 23 * 60;  // 11:00

export function generateSlots(slotSize) {
    const slots = [];
    for (let t = DAY_START; t + slotSize <= DAY_END; t += slotSize) {
        slots.push({ start: t, end: t + slotSize });
    }
    return slots;
}

export function overlaps(a, b) {
    return a.start < b.end && b.start < a.end;
}


export function combine(date, minutes) {
    const d = new Date(date)
    d.setHours(0, minutes, 0, 0)
    return d
}

export function startOfToday() {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}
