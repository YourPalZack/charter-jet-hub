import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export function FlightCard({ flight, featured = false }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${
      featured ? 'border-2 border-blue-500' : ''
    }`}>
      <div className="p-6">
        {featured && (
          <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-4">
            Featured
          </span>
        )}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{flight.title}</h3>
          <img
            src={flight.operator_logo}
            alt={flight.operator_name}
            className="h-8 w-auto"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="font-medium">{flight.departure_city}</p>
              <p className="text-sm text-gray-600">{flight.departure_airport}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">To</p>
              <p className="font-medium">{flight.arrival_city}</p>
              <p className="text-sm text-gray-600">{flight.arrival_airport}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Departure</p>
              <p className="font-medium">
                {format(new Date(flight.departure_time), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aircraft</p>
              <p className="font-medium">{flight.aircraft_type}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-blue-600">${flight.price.toLocaleString()}</p>
            <p className="text-sm text-gray-600">{flight.seats_available} seats available</p>
          </div>
        </div>
        
        <Link
          to={`/flight/${flight.id}`}
          className="mt-6 block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}