import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function SearchBar({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    arrival: '',
    date: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="departure" className="block text-sm font-medium text-gray-700">
            Departure
          </label>
          <input
            type="text"
            id="departure"
            placeholder="City or Airport"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={searchParams.departure}
            onChange={(e) => setSearchParams({ ...searchParams, departure: e.target.value })}
          />
        </div>
        
        <div>
          <label htmlFor="arrival" className="block text-sm font-medium text-gray-700">
            Arrival
          </label>
          <input
            type="text"
            id="arrival"
            placeholder="City or Airport"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={searchParams.arrival}
            onChange={(e) => setSearchParams({ ...searchParams, arrival: e.target.value })}
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={searchParams.date}
            onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          Search Flights
        </button>
      </div>
    </form>
  );
}