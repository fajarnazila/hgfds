
import ApplicationStatusChart from "@/components/admin/ApplicationStatusChart";
import Overview from "@/components/admin/Overview";
import RecentApplications from "@/components/admin/RecentApplications";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8">
          <Overview />
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <RecentApplications />
            </div>
            <div className="lg:col-span-3">
              <ApplicationStatusChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
