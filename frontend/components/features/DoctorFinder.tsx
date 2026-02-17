'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  distance: string
  address: string
  phone: string
  availability: string
  insurance: string[]
  languages: string[]
}

const DoctorFinder = () => {
  const [location, setLocation] = useState('')
  const [specialty, setSpecialty] = useState('psychologist')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])

  // Mock doctor data
  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Clinical Psychologist',
      rating: 4.9,
      distance: '1.2 miles',
      address: '123 Wellness Ave, San Francisco, CA 94102',
      phone: '(415) 555-0123',
      availability: 'Mon-Fri: 9AM-5PM',
      insurance: ['Blue Cross', 'Cigna', 'Aetna'],
      languages: ['English', 'Spanish']
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Licensed Therapist',
      rating: 4.8,
      distance: '2.5 miles',
      address: '456 Healing Blvd, San Francisco, CA 94103',
      phone: '(415) 555-0456',
      availability: 'Tue-Thu: 10AM-7PM, Sat: 9AM-1PM',
      insurance: ['Cigna', 'UnitedHealth', 'Humana'],
      languages: ['English', 'Mandarin', 'Cantonese']
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Marriage & Family Therapist',
      rating: 4.7,
      distance: '0.8 miles',
      address: '789 Harmony St, San Francisco, CA 94104',
      phone: '(415) 555-0789',
      availability: 'Mon-Wed: 8AM-4PM, Fri: 10AM-6PM',
      insurance: ['Blue Cross', 'Aetna', 'Kaiser'],
      languages: ['English', 'Spanish', 'French']
    },
    {
      id: '4',
      name: 'Dr. David Kim',
      specialty: 'Psychiatrist',
      rating: 4.6,
      distance: '3.1 miles',
      address: '321 Serenity Ln, San Francisco, CA 94105',
      phone: '(415) 555-0321',
      availability: 'Mon-Fri: 8AM-6PM',
      insurance: ['UnitedHealth', 'Cigna', 'Oxford'],
      languages: ['English', 'Korean']
    }
  ]

  useEffect(() => {
    setDoctors(mockDoctors)
    setFilteredDoctors(mockDoctors)
  }, [])

  const specialties = [
    { id: 'psychologist', name: 'Psychologist' },
    { id: 'psychiatrist', name: 'Psychiatrist' },
    { id: 'therapist', name: 'Therapist' },
    { id: 'counselor', name: 'Counselor' },
    { id: 'family', name: 'Family Therapist' }
  ]

  const handleSearch = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const filtered = doctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) &&
        (location === '' || doctor.address.toLowerCase().includes(location.toLowerCase()))
      )
      
      setFilteredDoctors(filtered)
      setIsLoading(false)
    }, 800)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Find a Mental Health Professional</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, ZIP, or address"
              className="w-full input-field"
            />
          </div>
          
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
              Specialty
            </label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full input-field"
            >
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Search Doctors
            </motion.button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Accepting new patients
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Telehealth available
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            LGBTQ+ friendly
          </span>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
            </h3>
            <select className="input-field text-sm">
              <option>Sort by: Distance</option>
              <option>Sort by: Rating</option>
              <option>Sort by: Availability</option>
            </select>
          </div>
          
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-gray-600">{doctor.specialty}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      {renderStars(doctor.rating)}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{doctor.distance} • {doctor.address}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{doctor.phone}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{doctor.availability}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Insurance:</span>
                      <div className="flex flex-wrap gap-1">
                        {doctor.insurance.slice(0, 2).map((ins, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {ins}
                          </span>
                        ))}
                        {doctor.insurance.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{doctor.insurance.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Languages:</span>
                      <div className="flex flex-wrap gap-1">
                        {doctor.languages.slice(0, 2).map((lang, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {lang}
                          </span>
                        ))}
                        {doctor.languages.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{doctor.languages.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium text-sm"
                  >
                    Book Appointment
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50"
                  >
                    View Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorFinder