import { render, screen } from "@testing-library/react";
import App from "./App";

it("has a main heading", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Test app" })
  ).toBeDefined();
});
