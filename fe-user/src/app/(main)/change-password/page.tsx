import ChangePasswordForm from "@/components/user/ChangePasswordForm";

function ChangePasswordPage() {
  return (
    <div className="max-w-md bg-white shadow-sm border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>

      <ChangePasswordForm />
    </div>
  );
}

export default ChangePasswordPage;
