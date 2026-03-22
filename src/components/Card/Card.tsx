"use client";

import Image from "next/image";
import { CourseType } from "@/sharedTypes/sharedTypes";
import { getCourseImage, getDifficultyText, getImageStyle } from "./constants";
import styles from "./card.module.css";

type CardProps = {
  course: CourseType;
};

const Card = ({ course }: CardProps) => {
  const { nameRU, nameEN, durationInDays, difficulty, dailyDurationInMinutes } =
    course;

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src={getCourseImage(nameEN)}
            alt={nameRU}
            width={834}
            height={557}
            className={styles.image}
            style={getImageStyle(nameEN)}
          />
        </div>
        <button className={styles.addButton}>
          <Image
            src="/Add-in-Circle.svg"
            alt="Добавить"
            width={32}
            height={32}
          />
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{nameRU}</h3>
        <div className={styles.badgesRow}>
          <div className={styles.badge}>
            <Image src="/Calendar.svg" alt="Календарь" width={18} height={18} />
            <span className={styles.badgeText}>{durationInDays} дней</span>
          </div>
          <div className={styles.badge}>
            <Image src="/Time.svg" alt="Время" width={18} height={18} />
            <span className={styles.badgeText}>
              {dailyDurationInMinutes.from}-{dailyDurationInMinutes.to} мин/день
            </span>
          </div>
        </div>
        <div className={styles.badgesRow}>
          <div className={styles.badge}>
            <Image
              src="/mingcute_signal-fill.svg"
              alt="Сложность"
              width={18}
              height={18}
            />
            <span className={styles.badgeText}>
              {getDifficultyText(difficulty)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
