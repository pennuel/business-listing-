"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@think-id/ui/components/ui/card";
import { Button } from "@think-id/ui/components/ui/button";
import { Badge } from "@think-id/ui/components/ui/badge";
import { Skeleton } from "@think-id/ui/components/ui/skeleton";
import { Building2, Plus, MapPin, Phone, Mail, Globe, AlertCircle } from "lucide-react";
import type { Business } from "@/lib/database";

export function BusinessList({ onManageBusiness }: { onManageBusiness?: (id: string) => void }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }

    const fetchBusinesses = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);
        // Use both userId and email for robust matching
        const queryParams = new URLSearchParams();
        if ((session.user as any).id) queryParams.append('userId', (session.user as any).id);
        if (session.user.email) queryParams.append('email', session.user.email);
          
        const response = await fetch(`/api/businesses?${queryParams.toString()}`);
        const data = await response.json();
        setBusinesses(data.businesses || []);
      } catch (err) {
        console.error("Error loading businesses:", err);
        setError("Failed to load your businesses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [session, status]);

  const handleEditBusiness = (id: string) => {
    if (onManageBusiness) {
      onManageBusiness(id);
    } else {
      router.push(`/onboarding?id=${id}`);
    }
  };

  const handleCreateBusiness = () => {
    router.push("/onboarding");
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
         <AlertCircle className="h-12 w-12 text-destructive mb-4" />
         <h3 className="text-xl font-semibold mb-2">Error</h3>
         <p className="text-muted-foreground mb-4">{error}</p>
         <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Businesses</h2>
          <p className="text-muted-foreground">
            Manage your registered businesses and listings.
          </p>
        </div>
        <Button onClick={handleCreateBusiness}>
          <Plus className="mr-2 h-4 w-4" />
          Register New Business
        </Button>
      </div>

      {businesses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="p-4 bg-muted rounded-full mb-4">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Businesses Found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven't registered any businesses yet. Get started by creating your first business profile.
          </p>
          <Button onClick={handleCreateBusiness} size="lg">
            Create Business Profile
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
                    {business.status || 'Pending'}
                  </Badge>
                </div>
                <CardTitle className="mt-4 truncate">{business.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {business.category} • {business.offeringType}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 text-sm">
                <div className="grid gap-2 text-muted-foreground">
                  {business.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{business.address}</span>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{business.phone}</span>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{business.email}</span>
                    </div>
                  )}
                  {business.website && (
                     <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{business.website}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleEditBusiness(business.id)}
                >
                  Manage Business Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
