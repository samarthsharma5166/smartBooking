const startStr = "2026-03-18T21:00:00+05:30";

const startDate = new Date(startStr);
const istStart = new Date(startDate.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));

console.log("Offset String:", startStr);
console.log("Date obj:", startDate);
console.log("toLocaleString:", startDate.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
console.log("Re-parsed obj:", istStart);
console.log("getHours():", istStart.getHours());
