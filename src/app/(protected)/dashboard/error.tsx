'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Dashboard Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-destructive/50">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                        <AlertCircle className="h-6 w-6" />
                        <CardTitle>Algo deu errado</CardTitle>
                    </div>
                    <CardDescription>
                        Encontramos um erro ao carregar seu dashboard.
                        {error.digest && <span className="block mt-1 text-xs text-muted-foreground">Código do erro: {error.digest}</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Tente recarregar a página. Se o problema persistir, entre em contato com o suporte.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Recarregar Página
                    </Button>
                    <Button onClick={() => reset()}>
                        Tentar Novamente
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
