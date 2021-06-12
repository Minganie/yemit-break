import { useState } from "react";
import Input from "./Form/Input";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="container">
      <h1>Log in</h1>
      <Input />
    </div>
  );
}
export default Login;
