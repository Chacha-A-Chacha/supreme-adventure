import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { 
  selectNotification as selectJobNotification, 
  clearNotification as clearJobNotification 
} from '@/store/slices/jobSlice';
import { 
  clearNotification as clearMaterialNotification 
} from '@/store/slices/materialSlice';
import {
  selectMachineNotifications,
  clearNotification as clearMachineNotification
} from '@/store/slices/machineSlice';

const ToastNotification = () => {
  const dispatch = useDispatch();
  const jobNotification = useSelector(selectJobNotification);
  const materialNotification = useSelector(state => state.materials.notifications);
  const machineNotification = useSelector(selectMachineNotifications);
  
  // Use the first active notification (job, material, or machine)
  const notification = 
    jobNotification.message ? jobNotification : 
    materialNotification.message ? materialNotification :
    machineNotification.message ? machineNotification : null;
  
  useEffect(() => {
    if (notification?.message) {
      const timer = setTimeout(() => {
        // Clear all notifications to ensure sync
        dispatch(clearJobNotification());
        dispatch(clearMaterialNotification());
        dispatch(clearMachineNotification());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);
  
  if (!notification?.message) return null;
  
  const variants = {
    success: {
      variant: 'default',
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      title: 'Success'
    },
    error: {
      variant: 'destructive',
      icon: <AlertCircle className="h-4 w-4" />,
      title: 'Error'
    },
    info: {
      variant: 'default',
      icon: <Info className="h-4 w-4 text-blue-500" />,
      title: 'Info'
    }
  };

  const renderMaterialUsage = (item) => {
    if (!item) return null;
    return (
      <div className="text-gray-600">
        {item.material?.name && <span>Material: {item.material.name}</span>}
        {item.quantity_used && <span> - {item.quantity_used}m used</span>}
        {item.wastage && <span> - Wastage: {item.wastage}m</span>}
        {item.remaining_stock && <span> (Stock remaining: {item.remaining_stock}m)</span>}
      </div>
    );
  };

  const renderMachineReading = (reading) => {
    if (!reading) return null;
    return (
      <div className="text-gray-600">
        {reading.machine_name && <span>Machine: {reading.machine_name}</span>}
        {reading.start_meter && reading.end_meter && (
          <span> - Usage: {(reading.end_meter - reading.start_meter).toFixed(2)}m</span>
        )}
      </div>
    );
  };
  
  const renderNotificationData = () => {
    const { data } = notification;
    if (!data) return null;

    // Skip data display for read operations
    if (notification.message?.toLowerCase().includes('fetch')) {
      return null;
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <div key={item.id || index}>
          {item.material_id ? renderMaterialUsage(item) : null}
          {item.machine_id ? renderMachineReading(item) : null}
        </div>
      ));
    }

    // Handle single items
    if (data.material_id) {
      return renderMaterialUsage(data);
    }

    if (data.machine_id) {
      return renderMachineReading(data);
    }

    return null;
  };
  
  const { variant, icon, title } = variants[notification.type] || variants.info;
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-top-2">
      <Alert variant={variant}>
        <div className="flex items-start gap-4">
          {icon}
          <div className="flex-1">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
              <div>{notification.message}</div>
              {notification.type === 'success' && notification.data && (
                <div className="mt-2 text-sm space-y-1">
                  {renderNotificationData()}
                </div>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default ToastNotification;