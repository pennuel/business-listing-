import { database as coreDatabase, businessService, userService, authService, reviewService, serviceService as offerings, checkDatabaseConnection as coreCheckConnection, disconnectDatabase as coreDisconnect } from "@think-id/database"

export const database = {
  createBusiness: (data: any) => coreDatabase.businesses.createBusiness(data),
  getBusinessById: (id: string) => coreDatabase.businesses.getBusinessById(id),
  getBusinessesByEmail: (email: string) => coreDatabase.businesses.getBusinessesByEmail(email),
  getBusinessesByUserId: (userId: string) => coreDatabase.businesses.getBusinessesByUserId(userId),
  getBusinessesByUser: (userId: string, email: string) => coreDatabase.businesses.getBusinessesByUser(userId, email),
  updateBusiness: (id: string, data: any) => coreDatabase.businesses.updateBusiness(id, data),
  deleteBusiness: (id: string) => coreDatabase.businesses.deleteBusiness(id),
  getAllBusinesses: (options?: any) => coreDatabase.businesses.getAllBusinesses(options),
  isUsingFallback: async () => false,
  resetConnection: async () => {},
};

export const checkDatabaseConnection = coreCheckConnection;
export const disconnectDatabase = coreDisconnect;
export { businessService, userService, authService, reviewService, offerings };
export type { Business } from "@prisma/client";
