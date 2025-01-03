import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { selectJobById, fetchJobDetails, selectJobsLoadingState } from '../../store/slices/jobSlice';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Briefcase, 
  User, 
  FileText,
  Box,
  Loader2
} from 'lucide-react';

// Import form components
import JobExpenseForm from './JobExpenseForm';
import JobMaterialsForm from './JobMaterialsForm';
import JobProgressForm from './JobProgressForm';
import JobTimeframeForm from './JobTimeframeForm';
import { use } from 'react';

const JobDetailsView = ({ jobId }) => {
  const dispatch = useDispatch();
  const numericJobId = Number(jobId);
  console.log('Job ID:', numericJobId);
  
  // Improved selectors usage
  const job = useSelector(state => selectJobById(state, numericJobId));
  console.log('Job Data:', job);
  
  const loadingState = useSelector(state => 
    selectJobsLoadingState(state).fetchJobDetails
  );
  console.log('Loading State:', loadingState);

  // Modal states
  const [activeModal, setActiveModal] = useState(null);

  // Handle modal state
  const handleModalOpen = (modalName) => setActiveModal(modalName);
  const handleModalClose = () => setActiveModal(null);

  // Fetch job details if not available
  useEffect(() => {
    if (numericJobId) {
      dispatch(fetchJobDetails(numericJobId));
    }
  }, [numericJobId, dispatch]);

  // Loading and error state handler
  if (loadingState === 'loading') {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (loadingState === 'failed') {
    const error = useSelector(state => state.jobs.errors.fetchJobDetails);
      return (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <h4 className="text-red-800 font-medium mb-2">Error Loading Job Details</h4>
          <p className="text-red-600 mb-2">{error?.message || 'Unknown error occurred'}</p>
          {error?.status && (
            <div className="text-sm text-red-500">
              <p>Status: {error.status}</p>
              {error.endpoint && <p>Endpoint: {error.endpoint}</p>}
              {error.method && <p>Method: {error.method}</p>}
            </div>
          )}
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => dispatch(fetchJobDetails(numericJobId))}
          >
            Retry
          </Button>
        </div>
      );
  }

  if (!job || Object.keys(job).length === 0) {
    return (
      <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50">
        <h4 className="text-yellow-800 font-medium">No Job Details Available</h4>
        <p className="text-yellow-600">The requested job details could not be found.</p>
      </div>
    );
  }

  // Ensure job data is properly structured
  const safeJob = {
    ...job,
    client: job.client || {},
    expenses: job.expenses || [],
    materials: job.materials || []
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

    return (
    <div className="p-6 space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{safeJob.client.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{job.client?.phone_number || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium capitalize">{job.job_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{job.progress_status || 'N/A'}</p>
            </div>
            {job.job_type === 'outsourced' && job.vendor_name && (
              <div>
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="font-medium">{job.vendor_name}</p>
              </div>
            )}
            {job.cancelled_at && (
              <div>
                <p className="text-sm text-gray-500">Cancelled On</p>
                <p className="font-medium">{formatDate(job.cancelled_at)}</p>
              </div>
            )}
            {job.cancellation_reason && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Cancellation Reason</p>
                <p className="font-medium">{job.cancellation_reason}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{job.description || 'No description available'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">{formatCurrency(job.total_amount || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="font-medium">{formatCurrency(job.amount_paid || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className="font-medium capitalize">{job.payment_status || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="font-medium">{formatCurrency(job.total_cost || 0)}</p>
            </div>
            {job.total_profit !== null && (
              <div>
                <p className="text-sm text-gray-500">Total Profit</p>
                <p className="font-medium">{formatCurrency(job.total_profit)}</p>
              </div>
            )}
            {job.pricing_per_unit > 0 && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Price Per Unit</p>
                  <p className="font-medium">{formatCurrency(job.pricing_per_unit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendor Cost Per Unit</p>
                  <p className="font-medium">{formatCurrency(job.vendor_cost_per_unit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Units</p>
                  <p className="font-medium">{job.total_units}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Expenses
          </CardTitle>
          <Dialog open={activeModal === 'expense'} onOpenChange={(open) => open ? handleModalOpen('expense') : handleModalClose()}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <JobExpenseForm jobId={jobId} onClose={handleModalClose} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {job.expenses?.length > 0 ? (
              job.expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(expense.cost)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">No expenses recorded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
          <Dialog open={activeModal === 'timeframe'} onOpenChange={(open) => open ? handleModalOpen('timeframe') : handleModalClose()}>
            <DialogTrigger asChild>
              <Button variant="outline">Update Timeline</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Job Timeline</DialogTitle>
              </DialogHeader>
              <JobTimeframeForm jobId={jobId} start={job.start_date} end={job.end_date} onClose={handleModalClose} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{job.start_date ? formatDate(job.start_date) : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{job.end_date ? formatDate(job.end_date) : 'Not set'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Materials
          </CardTitle>
          <Dialog 
            open={activeModal === 'materials'} 
            onOpenChange={(open) => open ? handleModalOpen('materials') : handleModalClose()}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Add Materials</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Materials</DialogTitle>
              </DialogHeader>
              <JobMaterialsForm jobId={jobId} onClose={handleModalClose} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {job.materials?.length > 0 ? (
              job.materials.map((material) => (
                <div key={material.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{material.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {material.quantity} {material.unit}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(material.cost)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center">No materials recorded</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Progress
          </CardTitle>
          <Dialog open={activeModal === 'progress'} onOpenChange={(open) => open ? handleModalOpen('progress') : handleModalClose()}>
            <DialogTrigger asChild>
              <Button variant="outline">Update Progress</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Job Progress</DialogTitle>
              </DialogHeader>
              <JobProgressForm jobId={jobId} onClose={handleModalClose} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="font-medium capitalize">{job.progress_status || 'Not started'}</p>
            {job.completed_at && (
              <p className="text-sm text-gray-500">
                Completed on: {formatDate(job.completed_at)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsView;
