import { useEffect, useRef, useState } from "react";

export const useCustomScroll = <T>(items: T[], isOpen?: boolean) => {
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [visible, setVisible] = useState(false);

  // Обновление позиции ползунка
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
  }, [items.length, isOpen]);

  // Drag ползунка мышкой
  useEffect(() => {
    const thumb = thumbRef.current;
    const list = listRef.current;
    if (!thumb || !list) return;

    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;
      startY = e.clientY;
      startScrollTop = list.scrollTop;
      document.body.style.userSelect = "none";
      thumb.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = e.clientY - startY;
      const { scrollHeight, clientHeight } = list;
      const trackHeight = clientHeight;
      const currentThumbHeight = Math.max(
        (clientHeight / scrollHeight) * trackHeight,
        30,
      );
      const scrollableDistance = scrollHeight - clientHeight;
      const trackScrollable = trackHeight - currentThumbHeight;

      if (trackScrollable <= 0) return;

      const scrollDelta = (deltaY / trackScrollable) * scrollableDistance;
      list.scrollTop = startScrollTop + scrollDelta;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.body.style.userSelect = "";
      thumb.style.cursor = "grab";
    };

    thumb.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      thumb.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isOpen, visible]);

  return { listRef, thumbRef, thumbTop, thumbHeight, visible };
};
