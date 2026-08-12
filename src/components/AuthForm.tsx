interface AuthFormProps {
    username: string;
    password: string;

    setUsername: (value: string) => void;
    setPassword: (value: string) => void;

    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;

    loading?: boolean;
    error?: string;
}

export default function AuthForm({
    username,
    password,
    setUsername,
    setPassword,
    onSubmit,
    loading = false,
    error = "",
}: AuthFormProps) {
    return (
        <div className="flex w-full flex-col items-center justify-center px-20">

            {/* Logo */}
            <img
                src="/src/assets/logo-pln.png"
                alt="Logo PLN"
                className="mb-5 w-14"
            />

            {/* Title */}
            <h2 className="text-3xl font-bold">
                FASOP
            </h2>

            <h3 className="mt-2 text-2xl font-semibold">
                <span className="text-yellow-500">
                    Monitoring
                </span>{" "}
                System
            </h3>

            {/* Error */}
            {error && (
                <div className="mt-6 w-full rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={onSubmit}
                className="mt-10 w-full space-y-5"
            >

                {/* Username */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="username"
                    required
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="current-password"
                    required
                />

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-700 p-3 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Logging in..."
                        : "Log in"}
                </button>

            </form>
        </div>
    );
}