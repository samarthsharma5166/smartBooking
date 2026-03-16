export function isWithinBookingWindow(
    appointmentDateTime,
    doctor
) {
    const now = new Date();

    const diffMinutes =
        (appointmentDateTime.getTime() - now.getTime()) / 60000;

    if (diffMinutes < doctor.minAdvanceMinutes) return false;

    const daysAhead =
        Math.floor(
            (appointmentDateTime.getTime() - startOfToday().getTime()) /
            86400000
        );

    if (daysAhead > doctor.maxAdvanceDays) return false;

    return true;
}
