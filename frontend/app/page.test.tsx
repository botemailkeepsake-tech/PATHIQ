import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import HomePage from "@/app/page";

jest.mock("@/lib/api", () => ({
  getApiBase: () => "http://localhost:8000/api/v1",
}));

global.fetch = jest.fn();

const renderWithI18n = (ui: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("HomePage Health Status", () => {
  it("displays 'Disabled (Optional)' for Redis when backend returns disabled", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        database: "ok",
        redis: "disabled",
        environment: "development",
      }),
    });

    renderWithI18n(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("System Health")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Disabled (Optional)")).toBeInTheDocument();
    });
  });

  it("uses neutral blue color for Redis disabled status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        database: "ok",
        redis: "disabled",
        environment: "development",
      }),
    });

    renderWithI18n(<HomePage />);

    await waitFor(() => {
      const redisCard = screen.getByText("Disabled (Optional)").closest("div");
      expect(redisCard).toHaveStyle({ color: "var(--accent-blue)" });
    });
  });

  it("displays 'Development' for environment when backend returns development", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        database: "ok",
        redis: "disabled",
        environment: "development",
      }),
    });

    renderWithI18n(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Development")).toBeInTheDocument();
    });
  });

  it("displays 'Production' for environment when backend returns production", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        database: "ok",
        redis: "disabled",
        environment: "production",
      }),
    });

    renderWithI18n(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });
  });

  it("shows overall status as OK when database is OK and Redis is disabled", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        database: "ok",
        redis: "disabled",
        environment: "development",
      }),
    });

    renderWithI18n(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("API Status")).toBeInTheDocument();
      const apiStatusValue = screen.getByText("API Status").parentElement?.querySelector("div:last-child");
      expect(apiStatusValue).toHaveTextContent("OK");
    });
  });

  it("uses green color for OK database status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "ok",
        database: "ok",
        redis: "disabled",
        environment: "development",
      }),
    });

    renderWithI18n(<HomePage />);

    await waitFor(() => {
      const dbLabel = screen.getByText("Database Status");
      const dbValue = dbLabel.parentElement?.querySelector("div:last-child");
      expect(dbValue).toHaveTextContent("OK");
      expect(dbValue).toHaveStyle({ color: "var(--accent-green)" });
    });
  });

  it("uses red color for failed Redis status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "degraded",
        database: "ok",
        redis: "failed",
        environment: "development",
      }),
    });

    renderWithI18n(<HomePage />);

    await waitFor(() => {
      const redisCard = screen.getByText("Failed").closest("div");
      expect(redisCard).toHaveStyle({ color: "red" });
    });
  });

  it("uses amber color for degraded overall status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "degraded",
        database: "ok",
        redis: "failed",
        environment: "development",
      }),
    });

    renderWithI18n(<HomePage />);

    await waitFor(() => {
      const statusCard = screen.getByText("Degraded").closest("div");
      expect(statusCard).toHaveStyle({ color: "var(--accent-amber)" });
    });
  });
});