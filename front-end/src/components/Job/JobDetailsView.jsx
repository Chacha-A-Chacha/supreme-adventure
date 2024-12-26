import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  fetchJobDetails, 
  selectJobById,
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

// Import all form components
import JobExpenseForm from './JobExpenseForm';
import JobMaterialsForm from './JobMaterialsForm';
import JobProgressForm from './JobProgressForm';
import JobTimeframeForm from './JobTimeframeForm';

// Modal configuration object
const MODAL_CONFIGS = {
  expense: {
    title: 'Add New Expense',
    Component: JobExpenseForm,
    icon: FileText
  },
  materials: {
    title: 'Add Job Materials',
    Component: JobMaterialsForm,
    icon: Box
  },
  progress: {
    title: 'Update Job Progress',
    Component: JobProgressForm,
    icon: Clock
  },
  timeframe: {
    title: 'Update Job Timeline',
    Component: JobTimeframeForm,
    icon: Calendar
  }
};

// Modal wrapper component
const FormModal = ({ isOpen, onClose, type, jobId }) => {
  const config = MODAL_CONFIGS[type];
  const FormComponent = config.Component;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <FormComponent jobId={jobId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const job = useSelector(state => selectJobById(state, parseInt(jobId)));
  
  // Single state object for all modals
  const [modals, setModals] = useState({
    expense: false,
    materials: false,
    progress: false,
    timeframe: false
  });

  // Single handler for all modals
  const handleModal = (modalType, isOpen) => {
    setModals(prev => ({
      ...prev,
      [modalType]: isOpen
    }));
  };

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobDetails(parseInt(jobId)));
    }
  }, [jobId, dispatch]);

  if (!job) {
    return <div className="p-4">Loading...</div>;
  }

  // Reusable card section component
  const CardSection = ({ title, icon: Icon, children, modalType }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        {modalType && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => handleModal(modalType, true)}
              >
                {`${modalType === 'materials' ? 'Add' : 'Update'} ${title}`}
              </Button>
            </DialogTrigger>
            <FormModal
              isOpen={modals[modalType]}
              onClose={() => handleModal(modalType, false)}
              type={modalType}
              jobId={jobId}
            />
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Client Information */}
      <CardSection title="Client Information" icon={User}>
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
      </CardSection>

      {/* Render modals */}
      {Object.entries(modals).map(([type, isOpen]) => (
        isOpen && (
          <FormModal
            key={type}
            type={type}
            isOpen={isOpen}
            onClose={() => handleModal(type, false)}
            jobId={jobId}
          />
        )
      ))}

      {/* Job Information */}
      <CardSection title="Job Information" icon={Briefcase}>
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
      </CardSection>

      {/* Financial Information */}
      <CardSection title="Financial Details" icon={DollarSign}>
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
      </CardSection>

      {/* Expenses Section */}
      <CardSection title="Expenses" icon={FileText} modalType="expense">
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
      </CardSection>

      {/* Timeline */}
      <CardSection title="Timeline" icon={Calendar} modalType="timeframe">
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
      </CardSection>

      {/* Progress */}
      <CardSection title="Progress" icon={Clock} modalType="progress">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Current Status</p>
          <p className="font-medium capitalize">{job.progress_status}</p>
          {job.completed_at && (
            <p className="text-sm text-gray-500">
              Completed on: {new Date(job.completed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardSection>

      {/* Materials */}
      <CardSection title="Materials" icon={Box} modalType="materials">
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
      </CardSection>
    </div>
  );
};

export default JobDetails;
