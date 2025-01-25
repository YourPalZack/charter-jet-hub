import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';

export function CreateAlertModal({ isOpen, onClose, categories, initialCategory = null }) {
  const { createAlert, error } = useAuth();
  const [formData, setFormData] = useState({
    categoryId: initialCategory || '',
    departureCity: '',
    arrivalCity: '',
    minPrice: '',
    maxPrice: '',
    frequency: 'daily'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { error } = await createAlert({
      categoryId: formData.categoryId,
      departureCity: formData.departureCity || null,
      arrivalCity: formData.arrivalCity || null,
      minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
      maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
      frequency: formData.frequency
    });
    
    if (!error) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Create Flight Alert
              </Dialog.Title>

              {error && (
                <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Flight Type
                    </label>
                    <select
                      name="categoryId"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.categoryId}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Departure City
                    </label>
                    <input
                      type="text"
                      name="departureCity"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.departureCity}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Arrival City
                    </label>
                    <input
                      type="text"
                      name="arrivalCity"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.arrivalCity}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Min Price
                      </label>
                      <input
                        type="number"
                        name="minPrice"
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.minPrice}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Max Price
                      </label>
                      <input
                        type="number"
                        name="maxPrice"
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.maxPrice}
                        onChange={handleChange}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Alert Frequency
                    </label>
                    <select
                      name="frequency"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.frequency}
                      onChange={handleChange}
                    >
                      <option value="instant">Instant</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Alert
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}