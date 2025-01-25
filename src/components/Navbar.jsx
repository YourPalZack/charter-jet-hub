import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { Menu, Transition, Popover } from '@headlessui/react';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const categories = [
    { 
      id: 'charter', 
      name: 'Charter Flights',
      description: 'Book a private jet charter for your next trip',
      popular: ['New York to Miami', 'Los Angeles to Las Vegas', 'Chicago to Aspen']
    },
    { 
      id: 'one_way', 
      name: 'One-Way Flights',
      description: 'Available one-way private jet flights',
      popular: ['London to Paris', 'Dubai to Singapore', 'Tokyo to Seoul']
    },
    { 
      id: 'empty_leg', 
      name: 'Empty Leg Flights',
      description: 'Discounted empty leg flight opportunities',
      popular: ['Miami to New York', 'Las Vegas to Los Angeles', 'Boston to Washington']
    },
    { 
      id: 'last_minute', 
      name: 'Last Minute Deals',
      description: 'Last minute private jet charter deals',
      popular: ['Same Day Flights', 'Next Day Departures', 'Weekend Specials']
    }
  ];

  const handleSignInClick = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">JetListings</span>
              </Link>

              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-500">
                        Flight Types
                        <ChevronDownIcon className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
                          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                              {categories.map((category) => (
                                <Link
                                  key={category.id}
                                  to={`/flights/${category.id}`}
                                  className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150"
                                >
                                  <div className="ml-4">
                                    <p className="text-base font-medium text-gray-900">
                                      {category.name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {category.description}
                                    </p>
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Popular Routes
                                      </p>
                                      <ul className="mt-1 space-y-1">
                                        {category.popular.map((route, index) => (
                                          <li key={index} className="text-sm text-gray-600">
                                            {route}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>

                <Link
                  to="/charter-operators"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-500"
                >
                  Operators
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-500"
                >
                  How It Works
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/submit-flight"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Listing
                  </Link>
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                      <UserCircleIcon className="h-6 w-6" />
                      <span>{profile?.user_type === 'agency' ? profile.company_name : user.email}</span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/alerts"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              My Alerts
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={signOut}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Sign Out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <Menu as="div" className="relative">
                  <Menu.Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                    Add Listing
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignInClick}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Sign In
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignUpClick}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Sign Up
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
}