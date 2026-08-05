import { useState } from "react";

export default function AuthForm() {
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
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server tidak dapat dihubungi.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-20">

      <img
        src="/src/assets/logo-pln.png"
        alt="Logo PLN"
        className="w-14 mb-5"
      />

      <h2 className="text-3xl font-bold">
        FASOP
      </h2>

      <h3 className="text-2xl font-semibold mt-2">
        <span className="text-yellow-500">Monitoring</span> System
      </h3>

      <div className="w-full mt-10 space-y-5">

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-blue-700 p-3 text-white hover:bg-blue-800"
        >
          Log in
        </button>

      </div>

    </div>
  );
}