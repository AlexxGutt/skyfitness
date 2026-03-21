"use client";

import { Provider } from "react-redux";
import { makeStore } from "./store";

// Создаём стор один раз вне компонента
const store = makeStore();

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
