
"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { Skeleton } from "../ui/skeleton"

type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

type Application = {
  status: ApplicationStatus;
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Menunggu",
  reviewed: "Ditinjau",
  accepted: "Diterima",
  rejected: "Ditolak",
};

const chartConfig = {
  applications: {
    label: "Pendaftaran",
  },
  pending: {
    label: "Menunggu",
    color: "hsl(var(--chart-1))",
  },
  accepted: {
    label: "Diterima",
    color: "hsl(var(--chart-2))",
  },
  rejected: {
    label: "Ditolak",
    color: "hsl(var(--chart-3))",
  },
   reviewed: {
    label: "Ditinjau",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function ApplicationStatusChart() {
  const firestore = useFirestore()
  
  const applicationsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, "applications"))
  }, [firestore])
  
  const { data: applications, isLoading } = useCollection<Application>(applicationsQuery)

  const chartData = React.useMemo(() => {
    if (!applications) return [];
    
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: statusLabels[status as ApplicationStatus],
      count,
      fill: chartConfig[status as keyof typeof chartConfig]?.color || 'hsl(var(--muted))'
    }));

  }, [applications]);
  
  if (isLoading) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Status Pendaftaran</CardTitle>
                <CardDescription>Distribusi status pendaftaran siswa.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-[250px]">
                    <Skeleton className="h-[200px] w-[200px] rounded-full" />
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Status Pendaftaran</CardTitle>
        <CardDescription>Distribusi status pendaftaran siswa.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pb-0">
         {chartData.length > 0 ? (
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-full max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={60}
                        strokeWidth={5}
                    />
                    <ChartLegend
                        content={<ChartLegendContent nameKey="status" />}
                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                </PieChart>
            </ChartContainer>
         ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p>Belum ada data pendaftaran untuk ditampilkan.</p>
            </div>
         )}
      </CardContent>
    </Card>
  )
}
