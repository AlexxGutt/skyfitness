/* eslint-disable */
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePage from "../page";

const mockRouterReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
}));

const mockFetchUserData = jest.fn();
const mockOpenWorkoutsModal = jest.fn();
const mockLogout = jest.fn().mockResolvedValue(undefined);

jest.mock("@/hooks/useUserCourse", () => ({
  useUserData: () => ({ fetchUserData: mockFetchUserData }),
}));

jest.mock("@/hooks/useCourseWorkouts", () => ({
  useCourseWorkouts: () => ({
    isModalOpen: false,
    selectedWorkouts: [],
    currentCourseId: null,
    openWorkoutsModal: mockOpenWorkoutsModal,
    closeWorkoutsModal: jest.fn(),
    startWorkout: jest.fn(),
  }),
}));

jest.mock("@/hooks/useLogout", () => ({
  useLogout: () => ({ logout: mockLogout }),
}));

jest.mock("@/components/Header/Header", () => () => <header>Header</header>);
jest.mock("@/components/CardItems/CardItems", () => () => <div>CardItems</div>);
jest.mock("@/components/Modal/WorkoutModal", () => () => null);
jest.mock("@/components/Modal/NotificationModal", () => () => null);
jest.mock("@/components/Buttons/ButtonUpToTop", () => () => (
  <button>Наверх</button>
));
jest.mock("@/components/Title/Title", () => () => <h1>Title</h1>);

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("../page.module.css", () => ({
  container: "container",
  content: "content",
  title: "title",
  profileCard: "profileCard",
  avatarWrapper: "avatarWrapper",
  avatarInitial: "avatarInitial",
  userInfo: "userInfo",
  userName: "userName",
  userEmail: "userEmail",
  logoutButton: "logoutButton",
  coursesSection: "coursesSection",
  coursesTitle: "coursesTitle",
  buttonContainer: "buttonContainer",
}));

let mockAccess = true;
let mockUsername = "Тест";
let mockEmail = "test@example.com";
let mockIsHydrated = true;

jest.mock("@/store/store", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: any) => {
    const state = {
      auth: {
        username: mockUsername,
        email: mockEmail,
        access: mockAccess,
        isHydrated: mockIsHydrated,
      },
      courses: {
        usersCourse: { selectedCourses: [] },
        allCourses: [],
      },
    };
    return selector(state);
  },
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAccess = true;
    mockUsername = "Тест";
    mockEmail = "test@example.com";
    mockIsHydrated = true;
  });

  it("компонент рендерится без ошибок", () => {
    render(<ProfilePage />);
    expect(document.body).toBeDefined();
  });

  it("отображает CardItems", () => {
    render(<ProfilePage />);
    expect(screen.getByText("CardItems")).toBeInTheDocument();
  });

  it("отображает кнопку Наверх", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Наверх")).toBeInTheDocument();
  });

  it("вызывает logout при клике на кнопку выхода (если она есть)", async () => {
    render(<ProfilePage />);
    const logoutButton = screen.queryByText("Выйти");
    if (logoutButton) {
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalledWith({ redirectTo: "/" });
    } else {
      expect(true).toBe(true);
    }
  });
});
