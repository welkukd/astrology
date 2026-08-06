'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { Moon, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { supabase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { setError('Auth not initialized'); return; }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/chart/new');
      router.refresh();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-8"><Moon className="h-8 w-8 text-primary-600" /> Astrology App</Link>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sign In</h1>
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-700 dark:text-red-400"><AlertCircle className="h-5 w-5" />{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}Sign In</button>
        </form>
        <div className="mt-4 text-center"><button onClick={async () => { if (supabase) await supabase.auth.signInWithOAuth({ provider: 'google' }); }} className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Continue with Google</button></div>
        <p className="mt-4 text-center text-sm text-gray-500">Don't have an account? <Link href="/auth/signup" className="text-primary-600 hover:underline">Sign Up</Link></p>
      </div>
    </div>
  );
}
