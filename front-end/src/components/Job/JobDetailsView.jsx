import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  fetchJobDetails, 
  selectJobById,
  selectJobsLoadingState,
  clearCurrentJob  
} from '../../store/slices/jobSlice';
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
  Box
} from 'lucide-react';

// Import form components
import JobExpenseForm from './JobExpenseForm';
import JobMaterialsForm from './JobMaterialsForm';
import JobProgressForm from './JobProgressForm';
import JobTimeframeForm from './JobTimeframeForm';

const JobDetailsView = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  
  // Improved selectors usage
  const job = useSelector(state => selectJobById(state, parseInt(jobId)));
  const loadingState = useSelector(state => 
    selectJobsLoadingState(state).fetchJobDetails
  );

  // Modal states
  const [activeModal, setActiveModal] = useState(null);

  // Fetch job details if not available
  useEffect(() => {
    if (jobId && !job) {
      dispatch(fetchJobDetails(parseInt(jobId)));
    }
  }, [jobId, dispatch, job]);

  // Handle modal state
  const handleModalOpen = (modalName) => setActiveModal(modalName);
  const handleModalClose = () => setActiveModal(null);

  // Loading state handler
  if (loadingState === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-lg">Loading job details...</div>
      </div>
    );
  }

  // Error state handler
  if (!job) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">No job details available</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
              <p className="font-medium">{job.client?.name || 'N/A'}</p>
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
              <JobTimeframeForm jobId={jobId} onClose={handleModalClose} />
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
