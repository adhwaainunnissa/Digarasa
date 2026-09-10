import { useState } from "react";
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2 } from "lucide-react";

interface AuthFormProps {
    username: string;
    password: string;

    setUsername: (value: string) => void;
    setPassword: (value: string) => void;

    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;

    loading?: boolean;
    error?: string;
    isSuccess?: boolean;
}

export default function AuthForm({
    username,
    password,
    setUsername,
    setPassword,
    onSubmit,
    loading = false,
    error = "",
    isSuccess = false,
}: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex w-full flex-col justify-center px-8 sm:px-16 md:px-20 lg:px-28 xl:px-32">
            {/* Header / Branding */}
            <div className="mb-10 flex flex-col items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 flex h-20 w-20 items-center justify-center">
                <img
                    src="/src/assets/logo-pln.png"
                    alt="Logo PLN"
                    className="h-full w-full object-contain"
                />
            </div>                
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    FASOP
                </h2>
                <h3 className="mt-1 text-xl font-medium tracking-tight text-gray-500 sm:text-2xl">
                    <span className="bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text font-semibold text-transparent">
                        Monitoring
                    </span>{" "}
                    System
                </h3>
                <p className="mt-3 text-sm text-gray-500">
                    Enter your credentials to access the secure dashboard.
                </p>
            </div>

            {/* Error Message */}
            <div 
                className={`mb-6 overflow-hidden transition-all duration-300 ease-in-out ${error ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                    <p className="font-medium">{error}</p>
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={onSubmit}
                className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both"
            >
                {/* Username Input */}
                <div className="space-y-1.5">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                            <User className="h-5 w-5" />
                        </div>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block w-full rounded-xl border border-gray-200 bg-white/50 pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm"
                            autoComplete="username"
                            disabled={loading || isSuccess}
                            required
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-xl border border-gray-200 bg-white/50 pl-11 pr-11 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-sm"
                            autoComplete="current-password"
                            disabled={loading || isSuccess}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
                            disabled={loading || isSuccess}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading || isSuccess}
                    className="relative mt-8 flex w-full items-center justify-center overflow-hidden rounded-xl bg-blue-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-800 hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none active:scale-[0.98]"
                >
                    <span className={`flex items-center gap-2 transition-all duration-300 ${loading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                        Sign in to Dashboard
                    </span>
                    
                    {loading && !isSuccess && (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="ml-2">Authenticating...</span>
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
}