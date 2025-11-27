import AuthLayout from "./AuthLayout"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}
