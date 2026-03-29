"use client";

import styles from "./button.module.css";

const ButtonUpToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button className={styles.button} onClick={scrollToTop}>
      Наверх ↑
    </button>
  );
};

export default ButtonUpToTop;
