import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';

export function AuthModal({ isOpen, onClose, mode = 'signin' }) {
  const { signIn, signUp, error } = useAuth();
  const [formMode, setFormMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user',
    companyName: '',
    companyWebsite: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formMode === 'signin') {
      const { error } = await signIn({
        email: formData.email,
        password: formData.password
      });
      
      if (!error) {
        onClose();
      }
    } else {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        phone: formData.phone
      });
      
      if (!error) {
        onClose();
      }
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
                {formMode === 'signin' ? 'Sign In' : 'Create Account'}
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
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  {formMode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Account Type
                        </label>
                        <select
                          name="userType"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={formData.userType}
                          onChange={handleChange}
                        >
                          <option value="user">User</option>
                          <option value="agency">Agency</option>
                        </select>
                      </div>

                      {formData.userType === 'agency' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Company Name
                            </label>
                            <input
                              type="text"
                              name="companyName"
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={formData.companyName}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Company Website
                            </label>
                            <input
                              type="url"
                              name="companyWebsite"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={formData.companyWebsite}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Phone
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {formMode === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                {formMode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      className="text-blue-600 hover:text-blue-500"
                      onClick={() => setFormMode('signup')}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      className="text-blue-600 hover:text-blue-500"
                      onClick={() => setFormMode('signin')}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}