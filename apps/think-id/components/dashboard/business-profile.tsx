"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@think-id/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@think-id/ui/components/ui/card";
import { Badge } from "@think-id/ui/components/ui/badge";
import { Skeleton } from "@think-id/ui/components/ui/skeleton";
import { Separator } from "@think-id/ui/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ArrowLeft,
  Edit,
  Building2,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { Business } from "@prisma/client";

interface BusinessProfileProps {
  businessId: string;
  onBack: () => void;
}

export function BusinessProfile({ businessId, onBack }: BusinessProfileProps) {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/businesses?id=${businessId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch business details");
        }

        const data = await response.json();
        setBusiness(data.business);
      } catch (err) {
        console.error("Error loading business:", err);
        setError("Failed to load business details.");
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  const handleEdit = () => {
    router.push(`/onboarding?id=${businessId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-muted-foreground mb-4">{error || "Business not found"}</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  // Helper to format schedule
  const formatSchedule = (schedule: any) => {
    if (!schedule) return "Not set";
    // Check if it's the new complex format
    if (typeof schedule === 'object' && ('monday' in schedule || 'saturday' in schedule)) {
       return "Custom Schedule";
    }
    return JSON.stringify(schedule); // Fallback
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Business
        </Button>
      </div>

      {/* Main Busines Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="h-24 w-24 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <Building2 className="h-12 w-12" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
            <Badge variant={business.status === 'active' ? 'default' : 'secondary'}>
              {business.status || 'Pending'}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">{business.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground pt-2">
            <Badge variant="outline">{business.category}</Badge>
            <Badge variant="outline">{business.offeringType}</Badge>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{business.email}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Phone</span>
               <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{business.phone}</span>
              </div>
            </div>
            {business.website && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Website</span>
                 <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a href={business.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                    {business.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Address</span>
              <p>{business.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">County</span>
                <p>{business.county}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Sub-County</span>
                <p>{business.subCounty}</p>
              </div>
            </div>
             <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Country</span>
                <p>{business.country}</p>
              </div>
          </CardContent>
        </Card>

        {/* Operating Hours & Payment */}
        <Card className="lg:col-span-1 md:col-span-2">
           <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Operations & Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Payment Status
                   </span>
                   <Badge variant={business.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                      {business.paymentStatus || 'Pending'}
                   </Badge>
                </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Created On
                   </span>
                   <span className="text-sm">
                      {new Date(business.createdAt).toLocaleDateString()}
                   </span>
                </div>
            </div>
            
            <Separator />
            
            <div>
               <span className="text-sm font-medium text-muted-foreground mb-2 block">Schedule Overview</span>
               {/* Simple view for now, complex view can be added later */}
                <div className="text-sm space-y-1">
                   {business.weekdaySchedule ? (
                      <div className="flex justify-between">
                         <span>Weekdays</span>
                         <span className="font-medium">Open</span>
                      </div>
                   ) : null}
                   {business.weekendSchedule ? (
                       <div className="flex justify-between">
                         <span>Weekends</span>
                         <span className="font-medium">Varies</span>
                      </div>
                   ) : null}
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
