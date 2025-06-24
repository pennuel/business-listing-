import { useReducer, useCallback } from "react";
import { User, TwoFactor, UserRegistration } from "@/lib/types/profile/user_type";
import { UserAction } from "@/lib/types/profile/userActions/userActions";

const initialState: User | null = null;

function userReducer(state: User | null, action: UserAction): User | null {
  switch (action.type) {
    case "SET_USER":
      return { ...action.payload };

    case "UPDATE_USER":
      return state ? { ...state, ...action.payload } : state;

    case "UPDATE_TWO_FACTOR":
      return state ? { ...state, twoFactor: action.payload } : state;

    case "UPDATE_REGISTRATIONS":
      return state ? { ...state, registrations: action.payload } : state;

    case "CLEAR_USER":
      return null;

    default:
      return state;
  }
}

export function useUserReducer() {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setUser = useCallback((user: User) => {
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: updates });
  }, []);

  const updateTwoFactor = useCallback((twoFactor: TwoFactor) => {
    dispatch({ type: "UPDATE_TWO_FACTOR", payload: twoFactor });
  }, []);

  const updateRegistrations = useCallback(
    (registrations: UserRegistration[]) => {
      dispatch({ type: "UPDATE_REGISTRATIONS", payload: registrations });
    },
    []
  );

  const clearUser = useCallback(() => {
    dispatch({ type: "CLEAR_USER" });
  }, []);

  return {
    user: state,
    setUser,
    updateUser,
    updateTwoFactor,
    updateRegistrations,
    clearUser,
  };
}
