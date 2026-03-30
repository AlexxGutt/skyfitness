import React from "react";
import Image from "next/image";
import styles from "./title.module.css";

const Title = () => {
  return (
    <section className={styles.titleSection}>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <h1 className={styles.mainTitle}>
            Начните заниматься спортом
            <br />и улучшите качество жизни
          </h1>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.greenBox}>
            <p className={styles.greenBoxText}>
              Измени своё
              <br />
              тело за полгода!
            </p>
            <div className={styles.polygonIcon}>
              <Image src="/Polygon 1.svg" alt="" width={30} height={35} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Title;
