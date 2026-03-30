"use client";
import { useAppSelector } from "@/store/store";
import styles from "./globalLoader.module.css";

const GlobalLoader = () => {
  const { isLoading } = useAppSelector((state) => state.loader);

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
};

export default GlobalLoader;
