import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  fetchJobDetails, 
  selectJobById,
  updateJob, 
  addJobExpenses, 
  updateJobProgress,
  updateJobTimeframe 
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
import { Calendar, Clock, DollarSign, Briefcase, User, Phone, FileText } from 'lucide-react';

const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const job = useSelector(state => selectJobById(state, parseInt(jobId)));
  const [expenseModal, setExpenseModal] = useState(false);
  const [progressModal, setProgressModal] = useState(false);
  const [timeframeModal, setTimeframeModal] = useState(false);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobDetails(parseInt(jobId)));
    }
  }, [jobId, dispatch]);

  if (!job) {
    return <div className="p-4">Loading...</div>;
  }

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
              <p className="font-medium">{job.client?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{job.client?.phone_number}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Details */}
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
              <p className="font-medium capitalize">{job.job_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{job.progress_status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{job.description}</p>
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
              <p className="font-medium">${job.total_amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="font-medium">${job.amount_paid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className="font-medium">{job.payment_status}</p>
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
          <Dialog open={expenseModal} onOpenChange={setExpenseModal}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <ExpenseForm jobId={jobId} onClose={() => setExpenseModal(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {job.expenses?.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{expense.name}</p>
                  <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <p className="font-medium">${expense.cost}</p>
              </div>
            ))}
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
          <Dialog open={timeframeModal} onOpenChange={setTimeframeModal}>
            <DialogTrigger asChild>
              <Button variant="outline">Update Timeline</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Job Timeline</DialogTitle>
              </DialogHeader>
              <TimeframeForm jobId={jobId} onClose={() => setTimeframeModal(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{new Date(job.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{new Date(job.end_date).toLocaleDateString()}</p>
            </div>
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
          <Dialog open={progressModal} onOpenChange={setProgressModal}>
            <DialogTrigger asChild>
              <Button variant="outline">Update Progress</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Job Progress</DialogTitle>
              </DialogHeader>
              <ProgressForm jobId={jobId} onClose={() => setProgressModal(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="font-medium capitalize">{job.progress_status}</p>
            {job.completed_at && (
              <p className="text-sm text-gray-500">
                Completed on: {new Date(job.completed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      // Add this new Card section to the JobDetails component
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Materials
          </CardTitle>
          <Dialog open={materialsModal} onOpenChange={setMaterialsModal}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Materials</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Job Materials</DialogTitle>
              </DialogHeader>
              <MaterialsForm jobId={jobId} onClose={() => setMaterialsModal(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {job.materials?.map((material) => (
              <div key={material.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Material #{material.material_id}</p>
                  <p className="text-sm text-gray-500">Usage: {material.usage_meters} meters</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;