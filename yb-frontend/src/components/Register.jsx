import Joi from "joi";
import { useState } from "react";

import common from "../common.json";

import EmailInput from "./Form/EmailInput";
import PasswordInput from "./Form/PasswordInput";

function Register() {
  const [email, setEmail] = useState({ value: "", error: "Email is required" });
  const [pwOrigin, setPwOrigin] = useState({
    value: "",
    error: "Password is required",
  });
  const [pwConfirm, setPwConfirm] = useState({
    value: "",
    error: "Password must be confirmed",
  });
  const schema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string()
      .pattern(new RegExp(common.password.regex))
      .required(),
  };
  const ownValidation = async (pw) => {
    const result = await schema.password.validate(pw);
    return !result.error;
  };
  const jointValidation = (pwO, pwC) => {
    return pwO === pwC;
  };

  const handleEmailChange = async (value) => {
    const result = await schema.email.validate(value);
    if (result.error) {
      setEmail({ value, error: "This doesn't look like a valid email to me" });
    } else {
      setEmail({ value, error: "" });
    }
  };
  const handlePwOriginChange = async (value) => {
    const imValid = await ownValidation(value);
    if (imValid) {
      if (jointValidation(value, pwConfirm.value)) {
        setPwOrigin({ value: value, error: "" });
        setPwConfirm({ value: pwConfirm.value, error: "" });
      } else {
        setPwOrigin({ value: value, error: "Passwords must match" });
        setPwConfirm({ value: pwConfirm.value, error: "Passwords must match" });
      }
    } else {
      setPwOrigin({
        value,
        error: common.password.message,
      });
    }
  };
  const handlePwConfirmChange = async (value) => {
    const imValid = await ownValidation(value);
    if (imValid) {
      if (jointValidation(value, pwOrigin.value)) {
        setPwOrigin({ value: pwOrigin.value, error: "" });
        setPwConfirm({ value: value, error: "" });
      } else {
        setPwOrigin({ value: pwOrigin.value, error: "Passwords must match" });
        setPwConfirm({ value: value, error: "Passwords must match" });
      }
    } else {
      setPwConfirm({
        value,
        error: common.password.message,
      });
    }
  };
  const handleRegister = () => {
    console.log("here there be registration dragons");
  };

  const isValid = !email.error && !pwOrigin.error && !pwConfirm.error;

  return (
    <div className="container padded">
      <h1 className="title is-1">Sign up</h1>
      <EmailInput
        value={email.value}
        error={email.error}
        onChange={handleEmailChange}
      />
      <PasswordInput
        value={pwOrigin.value}
        error={pwOrigin.error}
        onChange={handlePwOriginChange}
      />
      <PasswordInput
        value={pwConfirm.value}
        error={pwConfirm.error}
        onChange={handlePwConfirmChange}
        confirm={true}
      />
      <button
        className={`button ${isValid ? "is-primary" : "is-light"}`}
        disabled={!isValid}
        onClick={handleRegister}
      >
        Sign up
      </button>
    </div>
  );
}
export default Register;
