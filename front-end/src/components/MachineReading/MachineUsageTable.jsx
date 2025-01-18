import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPaginatedReadings,
  selectMachineReadings,
  selectMachinePagination,
  selectMachinesLoadingState,
  setPagination
} from '../../store/slices/machineSlice';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

const MachineUsageTable = () => {
  const dispatch = useDispatch();
  const readings = useSelector(selectMachineReadings);
  const pagination = useSelector(selectMachinePagination);
  const loading = useSelector(selectMachinesLoadingState);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchPaginatedReadings({ 
      page: pagination.currentPage, 
      per_page: pagination.itemsPerPage 
    }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ currentPage: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateUsage = (start, end) => {
    return (end - start).toFixed(2);
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between px-2">
      <div className="flex w-[100px] items-center justify-start text-sm font-medium">
        Page {pagination.currentPage} of {pagination.totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage <= 1 || loading === 'loading'}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages || loading === 'loading'}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-[100px] text-sm text-muted-foreground">
        {pagination.totalItems} total records
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Machine Usage History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading === 'loading' ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Job ID</TableHead>
                    <TableHead className="text-right">Start Meter</TableHead>
                    <TableHead className="text-right">End Meter</TableHead>
                    <TableHead className="text-right">Usage (m)</TableHead>
                    <TableHead>Operator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readings.map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(reading.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{reading.machine_name}</div>
                      </TableCell>
                      <TableCell>#{reading.job_id}</TableCell>
                      <TableCell className="text-right">
                        {reading.start_meter.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {reading.end_meter.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {calculateUsage(reading.start_meter, reading.end_meter)}
                      </TableCell>
                      <TableCell>{reading.operator_name || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                  {readings.length === 0 && (
                    <TableRow>
                      <TableCell 
                        colSpan={7} 
                        className="h-24 text-center text-muted-foreground"
                      >
                        No machine readings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              {renderPagination()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MachineUsageTable;