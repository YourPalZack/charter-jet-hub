import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { supabase } from '../lib/supabase';
import { generateMetaTags } from '../utils/seo';
import { ReviewModal } from '../components/ReviewModal';
import { FlightCard } from '../components/FlightCard';

export function OperatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [operator, setOperator] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    fetchOperatorData();
  }, [id]);

  useEffect(() => {
    if (operator) {
      generateMetaTags(
        `${operator.company_name} | Private Jet Charter Operator`,
        `Book private jet charters with ${operator.company_name}. Professional charter services with a fleet of ${operator.fleet?.length || 0} aircraft.`
      );
    }
  }, [operator]);

  async function fetchOperatorData() {
    try {
      setLoading(true);
      setError(null);

      // Fetch operator profile
      const { data: operatorData, error: operatorError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          company_name,
          company_website,
          phone,
          notification_email,
          description,
          fleet
        `)
        .eq('id', id)
        .single();

      if (operatorError) throw operatorError;

      // Fetch operator reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('operator_reviews')
        .select(`
          *,
          user_profiles (
            company_name
          )
        `)
        .eq('operator_id', id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch operator's flights
      const { data: flightsData, error: flightsError } = await supabase
        .from('flights')
        .select('*')
        .eq('user_id', id)
        .order('departure_time', { ascending: true });

      if (flightsError) throw flightsError;

      setOperator(operatorData);
      setReviews(reviewsData || []);
      setFlights(flightsData || []);
    } catch (error) {
      console.error('Error fetching operator data:', error);
      setError('Failed to load operator information.');
    } finally {
      setLoading(false);
    }
  }

  function calculateAverageRating() {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading operator profile...</p>
        </div>
      </div>
    );
  }

  if (error || !operator) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error || 'Operator not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {operator.company_name}
            </h1>
            <div className="flex items-center">
              <StarIcon className="h-6 w-6 text-yellow-500" />
              <span className="ml-2 text-xl font-semibold">
                {calculateAverageRating()}
              </span>
              <span className="ml-2 text-gray-600">
                ({reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About {operator.company_name}
              </h2>
              <p className="text-gray-600 mb-4">{operator.description}</p>
              
              {operator.fleet && operator.fleet.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold text-gray-900 mb-2">Aircraft Fleet</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {operator.fleet.map((aircraft, index) => (
                      <li key={index}>{aircraft}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a
                    href={operator.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {operator.company_website}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a
                    href={`tel:${operator.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {operator.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${operator.notification_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {operator.notification_email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {flights.length > 0 && (
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Available Flights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Customer Reviews
              </h2>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </button>
            </div>
            
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className="h-5 w-5 text-yellow-500"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                          {review.user_profiles?.company_name || 'Anonymous'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        operatorId={id}
      />
    </div>
  );
}