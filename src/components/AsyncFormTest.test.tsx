import { render, screen, waitFor } from "@testing-library/react";
import { AsyncFormTest } from "./AsyncFormTest";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";

test("renders form controls", () => {
  render(<AsyncFormTest />);

  expect(screen.getByRole("textbox", { name: "Username" }));
  expect(screen.getByRole("button", { name: "Update" }));
});

it("does not allow resubmittion while change is pending", async () => {
  render(<AsyncFormTest />);

  const usernameInput = screen.getByRole("textbox", { name: "Username" });

  expect(screen.getByText("Your name is:"));

  await userEvent.type(usernameInput, "John Doe");

  const submitButton = screen.getByRole("button", { name: "Update" });
  await userEvent.click(submitButton);

  // Check optimistic update
  expect(screen.getByText("Your name is: John Doe"));

  // Check that the button is accessibly disabled
  expect(submitButton).toBeEnabled();
  expect(submitButton).toHaveAttribute("aria-disabled");

  // Expect button to be enabled after the mock async update is done
  await waitFor(() => {
    expect(submitButton).not.toHaveAttribute("aria-disabled");
  });
});
