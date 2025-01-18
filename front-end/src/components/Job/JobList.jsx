import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchJobs, 
  selectAllJobs,
  selectJobsPagination, 
  selectJobsLoadingState,
  selectJobFilters,
  setFilters
} from '../../store/slices/jobSlice';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, MoreHorizontal, Eye, Pencil, Trash } from 'lucide-react';

const JobsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors
  const jobs = useSelector(selectAllJobs);
  const pagination = useSelector(selectJobsPagination);
  const loadingState = useSelector(selectJobsLoadingState);
  const filters = useSelector(selectJobFilters);
  const error = useSelector(state => state.jobs.errors.fetchJobs);

  useEffect(() => {
    dispatch(fetchJobs({ 
      page: pagination.currentPage, 
      limit: pagination.itemsPerPage,
      ...filters 
    }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters]);

  // Handlers
  const handleFilterChange = useCallback((key, value) => {
    dispatch(setFilters({ [key]: value }));
  }, [dispatch]);

  const handleViewJob = useCallback((jobId) => {
    navigate(`/jobs/${jobId}/job-details`);
  }, [navigate]);

  const handlePreviousPage = useCallback(() => {
    dispatch(fetchJobs({ 
      page: pagination.currentPage - 1,
      limit: pagination.itemsPerPage,
      ...filters 
    }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters]);

  const handleNextPage = useCallback(() => {
    dispatch(fetchJobs({ 
      page: pagination.currentPage + 1,
      limit: pagination.itemsPerPage,
      ...filters 
    }));
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage, filters]);

  // Memoize status color mapping
  const getStatusColor = useCallback((status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Jobs List</CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <Select
            value={filters.jobType || 'all'}
            onValueChange={(value) => handleFilterChange('jobType', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="in_house">In-House</SelectItem>
              <SelectItem value="outsourced">Outsourced</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.progressStatus || 'all'}
            onValueChange={(value) => handleFilterChange('progressStatus', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-[180px]"
          />
          <Input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-[180px]"
          />
        </div>
      </CardHeader>

      <CardContent>
        {loadingState.fetchJobs === 'loading' ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 border border-red-200 rounded-md bg-red-50">
            <h4 className="text-red-800 font-medium mb-2">Error Loading Jobs</h4>
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => {
                dispatch(fetchJobs({ 
                  page: pagination.currentPage,
                  limit: pagination.itemsPerPage,
                  ...filters 
                }));
              }}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.id}</TableCell>
                    <TableCell>{job.client_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {job.job_type === 'in_house' ? 'In-House' : 'Outsourced'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(job.progress_status)}>
                        {job.progress_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.created_at ? format(new Date(job.created_at), 'MMM dd, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>{job.payment_status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewJob(job.id)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/jobs/${job.id}/edit`)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this job?')) {
                                // Add delete functionality
                              }
                            }}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {jobs.length} of {pagination.totalItems} jobs
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === 1}
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default JobsList;
