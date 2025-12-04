import Overview from "@/components/admin/Overview";
import RecentApplications from "@/components/admin/RecentApplications";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8">
          <Overview />
          <RecentApplications />
        </div>
      </main>
    </div>
  )
}
