import React, { useState, useEffect } from 'react';
import { OperatorCard } from '../components/OperatorCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { supabase } from '../lib/supabase';
import { generateMetaTags } from '../utils/seo';

const faqs = [
  {
    question: 'How do I choose the right charter operator?',
    answer: 'Consider factors such as safety ratings, fleet options, customer reviews, experience, and pricing transparency. Look for operators with strong safety records and positive customer feedback.'
  },
  {
    question: 'What certifications should a charter operator have?',
    answer: 'Reputable operators should have FAA Part 135 certification, ARG/US or Wyvern safety ratings, and proper insurance coverage. Additional international certifications may be required for overseas operations.'
  },
  {
    question: 'How much does it cost to charter a private jet?',
    answer: 'Costs vary based on factors like aircraft size, flight duration, and route. Typical hourly rates range from $5,000 to $20,000. Contact operators directly for specific quotes based on your requirements.'
  },
  {
    question: 'What is the booking process like?',
    answer: 'The process typically involves selecting an operator, requesting a quote, reviewing the contract, and making payment. Most operators require advance notice, though some offer last-minute availability.'
  },
  {
    question: 'Are charter operators required to have insurance?',
    answer: 'Yes, charter operators must maintain comprehensive insurance coverage. This includes liability insurance and aircraft hull insurance to protect passengers and assets.'
  }
];

export function OperatorDirectory() {
  const [operators, setOperators] = useState([]);
  const [featuredOperators, setFeaturedOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOperators();
    generateMetaTags(
      'Charter Operators Directory',
      'Find and compare top-rated private jet charter operators. Read reviews, check ratings, and book your next private flight.'
    );
  }, []);

  async function fetchOperators() {
    try {
      setLoading(true);
      setError(null);

      // Fetch all agency-type user profiles with their reviews
      const { data: operatorsData, error: operatorsError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          company_name,
          company_website,
          phone,
          description,
          fleet,
          operator_reviews (
            rating
          )
        `)
        .eq('user_type', 'agency');

      if (operatorsError) throw operatorsError;

      // Calculate average rating and add review count for each operator
      const operatorsWithRatings = operatorsData.map(operator => ({
        ...operator,
        averageRating: operator.operator_reviews.length > 0
          ? operator.operator_reviews.reduce((sum, review) => sum + review.rating, 0) / operator.operator_reviews.length
          : 0,
        reviewCount: operator.operator_reviews.length
      }));

      // Sort by average rating
      operatorsWithRatings.sort((a, b) => b.averageRating - a.averageRating);

      // Split into featured (top rated) and regular operators
      setFeaturedOperators(operatorsWithRatings.slice(0, 2));
      setOperators(operatorsWithRatings.slice(2));

    } catch (error) {
      console.error('Error fetching operators:', error);
      setError('Failed to load operators. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading operators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Charter Operators Directory
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Find and compare top-rated private jet charter operators. Read reviews, check ratings, and book your next private flight.
        </p>
      </div>

      {featuredOperators.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured Operators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredOperators.map((operator) => (
              <OperatorCard key={operator.id} operator={operator} featured={true} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          All Operators
        </h2>
        {operators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operators.map((operator) => (
              <OperatorCard key={operator.id} operator={operator} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No operators found</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>
        <FAQAccordion faqs={faqs} />
      </div>
    </div>
  );
}