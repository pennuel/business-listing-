"use client"

import { useState } from "react"
import { Plus, Package, Edit, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceDialog } from "./service-dialog"
import { deleteService } from "@/app/actions/services"
import { toast } from "sonner"

interface ServiceListProps {
  businessId: string
  services: any[]
}

export function ServicesList({ businessId, services }: ServiceListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)

  const handleEdit = (service: any) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this service from your shelves?")) {
      const result = await deleteService(id)
      if (result.success) {
        toast.success("Service removed from shelves")
      } else {
        toast.error("Failed to remove service")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">The Shelves</h2>
          <p className="text-muted-foreground">Manage the services you are offering to customers.</p>
        </div>
        <Button onClick={() => { setEditingService(null); setIsDialogOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      {services.length > 0 ? (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{service.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {service.duration} mins
                        </span>
                        <span>•</span>
                        <span>{service.description || "No description"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Price</div>
                      <div className="text-xl font-black text-primary">
                        {service.currency} {Number(service.price).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-bold">Your shelves are empty</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't added any services yet. Add your first service to show customers what you're selling.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Your First Service
            </Button>
          </CardContent>
        </Card>
      )}

      <ServiceDialog 
        businessId={businessId}
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        service={editingService}
      />
    </div>
  )
}
