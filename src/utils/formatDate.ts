import { format } from "date-fns";

export const formatDateDot = (date: Date | string) => format(new Date(date), "yyyy. MM. dd.");
export const formatDateTime = (date: Date | string) => format(new Date(date), "yyyy. MM. dd. HH:mm")