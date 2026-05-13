import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProfileSidebar } from "./ProfileSidebar";

describe("ProfileSidebar", () => {
  it("renders the availability pill and accessible experience ring on the homepage", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ProfileSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/available for work/i)).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: /experience: 65%/i })
    ).toHaveAttribute("aria-valuenow", "65");
  });
});
