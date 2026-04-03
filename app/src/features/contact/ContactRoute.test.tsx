import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ContactRoute } from "./ContactRoute";

describe("ContactRoute", () => {
  it(
    "renders key contact sections and handles validation and success flow",
    async () => {
    render(
      <MemoryRouter>
        <ContactRoute />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2, name: /reach out/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /send a message/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /frequently asked/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: "Leon" }
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "leon@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/project type/i), {
      target: { value: "web-development" }
    });
    fireEvent.change(screen.getByLabelText(/your message/i), {
      target: { value: "I need help designing and building a new product site." }
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(
      () => {
        expect(
          screen.getByRole("heading", { level: 3, name: /message sent successfully/i })
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    },
    15000
  );
});

