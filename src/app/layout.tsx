import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { cn } from "@/lib/utils"
import "./globals.css";
import { JotaiProvider } from "@/components/providers/jotai-provider";
import { CreateWorkspaceModal } from "@/components/shared/create-workspace-modal";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Slack",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
          <ConvexClientProvider>
            <JotaiProvider>
              <CreateWorkspaceModal />
              {children}
              <Toaster richColors />
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
