/**
 * Utilities for month-related date calculations and business logic
 */

/**
 * Get the number of days until the end of a specific month
 */
export function getDaysUntilEndOfMonth(year: number, month: number): number {
    const now = new Date();
    const endOfMonth = new Date(year, month, 0); // Day 0 = last day of previous month, so month here is the actual month
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(endOfMonth.getFullYear(), endOfMonth.getMonth(), endOfMonth.getDate());

    const diffTime = endOfDay.getTime() - startOfDay.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Check if a month is in the past (before current month)
 */
export function isMonthInPast(year: number, month: number): boolean {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

    if (year < currentYear) return true;
    if (year === currentYear && month < currentMonth) return true;

    return false;
}

/**
 * Check if we should show the "plan next month" alert (10 days before end of month)
 */
export function shouldShowPlanNextMonthAlert(year: number, month: number): boolean {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Only show for current month
    if (year !== currentYear || month !== currentMonth) return false;

    const daysRemaining = getDaysUntilEndOfMonth(year, month);
    return daysRemaining <= 10 && daysRemaining > 0;
}

/**
 * Check if we should show the "review month" alert (3 days before end of month)
 */
export function shouldShowReviewMonthAlert(year: number, month: number): boolean {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Only show for current month
    if (year !== currentYear || month !== currentMonth) return false;

    const daysRemaining = getDaysUntilEndOfMonth(year, month);
    return daysRemaining <= 3 && daysRemaining > 0;
}

/**
 * Get the next month and year
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
    if (month === 12) {
        return { year: year + 1, month: 1 };
    }
    return { year, month: month + 1 };
}

/**
 * Format month name in Portuguese
 */
export function getMonthName(month: number): string {
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return monthNames[month - 1] || "";
}
