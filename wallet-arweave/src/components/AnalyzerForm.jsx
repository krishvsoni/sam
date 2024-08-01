import React, { useState } from 'react';
import axios from 'axios';

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

const minutes = range(0, 59);
const hours = range(0, 23);
const daysOfMonth = range(1, 31);
const months = range(1, 12);
const daysOfWeek = range(0, 6);

export function AnalyzerForm() {
  const [entity, setEntity] = useState('');
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [responseGot, setResponseGot] = useState(false);
  const [messagerep, setMessagerep] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const interval = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:3000/setupCRON', {
        entity,
        interval
      });
      setMessage(response.data);
      setResponseGot(true);
    } catch (error) {
      console.error('Error setting up CRON job:', error);
      setMessage('Error setting up CRON job');
    }
    setLoading(false); // End loading
  };

  const handlecronmail = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`http://localhost:3000/getreport?processId=${entity}&delayTime=*%20*%20*%20*%20*&email=${email}`);
      console.log(response.data);
      setMessagerep(response.data);
    } catch (error) {
      console.error('Error fetching CRON report:', error);
      setMessagerep('Error fetching CRON report');
    }
    setLoading(false); // End loading
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto bg-gray-800 text-white font-mono rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-4xl font-semibold text-center mb-6">Setup CRON Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label htmlFor="entity" className="block text-sm md:text-lg font-medium">Entity (Process ID)</label>
          <input
            id="entity"
            type="text"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="mt-1 p-2 md:p-3 block w-full border border-gray-600 rounded-lg bg-gray-900 placeholder-gray-500 focus:ring-blue-400 focus:border-blue-400"
            required
          />
        </div>
        <div>
          <label htmlFor="minute" className="block text-sm md:text-lg font-medium">Minute</label>
          <select
            id="minute"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="mt-1 p-2 md:p-3 block w-full border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="*">*</option>
            {minutes.map((min) => (
              <option key={min} value={min}>{min}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="hour" className="block text-sm md:text-lg font-medium">Hour</label>
          <select
            id="hour"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="mt-1 p-2 md:p-3 block w-full border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="*">*</option>
            {hours.map((hr) => (
              <option key={hr} value={hr}>{hr}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dayOfMonth" className="block text-sm md:text-lg font-medium">Day of Month</label>
          <select
            id="dayOfMonth"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="mt-1 p-2 md:p-3 block w-full border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="*">*</option>
            {daysOfMonth.map((dom) => (
              <option key={dom} value={dom}>{dom}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="month" className="block text-sm md:text-lg font-medium">Month</label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 p-2 md:p-3 block w-full border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="*">*</option>
            {months.map((mon) => (
              <option key={mon} value={mon}>{mon}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dayOfWeek" className="block text-sm md:text-lg font-medium">Day of Week</label>
          <select
            id="dayOfWeek"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="mt-1 p-2 md:p-3 block w-full border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="*">*</option>
            {daysOfWeek.map((dow) => (
              <option key={dow} value={dow}>{dow}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`w-full py-2 md:py-3 px-4 text-white font-semibold rounded-lg border border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transition duration-200 ${loading ? 'bg-blue-300 cursor-wait' : ''}`}
          disabled={loading}
        >
          {loading ? 'Setting Up...' : 'Set Up CRON Job'}
        </button>
      </form>
      {message && (
        <div className="mt-4 md:mt-6 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white">
          {message}
        </div>
      )}
      {responseGot && (
        <div className='mt-4 md:mt-6'>
          <label htmlFor="email" className="block text-sm md:text-lg font-medium">Email for CRON Reports</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 md:p-3 block w-full border border-gray-600 rounded-lg bg-gray-900 placeholder-gray-500 text-white focus:ring-blue-400 focus:border-blue-400"
            placeholder="Enter your email"
            required
          />
          <button
            onClick={handlecronmail}
            className={`w-full mt-4 py-2 md:py-3 px-4 text-white font-semibold rounded-lg border border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white transition duration-200 ${loading ? 'bg-blue-300 cursor-wait' : ''}`}
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Get CRON Reports'}
          </button>
          {loading && (
            <div className="flex justify-center items-center mt-4">
              <svg className="animate-spin h-8 w-8 md:h-12 md:w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8l4 4-4 4v-8a8 8 0 00-8-8z"></path>
              </svg>
            </div>
          )}
          {messagerep && <div className="mt-4 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white">{messagerep}</div>}
        </div>
      )}
    </div>
  );
}

export default AnalyzerForm;
