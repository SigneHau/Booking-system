import ClientLayoutWrapper from "./ClientLayoutWrapper";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}
