import { useAdminLogin } from "@/hooks/useBackend";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SESSION_VERIFIED_KEY = "buyhubmart_admin_verified";

function AdminCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full max-w-md rounded-2xl border p-8 shadow-xl"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.14 0.04 20 / 0.96), oklch(0.12 0.03 30 / 0.99))",
        borderColor: "oklch(0.5 0.18 30 / 0.4)",
        boxShadow:
          "0 0 48px oklch(0.55 0.2 30 / 0.15), 0 8px 32px oklch(0 0 0 / 0.45)",
      }}
    >
      {children}
    </div>
  );
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const adminLogin = useAdminLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const ok = await adminLogin.mutateAsync({ email, password });
    if (ok) {
      sessionStorage.setItem(SESSION_VERIFIED_KEY, "1");
      navigate({ to: "/admin" });
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4"
      style={{ background: "oklch(0.1 0.02 265)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <AdminCard>
          {/* Brand */}
          <div className="flex flex-col items-center mb-7">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 38), oklch(0.45 0.2 20))",
                boxShadow: "0 0 28px oklch(0.55 0.22 38 / 0.45)",
              }}
            >
              <ShieldCheck size={30} className="text-white" />
            </div>
            <h1
              className="font-display font-black text-2xl tracking-tight"
              style={{ color: "oklch(0.9 0.06 38)" }}
            >
              BuyHub<span style={{ color: "oklch(0.62 0.22 38)" }}>Mart</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: "oklch(0.6 0.06 38)" }}>
              Admin Login
            </p>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px mb-7"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(0.5 0.18 30 / 0.4), transparent)",
            }}
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.78 0.06 38)" }}
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "oklch(0.55 0.1 38)" }}
                />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(false);
                  }}
                  placeholder="Email address"
                  className="w-full h-11 pl-9 pr-4 rounded-xl text-sm outline-none transition-colors"
                  style={{
                    background: "oklch(0.18 0.04 38 / 0.5)",
                    border: `1px solid ${error ? "oklch(0.6 0.22 25 / 0.7)" : "oklch(0.38 0.06 38 / 0.6)"}`,
                    color: "oklch(0.9 0.04 38)",
                  }}
                  data-ocid="admin-email-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.78 0.06 38)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "oklch(0.55 0.1 38)" }}
                />
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Password"
                  className="w-full h-11 pl-9 pr-4 rounded-xl text-sm outline-none transition-colors"
                  style={{
                    background: "oklch(0.18 0.04 38 / 0.5)",
                    border: `1px solid ${error ? "oklch(0.6 0.22 25 / 0.7)" : "oklch(0.38 0.06 38 / 0.6)"}`,
                    color: "oklch(0.9 0.04 38)",
                  }}
                  data-ocid="admin-password-input"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-center py-2 px-3 rounded-lg"
                style={{
                  background: "oklch(0.22 0.1 25 / 0.35)",
                  border: "1px solid oklch(0.55 0.22 25 / 0.4)",
                  color: "oklch(0.78 0.14 25)",
                }}
                data-ocid="admin-login-error"
              >
                Incorrect email or password
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={adminLogin.isPending || !email || !password}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-base font-bold mt-2 transition-all disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 38), oklch(0.48 0.2 20))",
                boxShadow: "0 4px 16px oklch(0.55 0.22 38 / 0.35)",
                color: "white",
              }}
              data-ocid="admin-login-submit"
            >
              {adminLogin.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <ShieldCheck size={17} />
                  Login
                </>
              )}
            </button>
          </form>

          <p
            className="text-xs text-center mt-5"
            style={{ color: "oklch(0.5 0.04 45)" }}
          >
            🔒 Admin access only — not for regular users
          </p>
        </AdminCard>
      </motion.div>
    </div>
  );
}
