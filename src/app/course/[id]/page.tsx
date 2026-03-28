"use client";

import Header from "@/components/Header/Header";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store/store";
import { useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { getHeroImageStyle } from "@/constants/coursePageConstants";
import { getCourseImage } from "@/constants/cardConstants";

const CoursePage = () => {
  const { id } = useParams();
  const { allCourses } = useAppSelector((state) => state.courses);
  const { access } = useAppSelector((state) => state.auth);

  const course = useMemo(() => {
    if (id && allCourses.length > 0) {
      return allCourses.find((c) => c._id === id) || null;
    }
    return null;
  }, [id, allCourses]);

  useEffect(() => {}, [access]);

  const loading = allCourses.length === 0;

  // Данные для карточек преимуществ (из fitting API)
  const benefits = course?.fitting || [""];

  // Направления из API
  const directions = course?.directions || [""];

  const benefitsList = [
    "проработка всех групп мышц",
    "тренировка суставов",
    "улучшение циркуляции крови",
    "упражнения заряжают бодростью",
    "помогают противостоять стрессам",
  ];

  const handleAddCourse = () => {
    if (!access) {
      alert("Авторизуйтесь, чтобы добавить курс");
      return;
    }
    alert("Курс добавлен!");
  };

  // Получаем стили для hero изображения
  const heroImageStyle = getHeroImageStyle(course?.nameEN || "Yoga");

  if (loading) {
    return (
      <>
        <Header />
        <main className={styles.container}>
          <div className={styles.loading}>Загрузка...</div>
        </main>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <main className={styles.container}>
          <div className={styles.notFound}>Курс не найден</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          {/* Блок с фоном и картинкой */}
          <div
            className={styles.heroBlock}
            style={{ backgroundColor: heroImageStyle.bgColor }}
          >
            <div className={styles.heroContent}>
              <h1 className={styles.courseTitle}>{course.nameRU}</h1>
              <div
                className={styles.heroImage}
                style={{
                  top: `${heroImageStyle.top}px`,
                  right: `${heroImageStyle.right}px`,
                  width: `${heroImageStyle.width}px`,
                  height: `${heroImageStyle.height}px`,
                }}
              >
                <Image
                  src={getCourseImage(course.nameEN)}
                  alt={course.nameRU}
                  width={heroImageStyle.width}
                  height={heroImageStyle.height}
                  className={styles.courseImage}
                />
              </div>
            </div>
          </div>

          {/* Заголовок "Подойдет для вас, если:" */}
          <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>

          {/* Блок с карточками преимуществ */}
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitNumber}>{index + 1}</div>
                <div className={styles.benefitText}>{benefit}</div>
              </div>
            ))}
          </div>

          {/* Заголовок "Направления" */}
          <h2 className={styles.directionsTitle}>Направления</h2>

          {/* Блок с направлениями */}
          <div className={styles.directionsBlock}>
            <Image
              src="/sportsman.svg"
              alt=""
              width={519}
              height={540}
              className={styles.ctaImageSportsman}
            />
            <div className={styles.directionsGrid}>
              {directions.map((direction, index) => (
                <div key={index} className={styles.directionItem}>
                  <Image
                    src="/Sparcle.svg"
                    alt=""
                    width={26}
                    height={26}
                    className={styles.directionIcon}
                  />
                  <span className={styles.directionText}>{direction}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Блок "Начните путь к новому телу" */}
          <div className={styles.callToAction}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Начните путь <br />к новому телу
              </h2>
              <ul className={styles.ctaList}>
                {benefitsList.map((item, index) => (
                  <li key={index} className={styles.ctaListItem}>
                    {item}
                  </li>
                ))}
              </ul>
              <button className={styles.ctaButton} onClick={handleAddCourse}>
                {access ? "Добавить курс" : "Войдите, чтобы добавить курс"}
              </button>
            </div>

            {/* Декоративные изображения */}
            <div className={styles.ctaImages}>
              <Image
                src="/Vector green.svg"
                alt=""
                width={670}
                height={491}
                className={styles.ctaImageGreen}
              />
              <Image
                src="/Vector black.svg"
                alt=""
                width={50}
                height={43}
                className={styles.ctaImageBlack}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CoursePage;
