import type { Metadata } from "next";
import "../admin/admin.css";

export const metadata: Metadata = {
  title: { default: "Mon Espace", template: "%s | SOTIP-CI" },
};

export default function MonEspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
