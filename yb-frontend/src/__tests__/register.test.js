import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import Register from "../components/Register";

describe("<Register />", () => {
  afterEach(cleanup);

  it("shows all three imputs", () => {
    render(<Register />);
    const email = screen.getByLabelText(/email/i);
    expect(email).toBeInTheDocument();
    const password = screen.getAllByLabelText(/password/i);
    expect(password[0]).toBeInTheDocument();
    const confirm = screen.getByLabelText(/confirm/i);
    expect(confirm).toBeInTheDocument();
  });

  it("refuses invalid emails", async () => {
    render(<Register />);
    const email = screen.getByLabelText(/email/i);
    await act(async () => {
      fireEvent.input(email, { target: { value: "melgmail.com" } });
    });
    expect(email).toHaveValue("melgmail.com");
    expect(screen.getByText(/doesn't/i)).toBeInTheDocument();
  });

  it("accepts valid emails", async () => {
    render(<Register />);
    const email = screen.getByLabelText(/email/i);
    await act(async () => {
      fireEvent.input(email, { target: { value: "mel@gmail.com" } });
    });
    expect(email).toHaveValue("mel@gmail.com");
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });

  it("refuses empty passwords", async () => {
    render(<Register />);
    const password = screen.getByLabelText("Password");
    await act(async () => {
      fireEvent.input(password, { target: { value: "" } });
    });
    expect(screen.getAllByText(/required/i)[0]).toBeInTheDocument();
  });

  it("accepts filled and identical passwords", async () => {
    render(<Register />);
    const password = screen.getByLabelText("Password");
    const repass = screen.getByLabelText("Confirm Password");
    await act(async () => {
      fireEvent.input(password, { target: { value: "123456abc" } });
    });
    await act(async () => {
      fireEvent.input(repass, { target: { value: "123456abc" } });
    });
    expect(screen.getAllByText(/valid/i)[0]).toBeInTheDocument();
  });

  it("refuses different passwords", async () => {
    render(<Register />);
    const password = screen.getByLabelText("Password");
    const repass = screen.getByLabelText("Confirm Password");
    await act(async () => {
      fireEvent.input(password, { target: { value: "abc123456" } });
    });
    await act(async () => {
      fireEvent.input(repass, { target: { value: "123456abc" } });
    });
    expect(screen.getAllByText(/must match/i)[0]).toBeInTheDocument();
  });

  it("accepts, then refuses if passwords are identical, then changed", async () => {
    render(<Register />);
    const password = screen.getByLabelText("Password");
    const repass = screen.getByLabelText("Confirm Password");
    await act(async () => {
      fireEvent.input(password, { target: { value: "123456abc" } });
    });
    await act(async () => {
      fireEvent.input(repass, { target: { value: "123456abc" } });
    });
    expect(screen.getAllByText(/valid/i)[0]).toBeInTheDocument();
    await act(async () => {
      fireEvent.input(password, { target: { value: "abc123456" } });
    });
    expect(screen.getAllByText(/must match/i)[0]).toBeInTheDocument();
  });
});
