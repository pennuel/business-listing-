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

  useEffect(() => {
    if (user) {
      dispatch(setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        dbUser: user
      }));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (business) {
      dispatch(setCurrentBusiness(business));
    }
  }, [business, dispatch]);

  useEffect(() => {
    if (userBusinesses) {
      dispatch(setUserBusinesses(userBusinesses));
    }
  }, [userBusinesses, dispatch]);

  return null;
}
