"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-[20px] shadow-sm border border-light-border w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-forest" />
          </div>
        </div>
        
        <h1 className="text-3xl font-heading text-forest text-center mb-2">Admin Portal</h1>
        <p className="text-muted text-center mb-8">Enter your secure password to manage bookings.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-[12px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
