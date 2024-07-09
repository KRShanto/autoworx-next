import moment from "moment";


export function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
}

export const formatTime = (rowTime: string = "") => {
    const [hour, period] = rowTime?.split(" ");
    const time = `${hour.padStart(2, "0")}:00 ${period}`;
    return moment(time, "hh:mm A").format("HH:mm");
}

export const updateTimeSpace = (startTime: string, endTime: string, rowTime: string) => {
  const start = moment(`2024-07-06T${startTime}:00`);
    const end = moment(`2024-07-06T${endTime}:00`);
    const diffMinutes = end.diff(start, "minutes");
    const newStartTime = formatTime(rowTime)
    const newEndTime = moment(`2024-07-06T${newStartTime}:00`).add(diffMinutes, 'minutes').format('HH:mm')
    return { newStartTime, newEndTime };
}