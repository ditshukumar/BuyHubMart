import { z as useInternetIdentity, u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, m as motion, n as ShoppingBag, p as Sparkles, A as LogIn } from "./index-BofEUEVK.js";
function UserLoginPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (identity) {
      navigate({ to: "/" });
    }
  }, [identity, navigate]);
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } finally {
      setIsLoggingIn(false);
    }
  };
  if (loginStatus === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { showCategoryNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full border-2 border-t-transparent border-accent animate-spin" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { showCategoryNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[70vh] px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
      className: "w-full max-w-md",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border p-8 shadow-xl",
          style: {
            background: "linear-gradient(145deg, oklch(0.14 0.035 20 / 0.97), oklch(0.12 0.025 30 / 0.99))",
            borderColor: "oklch(0.5 0.16 38 / 0.35)",
            boxShadow: "0 0 48px oklch(0.55 0.2 38 / 0.12), 0 8px 32px oklch(0 0 0 / 0.45)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.58 0.22 38), oklch(0.48 0.2 20))",
                    boxShadow: "0 0 28px oklch(0.55 0.22 38 / 0.45)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 30, className: "text-white" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "h1",
                {
                  className: "font-display font-black text-3xl tracking-tight",
                  style: { color: "oklch(0.92 0.06 38)" },
                  children: [
                    "BuyHub",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.62 0.22 25)" }, children: "Mart" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs mt-1 font-medium tracking-wide",
                  style: { color: "oklch(0.62 0.06 38)" },
                  children: "Smart Deals, Smart Shopping"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-full h-px mb-7",
                style: {
                  background: "linear-gradient(to right, transparent, oklch(0.5 0.18 30 / 0.35), transparent)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16, style: { color: "oklch(0.72 0.18 38)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "font-display font-bold text-lg",
                    style: { color: "oklch(0.9 0.04 50)" },
                    children: "Sign In to Your Account"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm leading-relaxed",
                  style: { color: "oklch(0.58 0.04 50)" },
                  children: "Login with Internet Identity to get the best deals and personalized experience."
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 mb-8", children: [
              "Access trending deals from Amazon, Flipkart & more",
              "Save favorite products",
              "Secure & private — no password needed"
            ].map((perk) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-start gap-2 text-sm",
                style: { color: "oklch(0.65 0.05 45)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "mt-0.5 flex-shrink-0",
                      style: { color: "oklch(0.7 0.18 38)" },
                      children: "✓"
                    }
                  ),
                  perk
                ]
              },
              perk
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleLogin,
                disabled: isLoggingIn,
                className: "w-full flex items-center justify-center gap-3 h-13 rounded-xl text-base font-bold transition-smooth disabled:opacity-60",
                style: {
                  background: isLoggingIn ? "oklch(0.38 0.14 38)" : "linear-gradient(135deg, oklch(0.58 0.22 38), oklch(0.48 0.2 20))",
                  boxShadow: isLoggingIn ? "none" : "0 4px 20px oklch(0.55 0.22 38 / 0.4)",
                  color: "white",
                  padding: "0.75rem 1.5rem"
                },
                "data-ocid": "user-login-btn",
                children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                  "Connecting..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 20 }),
                  "Sign In with Internet Identity"
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-center text-xs mt-4",
                style: { color: "oklch(0.5 0.04 45)" },
                children: "🔒 Powered by Ditshu — no passwords, fully secure"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => navigate({ to: "/" }),
                className: "text-sm transition-colors duration-200",
                style: { color: "oklch(0.6 0.1 38)" },
                onMouseEnter: (e) => {
                  e.currentTarget.style.color = "oklch(0.72 0.16 38)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.color = "oklch(0.6 0.1 38)";
                },
                "data-ocid": "user-browse-without-login",
                children: "Browse without logging in →"
              }
            ) })
          ]
        }
      )
    }
  ) }) });
}
export {
  UserLoginPage as default
};
