import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Shared/Sidebar/Sidebar';
import ErrorBoundary from './components/Shared/ErrorBoundary';
import ToastNotification from './components/Notifications/ToastNotification';
import Dashboard from './pages/Dashboard';
import MaterialManagement from './pages/MaterialManagement';
import MachineUsage from './pages/MachineUsage';
import JobTracking from './pages/JobTracking';
import Reports from './pages/Reports';
import CreateJob from './pages/CreateJob';
import JobDetails from './pages/JobDetails';

const App = () => (
  <Router>
    <ErrorBoundary>
      <div className="flex">
        {/* Toast notifications will be rendered on top of everything */}
        <ToastNotification />
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Sidebar />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="materials" element={<MaterialManagement />} />
              <Route path="jobs" element={<JobTracking />} />
              <Route path="/jobs/:jobId/job-details" element={<JobDetails />} />
              <Route path="machine-usage" element={<MachineUsage />} />
              <Route path="reports" element={<Reports />} />
              <Route path="create-job" element={<CreateJob />} />
            </Route>
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  </Router>
);

export default App;