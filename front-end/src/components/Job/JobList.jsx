import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, selectAllJobs, selectJobsPagination, selectJobsLoadingState } from '../../store/slices/jobsSlice';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const JobsList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const pagination = useSelector(selectJobsPagination);
  const loadingState = useSelector(selectJobsLoadingState);
  
  const [filters, setFilters] = useState({
    jobType: '',
    progressStatus: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    dispatch(fetchJobs({ page: pagination.currentPage }));
  }, [dispatch, pagination.currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredJobs = jobs.filter(job => {
    return (
      (!filters.jobType || job.job_type === filters.jobType) &&
      (!filters.progressStatus || job.progress_status === filters.progressStatus) &&
      (!filters.startDate || new Date(job.created_at) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(job.created_at) <= new Date(filters.endDate))
    );
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Jobs List</CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <Select
            value={filters.jobType}
            onValueChange={(value) => handleFilterChange('jobType', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="in_house">In-House</SelectItem>
              <SelectItem value="outsourced">Outsourced</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.progressStatus}
            onValueChange={(value) => handleFilterChange('progressStatus', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-[180px]"
          />
          <Input
            type="date"
            value={filters.endDate}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
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
                      {format(new Date(job.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{job.payment_status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === 1}
                  onClick={() => 
                    dispatch(fetchJobs({ page: pagination.currentPage - 1 }))
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => 
                    dispatch(fetchJobs({ page: pagination.currentPage + 1 }))
                  }
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
