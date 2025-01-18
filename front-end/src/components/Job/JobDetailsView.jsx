import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCurrentJob, 
  selectJobsLoadingState, 
  selectJobsErrors,
  fetchJobDetails,
  clearNotification 
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
  Box,
  Loader2
} from 'lucide-react';

// Import form components
import JobExpenseForm from './JobExpenseForm';
import JobMaterialsForm from './JobMaterialsForm';
import JobProgressForm from './JobProgressForm';
import JobTimeframeForm from './JobTimeframeForm';

const JobDetailsView = ({ jobId }) => {
  const dispatch = useDispatch();
  const numericJobId = Number(jobId);
  
  // Redux state selectors
  const job = useSelector(selectCurrentJob);
  const loadingStates = useSelector(selectJobsLoadingState);
  const error = useSelector(selectJobsErrors);
  const loadingState = loadingStates.fetchJobDetails;
  
  // Local state for modals
  const [activeModal, setActiveModal] = useState(null);

  // Debug logging for job data
  useEffect(() => {
    if (job) {
      console.log('Job Data Updated:', {
        id: job.id,
        hasClient: !!job.client,
        clientName: job.client?.name,
        hasExpenses: job.expenses?.length > 0,
        hasMaterials: job.materials?.length > 0,
        financialData: {
          totalAmount: job.total_amount,
          amountPaid: job.amount_paid,
          totalCost: job.total_cost,
        }
      });
    }
  }, [job]);

  // Fetch job details if needed
  useEffect(() => {
    if (numericJobId && (!job || job.id !== numericJobId)) {
      dispatch(fetchJobDetails(numericJobId));
    }
  }, [numericJobId, job, dispatch]);

  // Modal handlers
  const handleModalOpen = (modalName) => setActiveModal(modalName);
  const handleModalClose = () => setActiveModal(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES'
    }).format(amount ?? 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loadingState === 'loading') {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (loadingState === 'failed') {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <h4 className="text-red-800 font-medium mb-2">Error Loading Job Details</h4>
        <p className="text-red-600 mb-2">{error || 'An error occurred while loading job details'}</p>
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

  // No job data state
  if (!job) {
    return (
      <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50">
        <h4 className="text-yellow-800 font-medium">No Job Details Available</h4>
        <p className="text-yellow-600">The requested job details could not be found.</p>
      </div>
    );
  }

  // Ensure job data is properly structured with defaults
  const safeJob = {
    ...job,
    client: job.client || {},
    expenses: job.expenses || [],
    materials: job.materials || [],
    material_usages: job.material_usages || [],
    total_amount: job.total_amount ?? 0,
    amount_paid: job.amount_paid ?? 0,
    total_cost: job.total_cost ?? 0,
    total_profit: job.total_profit ?? 0,
    vendor_cost_per_unit: job.vendor_cost_per_unit ?? 0,
    pricing_per_unit: job.pricing_per_unit ?? 0,
    total_units: job.total_units ?? 0
  };

  const renderMaterialsSection = () => {
    if (!safeJob.job_type || safeJob.job_type !== 'in_house') return null;

    return (
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
              <Button 
                variant="outline"
                disabled={loadingStates.addJobMaterials === 'loading'}
              >
                {loadingStates.addJobMaterials === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Add Materials
              </Button>
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
            {safeJob.material_usages.length > 0 ? (
              safeJob.material_usages.map((material) => (
                <div key={material.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{material.material?.name || 'Unknown Material'}</p>
                    <p className="text-sm text-gray-500">
                      Usage: {material.quantity_used || 0} {material.unit_of_measure || 'units'}
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
    );
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
              <p className="font-medium">
                {safeJob.client?.name || safeJob.client_name || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">
                {safeJob.client?.phone_number || 'Not provided'}
              </p>
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
              <p className="font-medium capitalize">
                {safeJob.job_type?.replace('_', ' ') || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">
                {safeJob.progress_status?.replace('_', ' ') || 'Not specified'}
              </p>
            </div>
            {safeJob.job_type === 'outsourced' && safeJob.vendor_name && (
              <div>
                <p className="text-sm text-gray-500">Vendor</p>
                <p className="font-medium">{safeJob.vendor_name}</p>
              </div>
            )}
            {safeJob.cancelled_at && (
              <div>
                <p className="text-sm text-gray-500">Cancelled On</p>
                <p className="font-medium">{formatDate(safeJob.cancelled_at)}</p>
              </div>
            )}
            {safeJob.cancellation_reason && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Cancellation Reason</p>
                <p className="font-medium">{safeJob.cancellation_reason}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{safeJob.description || 'No description available'}</p>
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
              <p className="font-medium">{formatCurrency(safeJob.total_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="font-medium">{formatCurrency(safeJob.amount_paid)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className="font-medium capitalize">
                {safeJob.payment_status?.replace('_', ' ') || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="font-medium">{formatCurrency(safeJob.total_cost)}</p>
            </div>
            {safeJob.total_profit !== null && (
              <div>
                <p className="text-sm text-gray-500">Total Profit</p>
                <p className="font-medium">{formatCurrency(safeJob.total_profit)}</p>
              </div>
            )}
            {safeJob.pricing_per_unit > 0 && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Price Per Unit</p>
                  <p className="font-medium">{formatCurrency(safeJob.pricing_per_unit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendor Cost Per Unit</p>
                  <p className="font-medium">{formatCurrency(safeJob.vendor_cost_per_unit)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Units</p>
                  <p className="font-medium">{safeJob.total_units}</p>
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
          <Dialog 
            open={activeModal === 'expense'} 
            onOpenChange={(open) => open ? handleModalOpen('expense') : handleModalClose()}
          >
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                disabled={loadingStates.addJobExpenses === 'loading'}
              >
                {loadingStates.addJobExpenses === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Add Expense
              </Button>
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
            {safeJob.expenses.length > 0 ? (
              safeJob.expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{expense.name || 'Unnamed Expense'}</p>
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
          <Dialog 
            open={activeModal === 'timeframe'} 
            onOpenChange={(open) => open ? handleModalOpen('timeframe') : handleModalClose()}
          >
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                disabled={loadingStates.updateJobTimeframe === 'loading'}
              >
                {loadingStates.updateJobTimeframe === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Update Timeline
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Job Timeline</DialogTitle>
              </DialogHeader>
              <JobTimeframeForm 
                jobId={jobId} 
                start={safeJob.start_date} 
                end={safeJob.end_date} 
                onClose={handleModalClose} 
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{formatDate(safeJob.start_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{formatDate(safeJob.end_date)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Section - Only render for in-house jobs */}
      {renderMaterialsSection()}

      {/* Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Progress
          </CardTitle>
          <Dialog 
            open={activeModal === 'progress'} 
            onOpenChange={(open) => open ? handleModalOpen('progress') : handleModalClose()}
          >
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                disabled={loadingStates.updateJobProgress === 'loading'}
              >
                {loadingStates.updateJobProgress === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Update Progress
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Job Progress</DialogTitle>
              </DialogHeader>
              <JobProgressForm 
                jobId={jobId} 
                currentStatus={safeJob.progress_status}
                onClose={handleModalClose} 
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="font-medium capitalize">
              {safeJob.progress_status?.replace('_', ' ') || 'Not started'}
            </p>
            {safeJob.completed_at && (
              <p className="text-sm text-gray-500">
                Completed on: {formatDate(safeJob.completed_at)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

JobDetailsView.propTypes = {
  jobId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};

export default JobDetailsView;