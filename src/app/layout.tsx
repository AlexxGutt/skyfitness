import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import InitAuth from "@/components/Auth/InitAuth";
import FetchingCourses from "@/components/FetchingCourse/FetchingCourse";
import GlobalLoader from "@/components/Loader/GlobalLoader";
import { BackButtonGuard } from "@/components/Buttons/BackButtonGuard";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  style: ["normal"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Fitness Training - Онлайн тренировки для занятий дома",
  description: "Профессиональные онлайн-тренировки для занятий дома",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang="ru" className={roboto.variable}>
        <body className={roboto.className}>
          <BackButtonGuard />
          <GlobalLoader />
          <FetchingCourses />
          <InitAuth />
          {children}
        </body>
      </html>
    </ReduxProvider>
  );
}
