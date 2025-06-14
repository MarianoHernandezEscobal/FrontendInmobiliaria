import UpdatePropertyForm from "@/components/admin/update-property-form";
import { ProtectedPage } from "@/components/protected-page";

export default function updateProperty() {
  return <ProtectedPage>
    <UpdatePropertyForm />
  </ProtectedPage>
}