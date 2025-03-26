import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StudentsList from "../StudentsList";

global.fetch = jest.fn() as jest.Mock;

describe("StudentsList Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the student list correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: "123",
          firstName: "John",
          lastName: "Doe",
          institutionalEmail: "john.doe@example.com",
        },
      ],
    });

    render(
      <MemoryRouter>
        <StudentsList />
      </MemoryRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("John")).toBeInTheDocument());
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("should show an error message when fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(
      <MemoryRouter>
        <StudentsList />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
  });

  it("should handle delete action correctly", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "123",
            firstName: "John",
            lastName: "Doe",
            institutionalEmail: "john.doe@example.com",
          },
        ],
      })
      .mockResolvedValueOnce({ ok: true });

    render(
      <MemoryRouter>
        <StudentsList />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("John")).toBeInTheDocument());

    const deleteButton = screen.getByText("Eliminar");
    fireEvent.click(deleteButton);

    await waitFor(() => expect(screen.queryByText("John")).not.toBeInTheDocument());
  });
});