import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const FEATURE_DURATIONS = [
  { value: '7_days', label: '7 Days', price: 199 },
  { value: '14_days', label: '14 Days', price: 349 },
  { value: '21_days', label: '21 Days', price: 499 }
];

export function SubmitFlight() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featureOptions, setFeatureOptions] = useState({
    enabled: false,
    duration: '7_days',
    categories: []
  });
  const [flightData, setFlightData] = useState({
    title: '',
    description: '',
    category_id: '',
    aircraft_type: '',
    departure_city: '',
    departure_airport: '',
    arrival_city: '',
    arrival_airport: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    seats_available: '',
    operator_name: '',
    operator_logo: '',
    contact_email: '',
    contact_phone: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert the flight first
      const { data: flight, error: flightError } = await supabase
        .from('flights')
        .insert([{
          ...flightData,
          user_id: user?.id || null,
          price: parseFloat(flightData.price),
          seats_available: parseInt(flightData.seats_available)
        }])
        .select()
        .single();

      if (flightError) throw flightError;

      // If featuring is enabled, create featured spots
      if (featureOptions.enabled && featureOptions.categories.length > 0) {
        const duration = FEATURE_DURATIONS.find(d => d.value === featureOptions.duration);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(duration.value));

        const featuredSpots = featureOptions.categories.map(categoryId => ({
          flight_id: flight.id,
          user_id: user?.id || null,
          category_id: categoryId,
          duration: duration.value,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          amount_paid: duration.price,
          is_active: true
        }));

        const { error: featureError } = await supabase
          .from('featured_spots')
          .insert(featuredSpots);

        if (featureError) throw featureError;
      }

      navigate(`/flight/${flight.id}`);
    } catch (error) {
      console.error('Error submitting flight:', error);
      alert('Error submitting flight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (type === 'checkbox' && name === 'enabled') {
      setFeatureOptions(prev => ({
        ...prev,
        enabled: checked,
        categories: checked ? [flightData.category_id] : []
      }));
    } else if (name === 'duration') {
      setFeatureOptions(prev => ({
        ...prev,
        duration: value
      }));
    } else if (name === 'categories') {
      const categoryId = value;
      setFeatureOptions(prev => ({
        ...prev,
        categories: prev.categories.includes(categoryId)
          ? prev.categories.filter(id => id !== categoryId)
          : [...prev.categories, categoryId]
      }));
    }
  };

  const selectedDuration = FEATURE_DURATIONS.find(d => d.value === featureOptions.duration);
  const totalPrice = featureOptions.enabled
    ? selectedDuration.price * featureOptions.categories.length
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Submit a Flight Listing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Flight Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.category_id}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.display_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Flight Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="departure_city" className="block text-sm font-medium text-gray-700">
                Departure City
              </label>
              <input
                type="text"
                id="departure_city"
                name="departure_city"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.departure_city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="departure_airport" className="block text-sm font-medium text-gray-700">
                Departure Airport
              </label>
              <input
                type="text"
                id="departure_airport"
                name="departure_airport"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.departure_airport}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="arrival_city" className="block text-sm font-medium text-gray-700">
                Arrival City
              </label>
              <input
                type="text"
                id="arrival_city"
                name="arrival_city"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.arrival_city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="arrival_airport" className="block text-sm font-medium text-gray-700">
                Arrival Airport
              </label>
              <input
                type="text"
                id="arrival_airport"
                name="arrival_airport"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.arrival_airport}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="departure_time" className="block text-sm font-medium text-gray-700">
                Departure Time
              </label>
              <input
                type="datetime-local"
                id="departure_time"
                name="departure_time"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.departure_time}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="arrival_time" className="block text-sm font-medium text-gray-700">
                Arrival Time
              </label>
              <input
                type="datetime-local"
                id="arrival_time"
                name="arrival_time"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.arrival_time}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Aircraft & Pricing */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Aircraft & Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="aircraft_type" className="block text-sm font-medium text-gray-700">
                Aircraft Type
              </label>
              <input
                type="text"
                id="aircraft_type"
                name="aircraft_type"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.aircraft_type}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="seats_available" className="block text-sm font-medium text-gray-700">
                Seats Available
              </label>
              <input
                type="number"
                id="seats_available"
                name="seats_available"
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.seats_available}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={flightData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Your Listing */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Feature Your Listing
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="enabled"
                className="sr-only peer"
                checked={featureOptions.enabled}
                onChange={handleFeatureChange}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {featureOptions.enabled && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {FEATURE_DURATIONS.map(duration => (
                    <label
                      key={duration.value}
                      className={`relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        featureOptions.duration === duration.value
                          ? 'border-blue-500 ring-2 ring-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={duration.value}
                        className="sr-only"
                        checked={featureOptions.duration === duration.value}
                        onChange={handleFeatureChange}
                      />
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{duration.label}</p>
                        <p className="text-sm text-gray-500">${duration.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feature Locations
                </label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="categories"
                        value={category.id}
                        checked={featureOptions.categories.includes(category.id)}
                        onChange={handleFeatureChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{category.display_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {totalPrice > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-medium">
                    <span>Total Feature Price:</span>
                    <span className="text-blue-600">${totalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Your listing will be featured in {featureOptions.categories.length} location{featureOptions.categories.length !== 1 ? 's' : ''} for {selectedDuration.label}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Operator Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Operator Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="operator_name" className="block text-sm font-medium text-gray-700">
                Operator Name
              </label>
              <input
                type="text"
                id="operator_name"
                name="operator_name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.operator_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="operator_logo" className="block text-sm font-medium text-gray-700">
                Operator Logo URL
              </label>
              <input
                type="url"
                id="operator_logo"
                name="operator_logo"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.operator_logo}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.contact_email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={flightData.contact_phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Flight'}
          </button>
        </div>
      </form>
    </div>
  );
}