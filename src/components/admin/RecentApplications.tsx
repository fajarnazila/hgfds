import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { recentApplicationsData } from "@/lib/placeholder-data"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const statusVariant = {
    Pending: "default",
    Reviewed: "secondary",
    Accepted: "outline",
    Rejected: "destructive",
} as const;


export default function RecentApplications() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
                An overview of the latest student applications.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="#">
                View All
                <ArrowUpRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Program</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentApplicationsData.map((app) => (
                <TableRow key={app.name}>
                    <TableCell>
                        <div className="font-medium">{app.name}</div>
                    </TableCell>
                    <TableCell>{app.program}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={statusVariant[app.status as keyof typeof statusVariant]} className="capitalize">{app.status.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{app.date}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
