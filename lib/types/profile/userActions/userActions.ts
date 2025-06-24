import { TwoFactor, User, UserRegistration } from "../user_type";

export type UserAction =
  | { type: "SET_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "CLEAR_USER" }
  | { type: "UPDATE_TWO_FACTOR"; payload: TwoFactor }
  | { type: "UPDATE_REGISTRATIONS"; payload: UserRegistration[] };
