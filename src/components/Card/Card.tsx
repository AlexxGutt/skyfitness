import Image from "next/image";
import { CourseType } from "@/sharedTypes/sharedTypes";
import { getCourseImage, getDifficultyText, getImageStyle } from "./constants";
import styles from "./card.module.css";
import { useAppSelector } from "@/store/store";
import { getAddCourse, getDeleteCourse } from "@/service/api/apiCourse";

type CardProps = {
  course: CourseType;
  variant?: "add" | "delete";
  onSuccess?: () => void;
};

const Card = ({ course, variant = "add", onSuccess }: CardProps) => {
  const { access } = useAppSelector((state) => state.auth);
  const {
    nameRU,
    nameEN,
    durationInDays,
    difficulty,
    dailyDurationInMinutes,
    _id,
  } = course;

  const isDeleteVariant = variant === "delete";
  const buttonIcon = isDeleteVariant
    ? "/Remove-in-Circle.svg"
    : "/Add-in-Circle.svg";
  const buttonAlt = isDeleteVariant ? "Удалить курс" : "Добавить курс";
  const tooltipText = isDeleteVariant ? "Удалить курс" : "Добавить курс";

  const handleClick = () => {
    if (!access) {
      alert("Авторизуйтесь, чтобы продолжить");
      return;
    }

    const request = isDeleteVariant
      ? getDeleteCourse(access, _id)
      : getAddCourse(access, _id);

    request
      .then(() => {
        console.log(isDeleteVariant ? "Курс удален" : "Курс добавлен");
        onSuccess?.();
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Произошла ошибка");
      });
  };

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
        <div className={styles.buttonWrapper}>
          <button className={styles.addButton} onClick={handleClick}>
            <Image src={buttonIcon} alt={buttonAlt} width={32} height={32} />
          </button>
          <span className={styles.tooltip}>{tooltipText}</span>
        </div>
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
