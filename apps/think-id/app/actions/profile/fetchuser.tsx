"use server";

import { getProfileData } from "@/lib/dal/profile-dal";



export async function fetchUser() {

    // Fetch user profile data from the database
    const user = await getProfileData();

    return user;
}