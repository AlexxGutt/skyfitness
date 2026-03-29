import { Workout } from "@/components/Modal/WorkoutModal";
import { useEffect, useRef, useState } from "react";

export const useCustomScroll = (workouts: Workout[]) => {
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = list;
      if (scrollHeight <= clientHeight) {
        setVisible(false);
        return;
      }
      setVisible(true);
      const trackHeight = clientHeight;
      const newThumbHeight = Math.max(
        (clientHeight / scrollHeight) * trackHeight,
        30,
      );
      const newThumbTop =
        (scrollTop / (scrollHeight - clientHeight)) *
        (trackHeight - newThumbHeight);
      setThumbHeight(newThumbHeight);
      setThumbTop(newThumbTop);
    };

    update();
    list.addEventListener("scroll", update);
    return () => list.removeEventListener("scroll", update);
  }, [workouts]);

  return { listRef, thumbRef, thumbTop, thumbHeight, visible };
};
