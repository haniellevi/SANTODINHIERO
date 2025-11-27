import { getAdminMetrics, getExpenseCategoryDistribution, getRecentFeedbacks } from "@/lib/queries/admin";
import { ExpenseDistributionChart } from "@/components/admin/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/finance-utils";
import { Users, DollarSign, TrendingUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
    const metrics = await getAdminMetrics();
    const distribution = await getExpenseCategoryDistribution();
    const feedbacks = await getRecentFeedbacks();

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
                <Badge variant="outline" className="text-sm py-1 px-3 border-yellow-500 text-yellow-600 bg-yellow-50">
                    Super Admin
                </Badge>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.users.total}</div>
                        <p className="text-xs text-muted-foreground">
                            +{metrics.users.newThisMonth} novos este mês
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume Total (TTV)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(metrics.finance.ttv)}</div>
                        <p className="text-xs text-muted-foreground">
                            Todas as receitas registradas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume de Dízimos</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(metrics.finance.titheVolume)}</div>
                        <p className="text-xs text-muted-foreground">
                            Total pago em dízimos
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Feedbacks</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{feedbacks.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Recentes
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <div className="col-span-4">
                    <ExpenseDistributionChart data={distribution} />
                </div>

                {/* Recent Feedbacks */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Feedbacks Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {feedbacks.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Nenhum feedback recente.</p>
                            ) : (
                                feedbacks.map((feedback) => (
                                    <div key={feedback.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {feedback.user.name || feedback.user.email}
                                            </p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {feedback.message}
                                            </p>
                                            <div className="flex gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px]">{feedback.type}</Badge>
                                                <Badge variant="outline" className="text-[10px]">{feedback.status}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
