"use server";

import { User } from "@/types/user";

export async function updateProfile(
  formData: FormData
): Promise<{ data?: User; error?: string }> {
  try {
    // Get all form data and convert FormDataEntryValue to string
    const getValue = (key: string) => {
      const value = formData.get(key);
      return value ? String(value) : undefined;
    };

    // Construct user data with proper types
    const data: Partial<User> = {
      firstName: getValue("firstName") || "",
      lastName: getValue("lastName") || "",
      username: getValue("username"),
      email: getValue("email"),
      birthDate: getValue("birthDate"),
      mobilePhone: getValue("mobilePhone"),
      imageUrl: getValue("imageUrl"), // Add image URL handling
      data: {
        profession: {
          title: getValue("title") || "",
        },
        bio: getValue("bio") || "",
        location: {
          town: getValue("location") || "",
        },
        website: getValue("website"),
        LinkedIn: getValue("linkedin"),
        twitter: getValue("twitter"),
        github: getValue("github"),
      },
    };

    console.log(' user data to update: ', data);

    // Here you would typically:
    // 1. Validate the data
    // 2. Make an API call to your backend
    // 3. Update the database
    // const response = await fetch('your-api-endpoint', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // const result = await response.json();

    // Mock the response by combining existing user data with updates
    const updatedUser = {
      // Add required User fields that shouldn't be updated
      id: "1",
      active: true,
      connectorId: "default",
      insertInstant: new Date().toISOString(),
      lastLoginInstant: new Date().toISOString(),
      lastUpdateInstant: new Date().toISOString(),
      passwordLastUpdateInstant: new Date().toISOString(),
      tenantId: "default",
      twoFactorEnabled: false,
      usernameStatus: "ACTIVE",
      verified: true,
      ...data, // Spread in the updates
    } as User;

    return {
      data: updatedUser,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
