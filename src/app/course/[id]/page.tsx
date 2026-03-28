"use client";

import Header from "@/components/Header/Header";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import { useMemo } from "react";
import { getCourseImage } from "@/components/Card/constants";
import { getAddCourse } from "@/service/api/apiCourse";
import styles from "./page.module.css";

const CoursePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { allCourses } = useAppSelector((state) => state.courses);
  const { access } = useAppSelector((state) => state.auth);

  const course = useMemo(() => {
    if (id && allCourses.length > 0) {
      return allCourses.find((c) => c._id === id) || null;
    }
    return null;
  }, [id, allCourses]);

  const loading = allCourses.length === 0;

  const benefits = [
    {
      number: "1",
      text: "Давно хотели попробовать йогу, но не решались начать",
    },
    {
      number: "2",
      text: "Хотите укрепить позвоночник, избавиться от болей в спине и суставах",
    },
    {
      number: "3",
      text: "Ищете активность, полезную для тела и души",
    },
  ];

  const directions = [
    "Йога для новичков",
    "Классическая йога",
    "Кундалини-йога",
    "Йогатерапия",
    "Хатха-йога",
    "Аштанга-йога",
  ];

  const benefitsList = [
    "проработка всех групп мышц",
    "тренировка суставов",
    "улучшение циркуляции крови",
    "упражнения заряжают бодростью",
    "помогают противостоять стрессам",
  ];

  const handleAddCourse = () => {
    if (!access) {
      router.push("/sign-in");
      return;
    }

    getAddCourse(access, id as string)
      .then(() => {
        alert("Курс успешно добавлен!");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Ошибка добавления курса");
      });
  };

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
          <div className={styles.heroBlock}>
            <div className={styles.heroContent}>
              <h1 className={styles.courseTitle}>{course.nameRU}</h1>
              <div className={styles.heroImage}>
                <Image
                  src={getCourseImage(course.nameEN)}
                  alt={course.nameRU}
                  width={1023}
                  height={683}
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
                <div className={styles.benefitNumber}>{benefit.number}</div>
                <div className={styles.benefitText}>{benefit.text}</div>
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
                height={420}
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
