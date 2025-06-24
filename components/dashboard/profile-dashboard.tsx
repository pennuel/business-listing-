"use client";

import { useState, useCallback } from "react";
import { AppSidebar } from "../sidebar/app-sidebar";
import { DashboardContent } from "./dashboard-content";
import { ProfilePage } from "../profile/profile-page";
import { ApplicationsPage } from "../applications/applications-page";
import { SecurityPage } from "../settings/security-page";
import { BillingPage } from "../settings/billing/billing-page";
import { AccountSettingsPage } from "../settings/account-settings/account-settings-page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProfileEditPage } from "../profile/profile-edit-page";
import { ApplicationDetailPage } from "../applications/application-detail-page";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
// Add these imports at the top
import { ApplicationGroupBillingPage } from "../settings/billing/application-group-billing-page";
import { ApplicationBillingManagementPage } from "../settings/billing/application-billing-management-page";

export default function ProfileDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  // Add these new state variables after the existing ones
  const [selectedBillingGroup, setSelectedBillingGroup] = useState<
    string | null
  >(null);
  const [selectedBillingApp, setSelectedBillingApp] = useState<string | null>(
    null
  );

  const handleApplicationsSelect = useCallback(() => {
    setSelectedCategory(undefined);
    setActiveSection("applications");
  }, []);

  const renderContent = () => {
    if (isEditingProfile) {
      return <ProfileEditPage onBack={() => setIsEditingProfile(false)} />;
    }

    if (selectedApplication) {
      return (
        <ApplicationDetailPage
          appKey={selectedApplication}
          onBack={() => setSelectedApplication(null)}
        />
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardContent 
            onApplicationsSelect={handleApplicationsSelect}
            onViewProfile={() => setActiveSection("profile")}
          />
        );
      case "profile":
        return (
          <ProfilePage
            onEditProfile={() => setIsEditingProfile(true)}
            onBack={() => setActiveSection("dashboard")}
          />
        );
      case "applications":
        return (
          <ApplicationsPage
            onApplicationSelect={setSelectedApplication}
            onBack={() => {
              setSelectedCategory(undefined);
              setActiveSection("dashboard");
            }}
            selectedCategory={selectedCategory}
          />
        );
      case "security":
        return <SecurityPage onBack={() => setActiveSection("dashboard")} />;
      // Update the billing case in the renderContent function
      case "billing":
        if (selectedBillingApp) {
          return (
            <ApplicationBillingManagementPage
              appKey={selectedBillingApp}
              onBack={() => setSelectedBillingApp(null)}
            />
          );
        }
        if (selectedBillingGroup) {
          return (
            <ApplicationGroupBillingPage
              category={selectedBillingGroup}
              onBack={() => setSelectedBillingGroup(null)}
              onApplicationSelect={setSelectedBillingApp}
            />
          );
        }
        return (
          <BillingPage onApplicationGroupSelect={setSelectedBillingGroup} />
        );
      case "account":
        return (
          <AccountSettingsPage onBack={() => setActiveSection("dashboard")} />
        );
      case "activity":
        return (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection("dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </div>
            <h1 className="text-2xl font-bold">Activity Page</h1>
            <p>Coming soon...</p>
          </div>
        );
      case "notifications":
        return (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection("dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </div>
            <h1 className="text-2xl font-bold">Notifications Page</h1>
            <p>Coming soon...</p>
          </div>
        );
      case "help":
        return (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSection("dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </div>
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <p>Coming soon...</p>
          </div>
        );
      default:
        // Handle individual application pages
        if (activeSection.startsWith("app-")) {
          return (
            <ApplicationDetailPage
              appKey={activeSection}
              onBack={() => setActiveSection("applications")}
            />
          );
        }
        return (
          <DashboardContent onApplicationsSelect={handleApplicationsSelect} />
        );
    }
  };

  const getSectionTitle = () => {
    if (selectedApplication || activeSection.startsWith("app-")) {
      const appKey = selectedApplication || activeSection;
      const appNames = {
        "app-analytics-pro": "Analytics Pro",
        "app-task-manager": "Task Manager Pro",
        "app-website-builder": "Website Builder",
        "app-code-editor": "Code Editor Plus",
        "app-mobile-app": "Mobile App Studio",
      };
      return appNames[appKey as keyof typeof appNames] || "Application";
    }

    switch (activeSection) {
      case "dashboard":
        return "Dashboard";
      case "profile":
        return "Profile";
      case "applications":
        return selectedCategory
          ? `Applications - ${
              selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)
            }`
          : "Applications";
      case "security":
        return "Security";
      case "billing":
        return "Billing";
      case "account":
        return "Account Settings";
      case "activity":
        return "Activity";
      case "notifications":
        return "Notifications";
      case "help":
        return "Help & Support";
      default:
        return "Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="#"
                    onClick={() => setActiveSection("dashboard")}
                  >
                    Profile
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getSectionTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {renderContent()}
      </SidebarInset>
    </SidebarProvider>
  );
}
