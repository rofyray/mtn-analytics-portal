import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { ManageDashboardsClient } from "./manage-dashboards-client"

export const dynamic = "force-dynamic"

const ADMIN_EMAIL = "geoffery.okyere-forson@mtn.com"

export default async function ManageDashboardsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  if (session.user.email !== ADMIN_EMAIL) {
    redirect("/admin/dashboard")
  }

  return <ManageDashboardsClient />
}
