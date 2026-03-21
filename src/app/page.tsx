import Header from "@/components/Header/Header";
import styles from "./page.module.css";
import Title from "@/components/Title/Title";
import ButtonUpToTop from "@/components/Buttons/ButtonUpToTop";
import CardItems from "@/components/CardItems/CardItems";
import FetchingCourses from "@/components/FetchingCourse/FetchingCourse";

export default function Home() {
  return (
    <div className={styles.page}>
      <FetchingCourses />
      <Header />
      <main className={styles.main}>
        <Title />
        <CardItems />
        <div className={styles.buttonContainer}>
          <ButtonUpToTop />
        </div>
      </main>
    </div>
  );
}
