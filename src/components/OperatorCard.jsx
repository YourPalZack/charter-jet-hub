import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { generateSlug } from '../utils/seo';

export function OperatorCard({ operator, featured = false }) {
  return (
    <Link
      to={`/operator/${operator.id}/${generateSlug(operator.company_name)}`}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 ${
        featured ? 'border-2 border-blue-500' : ''
      }`}
    >
      <div className="p-6">
        {featured && (
          <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-4">
            Featured
          </span>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {operator.company_name}
          </h2>
          {operator.averageRating > 0 && (
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-500" />
              <span className="ml-1 text-gray-600">
                {operator.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-600 line-clamp-2">{operator.description}</p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Fleet Size:</span>{' '}
            {operator.fleet?.length || 0} aircraft
          </p>
          <p>
            <span className="font-medium">Reviews:</span>{' '}
            {operator.reviewCount} {operator.reviewCount === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <div className="mt-4 inline-flex items-center text-blue-600">
          <span>View Profile</span>
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}