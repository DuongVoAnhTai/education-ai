import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-black">
          Forgot password
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Provide the email address associated with your account to recover your
          password
        </p>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
