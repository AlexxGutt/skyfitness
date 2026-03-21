import Image from "next/image";
import styles from "./card.module.css";

const Card = () => {
  return (
    <div className={styles.card}>
      {/* Изображение с кнопкой поверх */}
      <div className={styles.imageWrapper}>
        <Image
          src="/yoga.svg"
          alt="Йога"
          width={834}
          height={557}
          className={styles.image}
        />
        <button className={styles.addButton}>
          <Image
            src="/Add-in-Circle.svg"
            alt="Добавить"
            width={32}
            height={32}
          />
        </button>
      </div>

      {/* Контент */}
      <div className={styles.content}>
        {/* Заголовок Йога */}
        <h3 className={styles.title}>Йога</h3>

        {/* Первый ряд бейджей - 25 дней и время */}
        <div className={styles.badgesRow}>
          <div className={styles.badge}>
            <Image src="/Calendar.svg" alt="Календарь" width={18} height={18} />
            <span className={styles.badgeText}>25 дней</span>
          </div>
          <div className={styles.badge}>
            <Image src="/Time.svg" alt="Время" width={18} height={18} />
            <span className={styles.badgeText}>20-50 мин/день</span>
          </div>
        </div>

        {/* Второй ряд - сложность */}
        <div className={styles.badgesRow}>
          <div className={styles.badge}>
            <Image
              src="/mingcute_signal-fill.svg"
              alt="Сложность"
              width={18}
              height={18}
            />
            <span className={styles.badgeText}>Сложность</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
