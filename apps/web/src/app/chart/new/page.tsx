'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Moon, Loader2, MapPin, Clock, Calendar, AlertCircle, CheckCircle2, Search, X } from 'lucide-react';
import { useAuth } from '@/app/providers';

const ZODIAC_OPTIONS = [
  { value: 'tropical', label: 'Western (Tropical)', description: 'Sun-based, seasonal' },
  { value: 'sidereal', label: 'Vedic (Sidereal)', description: 'Star-based, fixed' },
];

const HOUSE_SYSTEMS = [
  'Placidus', 'Koch', 'Whole Sign', 'Equal', 'Porphyry',
  'Regiomontanus', 'Campanus', 'Morinus', 'Polich-Page', 'Alcabitius',
];

const AYANAMSAS = [
  'Lahiri', 'Raman', 'Krishnamurti', 'Fagan-Bradley',
];

const STEPS = [
  { key: 'birth', label: 'Birth Details', icon: Calendar },
  { key: 'options', label: 'Options', icon: Moon },
  { key: 'review', label: 'Review', icon: CheckCircle2 },
];

export default function NewChartPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    timeUnknown: false,
    latitude: 0,
    longitude: 0,
    timezone: '',
    locationName: '',
    zodiac: 'tropical' as 'tropical' | 'sidereal',
    houseSystem: 'Placidus',
    ayanamsa: 'Lahiri',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (searchDebounce) clearTimeout(searchDebounce);
    };
  }, [searchDebounce]);

  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleLocationSelect = (location: any) => {
    handleInputChange('latitude', parseFloat(location.lat));
    handleInputChange('longitude', parseFloat(location.lon));
    handleInputChange('timezone', location.timezone || 'UTC');
    handleInputChange('locationName', location.display_name);
    setSearchQuery(location.display_name.split(',')[0]);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchDebounce) clearTimeout(searchDebounce);
    const timeout = setTimeout(() => handleSearch(value), 300);
    setSearchDebounce(timeout);
    setShowSuggestions(true);
  };

  const validateStep = () => {
    if (step === 0) {
      if (!formData.date) return 'Date of birth is required';
      if (!formData.timeUnknown && !formData.time) return 'Time of birth is required (or check "Time Unknown")';
      if (formData.latitude === null || formData.latitude === undefined || formData.longitude === null || formData.longitude === undefined) return 'Please select a birth location';
      return null;
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setStep(prev => Math.min(prev + 1, STEPS.length - 1));
    setError(null);
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!session?.access_token) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          date: formData.date,
          time: formData.timeUnknown ? null : formData.time,
          time_unknown: formData.timeUnknown,
          latitude: formData.latitude,
          longitude: formData.longitude,
          timezone: formData.timezone,
          zodiac: formData.zodiac,
          house_system: formData.houseSystem,
          ayanamsa: formData.zodiac === 'sidereal' ? formData.ayanamsa : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create chart');
      }

      const data = await res.json();
      router.push(`/chart/${data.chart_id}/read`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <BirthDetailsStep formData={formData} onChange={handleInputChange} searchQuery={searchQuery} onSearchChange={handleSearchInput} suggestions={suggestions} showSuggestions={showSuggestions} onLocationSelect={handleLocationSelect} onClearSearch={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }} setShowSuggestions={setShowSuggestions} />;
      case 1: return <OptionsStep formData={formData} onChange={handleInputChange} />;
      case 2: return <ReviewStep formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Create Your Birth Chart
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Step {step + 1} of {STEPS.length}
          </p>
        </div>

        <div className="mb-8 hidden sm:flex">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                  i < step ? 'bg-primary-600 text-white' : i === step ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  <s.icon className="h-5 w-5" />
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    i < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {renderStep()}

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium disabled:opacity-50 transition-colors"
            >
              Back
            </button>
            
            <div className="flex gap-3">
              {step < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Chart...
                    </>
                  ) : (
                    'Generate Chart'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          <strong>Important:</strong> This service provides astrological interpretations for entertainment and self-reflection only.
          It is not a substitute for professional medical, legal, financial, or psychological advice.
          <Link href="/disclaimer" className="text-primary-600 dark:text-primary-400 hover:underline ml-1">
            Read our full disclaimer
          </Link>
        </p>
      </div>
    </div>
  );
}

function BirthDetailsStep({ formData, onChange, searchQuery, onSearchChange, suggestions, showSuggestions, onLocationSelect, onClearSearch, setShowSuggestions }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name (optional)
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => onChange('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Your name or nickname"
          maxLength={100}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={e => onChange('date', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            Time of Birth <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={formData.time}
              onChange={e => onChange('time', e.target.value)}
              disabled={formData.timeUnknown}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
            />
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={formData.timeUnknown}
                onChange={e => onChange('timeUnknown', e.target.checked)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              Unknown
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
          Birth Place <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for a city (e.g., New York, London, Tokyo)..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((loc: any) => (
                <button
                  key={loc.place_id}
                  type="button"
                  onClick={() => onLocationSelect(loc)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors border-t border-gray-100 dark:border-gray-700"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{loc.display_name.split(',')[0]}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{loc.display_name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {formData.latitude && formData.longitude && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              <MapPin className="inline h-4 w-4 mr-1" /> {formData.locationName || `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Timezone: {formData.timezone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionsStep({ formData, onChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Astrology System
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ZODIAC_OPTIONS.map(opt => (
            <label
              key={opt.value}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.zodiac === opt.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="zodiac"
                value={opt.value}
                checked={formData.zodiac === opt.value}
                onChange={e => onChange('zodiac', e.target.value)}
                className="sr-only"
              />
              <p className="font-medium text-gray-900 dark:text-white">{opt.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{opt.description}</p>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          House System
        </label>
        <select
          value={formData.houseSystem}
          onChange={e => onChange('houseSystem', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {HOUSE_SYSTEMS.map(sys => (
            <option key={sys} value={sys}>{sys}</option>
          ))}
        </select>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Placidus is the most common Western system. Whole Sign is traditional.
        </p>
      </div>

      {formData.zodiac === 'sidereal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ayanamsa (Sidereal Offset)
          </label>
          <select
            value={formData.ayanamsa}
            onChange={e => onChange('ayanamsa', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {AYANAMSAS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lahiri is the most widely used. Defines the tropical/sidereal difference.
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewStep({ formData }: any) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Birth Details</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><dt className="text-gray-500 dark:text-gray-400">Name</dt><dd className="font-medium">{formData.name || '—'}</dd></div>
          <div><dt className="text-gray-500 dark:text-gray-400">Date</dt><dd className="font-medium">{formatDate(formData.date)}</dd></div>
          <div><dt className="text-gray-500 dark:text-gray-400">Time</dt><dd className="font-medium">{formData.timeUnknown ? 'Unknown' : formData.time}</dd></div>
          <div><dt className="text-gray-500 dark:text-gray-400">Location</dt><dd className="font-medium">{formData.locationName || `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`}</dd></div>
          <div><dt className="text-gray-500 dark:text-gray-400">Timezone</dt><dd className="font-medium">{formData.timezone}</dd></div>
          <div><dt className="text-gray-500 dark:text-gray-400">System</dt><dd className="font-medium capitalize">{formData.zodiac}</dd></div>
          <div><dt className="text-gray-500 dark:text-gray-400">Houses</dt><dd className="font-medium">{formData.houseSystem}</dd></div>
          {formData.zodiac === 'sidereal' && (
            <div><dt className="text-gray-500 dark:text-gray-400">Ayanamsa</dt><dd className="font-medium">{formData.ayanamsa}</dd></div>
          )}
        </dl>
      </div>
    </div>
  );
}