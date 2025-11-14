import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
          Đặt lại mật khẩu
        </h2>

        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default ResetPasswordPage;
