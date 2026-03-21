import Image from "next/image";
import styles from "./header.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.svg"
                alt="Логотип Fitness Training"
                width={48}
                height={48}
                priority
              />
            </div>
            <div className={styles.textWrapper}>
              <span className={styles.subtitle}>
                Онлайн-тренировки для занятий дома
              </span>
            </div>
          </Link>
        </div>
        <div className={styles.authSection}>
          <button className={styles.loginButton}>Войти</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
