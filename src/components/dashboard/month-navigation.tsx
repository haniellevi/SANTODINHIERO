import { getUserMonths } from "@/lib/queries/finance";
import { MonthNavigationHeader } from "./month-navigation-header";

interface MonthNavigationProps {
    userId: string;
    currentMonth: number;
    currentYear: number;
}

export async function MonthNavigation({
    userId,
    currentMonth,
    currentYear,
}: MonthNavigationProps) {
    const availableMonths = await getUserMonths(userId);

    const hasPrevMonth = availableMonths.some(m => {
        const mDate = new Date(m.year, m.month - 1);
        const cDate = new Date(currentYear, currentMonth - 1);
        return mDate < cDate;
    });

    const hasNextMonth = availableMonths.some(m => {
        const mDate = new Date(m.year, m.month - 1);
        const cDate = new Date(currentYear, currentMonth - 1);
        return mDate > cDate;
    });

    const currentDate = new Date(currentYear, currentMonth - 1);

    return (
        <MonthNavigationHeader
            currentDate={currentDate}
            hasPrevMonth={hasPrevMonth}
            hasNextMonth={hasNextMonth}
            availableMonths={availableMonths}
        />
    );
}
