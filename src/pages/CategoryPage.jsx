import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FlightCard } from '../components/FlightCard';
import { SearchBar } from '../components/SearchBar';
import { supabase } from '../lib/supabase';
import { generateMetaTags } from '../utils/seo';

export function CategoryPage() {
  const { categorySlug } = useParams();
  const [flights, setFlights] = useState([]);
  const [featuredFlights, setFeaturedFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, [categorySlug]);

  useEffect(() => {
    if (category?.id) {
      fetchFlights(category.id);
    }
  }, [category]);

  useEffect(() => {
    if (category) {
      generateMetaTags(
        `${category.display_name} | Private Jet Charter`,
        `Find and book ${category.display_name.toLowerCase()}. Compare prices, aircraft types, and availability for private jet charters.`
      );
    }
  }, [category]);

  async function fetchCategory() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', categorySlug)
        .single();
      
      if (error) throw error;
      setCategory(data);
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Failed to load category information.');
    }
  }

  async function fetchFlights(categoryUuid) {
    try {
      setLoading(true);
      setError(null);

      // Fetch featured flights for this category
      const { data: featured, error: featuredError } = await supabase
        .from('flights')
        .select(`
          *,
          featured_spots!inner (*)
        `)
        .eq('category_id', categoryUuid)
        .eq('featured_spots.is_active', true)
        .limit(2);

      if (featuredError) throw featuredError;

      // Fetch regular flights for this category
      const { data: regular, error: regularError } = await supabase
        .from('flights')
        .select('*')
        .eq('category_id', categoryUuid)
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
    if (!category?.id) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('flights')
        .select('*')
        .eq('category_id', category.id);

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

  if (!category && !error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (!category && error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">Category not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {category?.display_name}
        </h1>
        <p className="text-gray-600">{category?.description}</p>
        <div className="mt-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {featuredFlights.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured {category?.display_name}
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
          Available {category?.display_name}
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
    </div>
  );
}