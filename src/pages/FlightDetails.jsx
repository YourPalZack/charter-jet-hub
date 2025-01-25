import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { generateMetaTags } from '../utils/seo';
import { StarIcon, WifiIcon, CheckIcon } from '@heroicons/react/24/solid';

export function FlightDetails() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlight();
  }, [id]);

  useEffect(() => {
    if (flight) {
      generateMetaTags(
        `${flight.title} | Private Jet Charter`,
        `Book a private jet charter flight from ${flight.departure_city} to ${flight.arrival_city}. ${flight.aircraft_type} with ${flight.seats_available} seats available.`
      );
    }
  }, [flight]);

  async function fetchFlight() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('flights')
        .select(`
          *,
          user_profiles (
            company_name,
            company_website,
            phone,
            description,
            fleet
          )
        `)
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      setFlight(data);

      // Redirect if slug doesn't match
      if (data.slug && slug !== data.slug) {
        navigate(`/flight/${id}/${data.slug}`, { replace: true });
      }
    } catch (error) {
      console.error('Error fetching flight:', error);
      setError('Failed to load flight details.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error || 'Flight not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Flights
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{flight.title}</h1>
            <div className="flex items-center space-x-4">
              {flight.wifi_available && (
                <div className="flex items-center text-blue-600">
                  <WifiIcon className="h-5 w-5 mr-1" />
                  <span>Wi-Fi</span>
                </div>
              )}
              <img
                src={flight.operator_logo}
                alt={flight.operator_name}
                className="h-12 w-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Flight Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Aircraft Type</p>
                  <p className="font-medium">{flight.aircraft_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seats Available</p>
                  <p className="font-medium">{flight.seats_available}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${flight.price.toLocaleString()}
                  </p>
                </div>
                {flight.baggage_allowance && (
                  <div>
                    <p className="text-sm text-gray-500">Baggage Allowance</p>
                    <p className="font-medium">{flight.baggage_allowance}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Departure</p>
                  <p className="font-medium">{flight.departure_city}</p>
                  <p className="text-sm text-gray-600">{flight.departure_airport}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(flight.departure_time), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Arrival</p>
                  <p className="font-medium">{flight.arrival_city}</p>
                  <p className="text-sm text-gray-600">{flight.arrival_airport}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(flight.arrival_time), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {flight.amenities && flight.amenities.length > 0 && (
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {flight.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {flight.cancellation_policy && (
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Cancellation Policy
              </h2>
              <p className="text-gray-600">{flight.cancellation_policy}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Operator Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Operator</p>
                <p className="font-medium">{flight.operator_name}</p>
                {flight.user_profiles?.description && (
                  <p className="text-gray-600 mt-2">{flight.user_profiles.description}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Contact Email</p>
                  <a
                    href={`mailto:${flight.contact_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {flight.contact_email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a
                    href={`tel:${flight.contact_phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {flight.contact_phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
              Contact Operator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}