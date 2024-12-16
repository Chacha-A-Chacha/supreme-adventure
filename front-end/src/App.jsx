import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Shared/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard';
import MaterialManagement from './pages/MaterialManagement';
import JobTracking from './pages/JobTracking';
import Reports from './pages/Reports';

const App = () => (
  <Router>
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materials" element={<MaterialManagement />} />
          <Route path="/jobs" element={<JobTracking />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  </Router>
);

export default App;
