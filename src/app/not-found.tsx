"use client";

import Link from "next/link";
import Header from "@/components/Header/Header";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.message}>Страница не найдена</p>
          <Link href="/" className={styles.link}>
            Вернуться на главную
          </Link>
        </div>
      </main>
    </>
  );
}
