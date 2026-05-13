// ============================================================
// TourEase — Register Page
// ============================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link   from 'next/link';
import { useAuth }  from '@/hooks/use-auth';
import { Button }   from '@/components/ui/button';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast }    from 'sonner';

const ROLES = [
  { value: 'tourist',        label: '🧳 Tourist',        desc: 'Explore & review' },
  { value: 'business_owner', label: '🏢 Business Owner', desc: 'List your business' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('tourist');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Account created! Check your email to confirm.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <>
      <h1 className="text-2xl font-display font-bold text-center mb-1" style={{ color: 'var(--fg)' }}>
        Create Account
      </h1>
      <p className="text-sm text-center mb-6" style={{ color: 'var(--muted-color)' }}>
        Join the TourEase community
      </p>

      {/* Google OAuth */}
      <button
        onClick={() => signInWithGoogle()}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 mb-6"
        style={{ borderColor: 'var(--border-color)', color: 'var(--fg)' }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--muted-color)' }}>or</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>I am a…</label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === r.value
                    ? 'border-ocean-500 bg-ocean-500/10 ring-1 ring-ocean-500/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                style={role !== r.value ? { borderColor: 'var(--border-color)' } : {}}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{r.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted-color)' }}>{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-color)' }} />
            <input id="register-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Dela Cruz" className="input-base pl-10" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-color)' }} />
            <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-base pl-10" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--fg)' }}>Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-color)' }} />
            <input id="register-password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-base pl-10 pr-10" required minLength={6} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-color)' }}>
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-sm text-center mt-6" style={{ color: 'var(--muted-color)' }}>
        Already have an account?{' '}
        <Link href="/login" className="text-ocean-500 font-semibold hover:underline">Sign in</Link>
      </p>
    </>
  );
}
