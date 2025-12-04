import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { adminOverviewData } from "@/lib/placeholder-data"

export default function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {adminOverviewData.map((item) => (
         <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.change} from last month
              </p>
            </CardContent>
          </Card>
      ))}
    </div>
  )
}
