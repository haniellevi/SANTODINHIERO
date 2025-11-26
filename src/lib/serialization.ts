import { Decimal } from "@prisma/client/runtime/library";

/**
 * Serializa dados do Prisma para objetos JavaScript simples
 * Converte Decimal para number e Date para string ISO
 */
export function serializeForClient<T>(data: T): any {
    if (data === null || data === undefined) {
        return data;
    }

    // Converter Decimal para number
    if (data instanceof Decimal) {
        return data.toNumber();
    }

    // Converter Date para string ISO
    if (data instanceof Date) {
        return data.toISOString();
    }

    // Processar arrays
    if (Array.isArray(data)) {
        return data.map(item => serializeForClient(item));
    }

    // Processar objetos (mas não classes especiais)
    if (typeof data === "object" && data.constructor === Object) {
        const serialized: Record<string, any> = {};
        for (const [key, value] of Object.entries(data)) {
            serialized[key] = serializeForClient(value);
        }
        return serialized;
    }

    // Para outros objetos complexos, tentar converter para objeto simples
    if (typeof data === "object") {
        try {
            const serialized: Record<string, any> = {};
            for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
                serialized[key] = serializeForClient(value);
            }
            return serialized;
        } catch {
            // Se falhar, retornar como está
            return data;
        }
    }

    // Retornar tipos primitivos inalterados
    return data;
}

