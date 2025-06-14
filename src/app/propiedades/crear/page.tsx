"use client";

import CreatePropertyForm from "@/components/admin/create-property-form";
import { ProtectedPage } from "@/components/protected-page";

export default function CreatePage() {
  return (
    <ProtectedPage>
      <CreatePropertyForm />
    </ProtectedPage>
  );
}
