import React, { useState } from 'react';

const JobLogInput = ({ onAddJob }) => {
    const [startMeter, setStartMeter] = useState('');
    const [endMeter, setEndMeter] = useState('');
    const [materialUsed, setMaterialUsed] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const usage = parseFloat(endMeter) - parseFloat(startMeter);
      if (usage > 0) {
        onAddJob({ startMeter, endMeter, usage, materialUsed });
        setStartMeter('');
        setEndMeter('');
        setMaterialUsed('');
      } else {
        alert('End meter must be greater than start meter');
      }
    };
  
    return (
      <form className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 mt-6" onSubmit={handleSubmit}>
        <h3 className="text-lg font-medium text-gray-900">Log Machine Usage</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="start-meter" className="block text-sm font-medium text-gray-700">
              Start Meter
            </label>
            <input
              id="start-meter"
              type="number"
              value={startMeter}
              onChange={(e) => setStartMeter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="end-meter" className="block text-sm font-medium text-gray-700">
              End Meter
            </label>
            <input
              id="end-meter"
              type="number"
              value={endMeter}
              onChange={(e) => setEndMeter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="material-used" className="block text-sm font-medium text-gray-700">
              Material Used (Meters)
            </label>
            <input
              id="material-used"
              type="number"
              value={materialUsed}
              onChange={(e) => setMaterialUsed(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Job
          </button>
        </div>
      </form>
    );
  };


export default JobLogInput;