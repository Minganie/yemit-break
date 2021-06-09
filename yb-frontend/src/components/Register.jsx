import { useState } from "react";

function Register() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  return (
    <div className="container">
      <h1>Sign up</h1>
    </div>
  );
}
export default Register;
