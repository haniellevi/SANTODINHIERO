/**
 * Formata uma data no padrão "Mês - Ano" com a primeira letra do mês em maiúscula
 * Exemplo: "Novembro - 2025"
 */
export function formatMonthYear(date: Date): string {
    const formatted = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
    }).format(date);

    // Capitaliza a primeira letra do mês
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    // Substitui " de " por " - "
    return capitalized.replace(" de ", " - ");
}



/**
 * Formata mês e ano a partir de números
 * @param month - Número do mês (1-12)
 * @param year - Ano (ex: 2025)
 */
export function formatMonthYearFromNumbers(month: number, year: number): string {
    // Usamos o dia 15 para evitar problemas de fuso horário (ex: dia 1 voltando para dia 30/31 do mês anterior)
    const date = new Date(year, month - 1, 15);
    return formatMonthYear(date);
}
