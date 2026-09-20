import { PageHeader } from "@/components/shared/page-header";
import { AccountSettingsForm } from "@/components/settings/account-settings-form";

export default function SuperAdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Account Settings" description="Manage your SuperAdmin profile and security preferences." />
      <AccountSettingsForm />
    </div>
  );
}
