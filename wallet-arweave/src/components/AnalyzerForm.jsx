import React, { useState } from 'react';
import axios from 'axios';

export function AnalyzerForm() {
  const [entity, setEntity] = useState('');
  const [interval, setInterval] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/setupCRON', {
        entity,
        interval
      });
      setMessage(response.data);
    } catch (error) {
      console.error('Error setting up CRON job:', error);
      setMessage('Error setting up CRON job');
    }
  };

  return (
    <div className="p-4 w-1/2 mx-auto">
      <h1 className="text-xl mb-4">Setup CRON Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="entity" className="block text-sm font-medium text-gray-700">
            Entity (Process ID)
          </label>
          <input
            id="entity"
            type="text"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="interval" className="block text-sm font-medium text-gray-700">
            Interval (CRON Expression)
          </label>
          <input
            id="interval"
            type="text"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Set Up CRON Job
        </button>
      </form>
      {message && (
        <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded-md">
          {message}
        </div>
      )}
    </div>
  );
}

export default AnalyzerForm;
