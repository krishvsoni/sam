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

  const[messagerep,setMessagerep]=useState('')
  const handleSubmit = async (e) => {
    e.preventDefault();
    const interval = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
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
  };
  const handlecronmail=async()=>{
    const response=await axios.get(`http://localhost:3000/getreport?processId=${entity}&delayTime=*%20*%20*%20*%20*&email=${email}`)
    console.log(response.data)
    setMessagerep(response.data)

  }

  return (
    <div className="p-4 w-1/2 mx-auto">
      <h1 className="text-xl mb-4">Setup CRON Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="entity" className="block text-sm font-medium text-white">
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
          <label htmlFor="minute" className="block text-sm font-medium text-white">
            Minute
          </label>
          <select
            id="minute"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="*">*</option>
            {minutes.map((min) => (
              <option key={min} value={min}>{min}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="hour" className="block text-sm font-mediumtext-white">
            Hour
          </label>
          <select
            id="hour"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="*">*</option>
            {hours.map((hr) => (
              <option key={hr} value={hr}>{hr}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dayOfMonth" className="block text-sm font-medium text-white">
            Day of Month
          </label>
          <select
            id="dayOfMonth"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="*">*</option>
            {daysOfMonth.map((dom) => (
              <option key={dom} value={dom}>{dom}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-white">
            Month
          </label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="*">*</option>
            {months.map((mon) => (
              <option key={mon} value={mon}>{mon}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="dayOfWeek" className="block text-sm font-medium text-white">
            Day of Week
          </label>
          <select
            id="dayOfWeek"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          >
            <option value="*">*</option>
            {daysOfWeek.map((dow) => (
              <option key={dow} value={dow}>{dow}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white  px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Set Up CRON Job
        </button>
      </form>
      {message && (
        <div className="mt-4 p-2 bg-gray-100 border text-black border-gray-300 rounded-md">
          {message}
        </div>
      )}
      {responseGot && (
        <div className='flex flex-col gap-3 jusify-center items-center'> 
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            placeholder="Enter your email"
            required
          />
          <button  onClick={handlecronmail} className=' bg-blue-500 btn btn-outline w-1/3 '>
            Get Cron Reports
          </button>
          {messagerep }
        </div>
        
      )}
    </div>
  );
}

export default AnalyzerForm;
