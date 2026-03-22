"use client";

import React from "react";
import { useAppSelector } from "@/store/store";
import Card from "@/components/Card/Card";
import Loader from "@/components/Loader/Loader";
import styles from "./cardItems.module.css";

const CardItems: React.FC = () => {
  const { allCourses, error } = useAppSelector((state) => state.courses);

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.error}>{error}</div>
      </section>
    );
  }

  if (!allCourses.length) {
    return (
      <section className={styles.section}>
        <Loader text="курсы" />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {allCourses.map((course) => (
          <Card key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default CardItems;
