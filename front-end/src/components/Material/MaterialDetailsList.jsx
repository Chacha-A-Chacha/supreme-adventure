import React from 'react';
import { MoreHorizontal, AlertCircle, Loader2, PackagePlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MaterialDetailsList = ({ 
  materials = [], 
  loadingState,
  error,
  errorDetails,
  onUpdate,
  onDelete,
  onRestock,
  onRetry,
  dispatch,
  fetchMaterials
}) => {
  if (loadingState === 'loading') {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <h4 className="text-red-800 font-medium mb-2">Error Loading Materials</h4>
        <p className="text-red-600 mb-2">{error}</p>
        {errorDetails && (
          <div className="text-sm text-red-500">
            <p>Status: {errorDetails.status}</p>
            <p>Endpoint: {errorDetails.endpoint}</p>
            <p>Method: {errorDetails.method}</p>
            {errorDetails.params && (
              <p>Parameters: {JSON.stringify(errorDetails.params)}</p>
            )}
          </div>
        )}
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => {
            if (onRetry) {
              onRetry();
            } else if (dispatch && fetchMaterials) {
              dispatch(fetchMaterials());
            }
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!Array.isArray(materials) || materials.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No materials found. Add some materials to get started.
        </AlertDescription>
      </Alert>
    );
  }

  const getStockStatus = (material) => {
    const ratio = material.stock_level / material.min_threshold;
    if (ratio <= 1) return 'destructive';
    if (ratio <= 1.5) return 'warning';
    return 'success';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold">Materials Inventory</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A list of all materials including their details, stock levels, and supplier information.
          </p>
        </div>
      </div>
      
      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name & Details</TableHead>
              <TableHead>Supplier Info</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="py-4">
                  <div>
                    <div className="font-medium">{material.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {material.material_code} • {material.category}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    <div>{material.supplier?.name}</div>
                    <div className="text-muted-foreground mt-1">
                      Last updated: {formatDate(material.updated_at)}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={getStockStatus(material)}>
                      {material.stock_level} {material.unit_of_measure}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Min: {material.min_threshold} {material.unit_of_measure}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    <div>Type: {material.type}</div>
                    {material.specifications && (
                      <div className="text-muted-foreground mt-1">
                        {Object.entries(material.specifications)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => onRestock(material)}>
                        <PackagePlus className="size-4 mr-2" />
                        Restock
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdate(material)}>
                        <span className="mr-2">✏️</span>
                        Update
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(material)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <span className="mr-2">🗑️</span>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaterialDetailsList;
