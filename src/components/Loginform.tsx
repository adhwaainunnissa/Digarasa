import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login berhasil!");
        console.log(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server tidak dapat dihubungi.");
    }
  };

  return (
    <div className="w-96 rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Login
      </h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 w-full rounded-lg border p-3"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 w-full rounded-lg border p-3"
      />

      <button
        onClick={handleLogin}
        className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
}