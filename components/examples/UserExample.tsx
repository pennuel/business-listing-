"use client";

import { useUserStore } from "../../stores/userStore";

export default function UserExample() {
  const { user, isLoading, error, setUser, updateUser, clearUser } =
    useUserStore();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user logged in</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <p>
          Name: {user.firstName} {user.lastName}
        </p>
        <p>Email: {user.email}</p>
        <p>Username: {user.username}</p>
      </div>

      <div className="mt-4">
        <button
          onClick={() => updateUser({ firstName: "Updated Name" })}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Update Name
        </button>
        <button
          onClick={clearUser}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
