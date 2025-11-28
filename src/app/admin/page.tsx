"use client";

import { Card } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Activity
} from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import dynamic from "next/dynamic";

const AdminCharts = dynamic(() => import('@/components/admin/charts'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>,
});

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <p className="text-sm text-destructive mt-1">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Painel do Administrador</h1>
          <p className="text-muted-foreground mt-2">Visão geral do sistema e análises</p>
        </div>
        <div />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total de Usuários</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats?.totalUsers || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+12%</span>
            <span className="text-muted-foreground ml-2">do último mês</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Usuários Ativos</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats?.activeUsers || 0}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+8%</span>
            <span className="text-muted-foreground ml-2">da última semana</span>
          </div>
        </Card>
      </div>

      {/* BI Metrics - New Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Novos Usuários (Mês)</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats?.newUsersThisMonth || 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Volume Total (TTV)</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats?.totalTTV ? `R$ ${stats.totalTTV.toFixed(2)}` : 'R$ 0,00'}
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">Todas as receitas registradas</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Volume de Dízimos</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats?.totalTitheVolume ? `R$ ${stats.totalTitheVolume.toFixed(2)}` : 'R$ 0,00'}
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M6 3h12l4 6-10 13L2 9Z" /><path d="M11 3 8 9l4 13 4-13-3-6Z" /></svg>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">Total pago em dízimos</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Feedbacks Recentes</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats?.recentFeedbacks?.length || 0}
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
        </Card>
      </div>

      {/* Charts Row - Business Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">MRR</h2>
              <p className="text-sm text-muted-foreground">Receita Recorrente Mensal</p>
            </div>
            {stats?.mrrSeries && <DeltaBadge series={stats.mrrSeries} goodWhenPositive />}
          </div>
          {stats?.mrrSeries && <AdminCharts.MrrBarChart data={stats.mrrSeries} />}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">ARR</h2>
              <p className="text-sm text-muted-foreground">Receita Recorrente Anual</p>
            </div>
            {stats?.arrSeries && <DeltaBadge series={stats.arrSeries} goodWhenPositive />}
          </div>
          {stats?.arrSeries && <AdminCharts.ArrBarChart data={stats.arrSeries} />}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Churn</h2>
              <p className="text-sm text-muted-foreground">Taxa de cancelamento de clientes</p>
            </div>
            {stats?.churnSeries && <DeltaBadge series={stats.churnSeries} goodWhenPositive={false} suffix="%" />}
          </div>
          {stats?.churnSeries && <AdminCharts.ChurnLineChart data={stats.churnSeries} />}
        </Card>
      </div>

      {/* BI Charts & Feedbacks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Expense Distribution Chart */}
        <div className="col-span-4">
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Distribuição de Despesas</h2>
              <p className="text-sm text-muted-foreground">Por tipo de despesa</p>
            </div>
            {stats?.expenseDistribution && stats.expenseDistribution.length > 0 ? (
              <div className="h-[300px]">
                <AdminCharts.ExpenseDistributionPieChart data={stats.expenseDistribution} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma despesa registrada</p>
            )}
          </Card>
        </div>

        {/* Recent Feedbacks */}
        <Card className="col-span-3 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground">Feedbacks Recentes</h2>
          </div>
          <div className="space-y-4">
            {stats?.recentFeedbacks && stats.recentFeedbacks.length > 0 ? (
              stats.recentFeedbacks.map((feedback) => (
                <div key={feedback.id} className="border-b border-border pb-3 last:border-0">
                  <p className="text-sm font-medium">{feedback.user.name || feedback.user.email}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{feedback.message}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium border-muted bg-muted/50 text-foreground/60">
                      {feedback.type}
                    </span>
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium border-muted bg-muted/50 text-foreground/60">
                      {feedback.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum feedback recente</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DeltaBadge({ series, goodWhenPositive = true, suffix = "" }: { series: { label: string; value: number }[]; goodWhenPositive?: boolean; suffix?: string }) {
  if (!series || series.length < 2) return null
  const last = series[series.length - 1].value
  const prev = series[series.length - 2].value
  const deltaRaw = last - prev
  const deltaPct = prev === 0 ? (last > 0 ? 100 : 0) : (deltaRaw / prev) * 100
  const isGood = goodWhenPositive ? deltaPct > 0 : deltaPct < 0
  const isBad = goodWhenPositive ? deltaPct < 0 : deltaPct > 0
  const color = isGood ? "emerald" : isBad ? "red" : "zinc"
  const sign = deltaPct > 0 ? "+" : ""

  return (
    <span
      className={
        `inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ` +
        (color === 'emerald'
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
          : color === 'red'
            ? 'border-red-500/20 bg-red-500/10 text-red-600'
            : 'border-muted bg-muted/50 text-foreground/60')
      }
      title="Variação mês a mês"
    >
      {`${sign}${deltaPct.toFixed(1)}${suffix} MoM`}
    </span>
  )
}
