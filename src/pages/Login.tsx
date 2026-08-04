import AuthForm from "../components/AuthForm";
import RightBanner from "../components/RightBanner";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-[1450px] h-[820px] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-2">

        {/* Left Side */}
        <div className="flex items-center justify-center p-16">
          <AuthForm />
        </div>

        {/* Right Side */}
        <div className="h-full">
          <RightBanner />
        </div>

      </div>
    </div>
  );
}
