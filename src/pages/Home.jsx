import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { FlightCard } from '../components/FlightCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { supabase } from '../lib/supabase';

const faqs = [
  {
    question: 'How much does a private jet charter flight cost in the USA?',
    answer: 'Private jet charter costs vary based on factors like aircraft size, flight duration, and route. Typically, prices range from $5,000 to $20,000 per hour for larger jets.'
  },
  {
    question: 'Who are the best-rated Charter Flight Providers in the USA?',
    answer: 'Top-rated providers include NetJets, Wheels Up, and Vista Jet, known for their safety records, service quality, and fleet diversity.'
  },
  {
    question: 'What advantages do Private Charter Flights offer?',
    answer: 'Benefits include flexible scheduling, access to private terminals, reduced security wait times, and personalized service.'
  },
  {
    question: 'How do I choose the right Private Flight charter company?',
    answer: 'Consider safety ratings, fleet options, pricing transparency, customer reviews, and experience in the industry.'
  },
  {
    question: 'Are there affordable Charter Jet providers in the USA?',
    answer: 'Yes, some providers offer membership programs, empty leg flights, and shared charter options for more affordable private aviation.'
  }
];

export function Home() {
  const [flights, setFlights] = useState([]);
  const [featuredFlights, setFeaturedFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  async function fetchFlights() {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured flights
      const { data: featured, error: featuredError } = await supabase
        .from('flights')
        .select(`
          *,
          featured_spots!inner (*)
        `)
        .eq('featured_spots.is_active', true)
        .limit(2);

      if (featuredError) throw featuredError;

      // Fetch regular flights
      const { data: regular, error: regularError } = await supabase
        .from('flights')
        .select('*')
        .limit(10);

      if (regularError) throw regularError;

      setFeaturedFlights(featured || []);
      setFlights(regular || []);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError('Failed to load flights. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('flights').select('*');

      if (searchParams.departure) {
        query = query.ilike('departure_city', `%${searchParams.departure}%`);
      }
      if (searchParams.arrival) {
        query = query.ilike('arrival_city', `%${searchParams.arrival}%`);
      }
      if (searchParams.date) {
        query = query.gte('departure_time', searchParams.date)
          .lt('departure_time', new Date(new Date(searchParams.date).getTime() + 86400000).toISOString());
      }

      const { data, error: searchError } = await query;
      
      if (searchError) throw searchError;
      
      setFlights(data || []);
    } catch (error) {
      console.error('Error searching flights:', error);
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Your Perfect Flight
        </h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {featuredFlights.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured Flights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredFlights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} featured={true} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Available Flights
        </h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading flights...</p>
          </div>
        ) : flights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No flights found</p>
          </div>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <FAQAccordion faqs={faqs} />
      </div>
    </div>
  );
}