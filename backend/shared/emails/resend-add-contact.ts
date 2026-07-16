import resend from "@/lib/email/resend";

interface AddContactParams {
  email: string;
  firstName: string;
  lastName: string;
}

export async function resendAddContact({
  email,
  firstName,
  lastName,
}: AddContactParams): Promise<void> {
  const { error } = await resend.contacts.create({
    email,
    firstName,
    lastName,
    segments: [{ id: "e77c2789-ef9f-4448-b71b-b07f34803a29" }],
  });

  if (error) {
    console.error("[Resend] Error agregando contacto a audiencia:", error);
  }
}
