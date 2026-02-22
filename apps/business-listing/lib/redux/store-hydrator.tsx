'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from './hooks';
import { setUser } from './slices/userSlice';
import { setCurrentBusiness, setUserBusinesses } from './slices/businessSlice';
import { Business } from '../api';

interface HydratorProps {
  user?: any;
  business?: Business;
  userBusinesses?: Business[];
}

export function StoreHydrator({ user, business, userBusinesses }: HydratorProps) {
  const dispatch = useAppDispatch();
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      if (user) {
        dispatch(setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          dbUser: user
        }));
      }

      if (business) {
        dispatch(setCurrentBusiness(business));
      }

      if (userBusinesses) {
        dispatch(setUserBusinesses(userBusinesses));
      }

      hydrated.current = true;
    }
  }, [user, business, userBusinesses, dispatch]);

  return null;
}
