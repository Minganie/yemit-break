import { useState } from "react";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="container">
      <h1>Log in</h1>
    </div>
  );
}
export default Login;
