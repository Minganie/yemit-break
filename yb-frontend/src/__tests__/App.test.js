import { act, cleanup, render, screen } from "@testing-library/react";
import App from "../components/App";

describe("App", () => {
  afterEach(cleanup);

  test("renders sign up link", () => {
    render(<App />);
    const linkElement = screen.getByText(/sign up/i);
    expect(linkElement).toBeInTheDocument();
  });
});
