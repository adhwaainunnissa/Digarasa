export default function AuthForm() {
  return (
    <div className="flex flex-col justify-center items-center px-20">

      <img
        src="/src/assets/logo-pln.png"
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
          type="email"
          placeholder="example@gmail.com"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3"
        />

        <button className="w-full bg-blue-700 text-white rounded-lg p-3">
          Sign Up
        </button>
        <p className="text-center mt-8 text-gray-600">
            Already have an account?{" "}
        <a
        href="#"
        className="text-yellow-600 font-semibold hover:underline"
        >
    Sign in
  </a>
</p>


      </div>

    </div>
  );
}