import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCategories } from "@/hooks/useBackend";
import type { Category } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  ChevronRight,
  Cpu,
  Flame,
  LayoutGrid,
  LogIn,
  LogOut,
  Menu,
  Shirt,
  ShoppingBag,
  Watch,
} from "lucide-react";
import { useState } from "react";
import { CategoryNav } from "./CategoryNav";
import { SearchBar } from "./SearchBar";

type NavCategory = {
  name: string;
  slug: string;
  Icon: React.ElementType;
  activeColor?: string;
};

const NAV_CATEGORIES: NavCategory[] = [
  { name: "All", slug: "all", Icon: LayoutGrid },
  { name: "Gadgets", slug: "gadgets", Icon: Cpu },
  { name: "Fashion", slug: "fashion", Icon: Shirt },
  { name: "Accessories", slug: "accessories", Icon: Watch },
  {
    name: "Trending",
    slug: "trending",
    Icon: Flame,
    activeColor: "text-red-400",
  },
];

interface LayoutProps {
  children: React.ReactNode;
  showCategoryNav?: boolean;
}

function HeaderNav({
  categories: _categories,
}: { onSearch: (q: string) => void; categories: Category[] }) {
  const { identity, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;

  return (
    <nav className="hidden md:flex items-center gap-1">
      {NAV_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          to="/categories/$categorySlug"
          params={{ categorySlug: cat.slug }}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-200"
          activeProps={{
            className:
              "text-accent font-semibold bg-accent/15 rounded-full px-3 py-1.5",
          }}
          data-ocid={`nav-${cat.slug}`}
        >
          <cat.Icon
            size={15}
            className={`flex-shrink-0 transition-colors duration-200 group-hover:${cat.activeColor ?? "text-accent"} ${cat.activeColor ?? ""}`}
          />
          <span>{cat.name}</span>
        </Link>
      ))}
      {/* Compare link */}
      <Link
        to="/compare"
        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-200"
        activeProps={{
          className:
            "text-accent font-semibold bg-accent/15 rounded-full px-3 py-1.5",
        }}
        data-ocid="nav-compare"
      >
        <ArrowLeftRight
          size={15}
          className="flex-shrink-0 transition-colors duration-200 group-hover:text-accent"
        />
        <span>Compare</span>
      </Link>
      {isLoggedIn ? (
        <button
          type="button"
          onClick={() => clear()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-1 px-3 py-1.5 rounded-full hover:bg-muted"
          data-ocid="nav-logout"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      ) : (
        <Link to="/login" className="ml-1">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full flex items-center gap-1.5 border-accent/40 hover:border-accent hover:text-accent hover:bg-accent/10 transition-all duration-200"
            data-ocid="nav-login"
          >
            <LogIn size={14} />
            Sign In
          </Button>
        </Link>
      )}
    </nav>
  );
}

function MobileMenu({ categories: _cats }: { categories: Category[] }) {
  const { identity, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-1 py-2">
      {NAV_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          to="/categories/$categorySlug"
          params={{ categorySlug: cat.slug }}
          className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl hover:bg-accent/10 hover:text-accent transition-all duration-200 group"
          data-ocid={`mobile-nav-${cat.slug}`}
        >
          <cat.Icon
            size={18}
            className={`flex-shrink-0 ${cat.activeColor ?? "text-muted-foreground group-hover:text-accent"}`}
          />
          <span className="flex-1">{cat.name}</span>
          <ChevronRight
            size={16}
            className="text-muted-foreground/50 group-hover:text-accent/60 transition-colors duration-200"
          />
        </Link>
      ))}
      {/* Compare link */}
      <Link
        to="/compare"
        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl hover:bg-accent/10 hover:text-accent transition-all duration-200 group"
        data-ocid="mobile-nav-compare"
      >
        <ArrowLeftRight
          size={18}
          className="flex-shrink-0 text-muted-foreground group-hover:text-accent"
        />
        <span className="flex-1">Compare Prices</span>
        <ChevronRight
          size={16}
          className="text-muted-foreground/50 group-hover:text-accent/60 transition-colors duration-200"
        />
      </Link>
      <div className="mt-4 px-4">
        {isLoggedIn ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => clear()}
            data-ocid="mobile-logout"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        ) : (
          <Button
            className="w-full btn-primary"
            onClick={() => navigate({ to: "/login" })}
            data-ocid="mobile-login"
          >
            <LogIn size={16} className="mr-2" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}

export function Layout({ children, showCategoryNav = true }: LayoutProps) {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const [_menuOpen, _setMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    navigate({
      to: "/products",
      search: {
        q: query || undefined,
        sort: undefined,
        minPrice: undefined,
        maxPrice: undefined,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-40 bg-card border-b border-border shadow-xs"
        data-ocid="site-header"
      >
        <div className="container max-w-7xl mx-auto px-4">
          {/* Top row: logo + search + nav */}
          <div className="flex items-center gap-3 h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center flex-shrink-0 group"
              data-ocid="logo"
            >
              <img
                src="/assets/images/logo.png"
                alt="BuyHub Mart"
                className="h-10 w-auto object-contain group-hover:scale-105 transition-smooth"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const sibling = e.currentTarget
                    .nextElementSibling as HTMLElement | null;
                  if (sibling) sibling.style.display = "flex";
                }}
              />
              <span
                className="font-display font-black text-xl hidden items-center gap-1"
                style={{ color: "oklch(0.9 0.06 38)" }}
              >
                <ShoppingBag
                  size={20}
                  style={{ color: "oklch(0.62 0.22 38)" }}
                />
                BuyHub<span style={{ color: "oklch(0.62 0.22 25)" }}>Mart</span>
              </span>
            </Link>

            {/* Search bar */}
            <div className="flex-1 sm:max-w-lg sm:mx-2">
              <SearchBar value="" onSearch={handleSearch} />
            </div>

            {/* Desktop Nav */}
            <HeaderNav onSearch={handleSearch} categories={categories} />

            {/* Mobile: hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden flex-shrink-0"
                  aria-label="Open menu"
                  data-ocid="mobile-menu-trigger"
                >
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card">
                <div className="flex items-center gap-2 mb-6 pt-2">
                  <img
                    src="/assets/images/logo.png"
                    alt="BuyHub Mart"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <MobileMenu categories={categories} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Category nav tabs */}
          {showCategoryNav && (
            <div className="pb-3">
              <CategoryNav
                categories={categories}
                onSelect={(catId) => {
                  if (!catId) {
                    navigate({
                      to: "/products",
                      search: {
                        q: undefined,
                        sort: undefined,
                        minPrice: undefined,
                        maxPrice: undefined,
                      },
                    });
                  } else {
                    const cat = categories.find((c) => c.id === catId);
                    if (cat) {
                      navigate({
                        to: "/categories/$categorySlug",
                        params: { categorySlug: cat.slug },
                      });
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="bg-card border-t border-border mt-12"
        data-ocid="site-footer"
      >
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/logo.png"
                alt="BuyHub Mart"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Smart Deals, Smart Shopping · buyhubmart.in
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Affiliate links may earn us a commission. Prices subject to
              change.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BuyHub Mart. All rights reserved.
            </p>
          </div>
          <div className="border-t border-border mt-6 pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Developer: <span className="font-medium">Ditshu Kumar</span>
              {" · "}
              <a
                href="mailto:ditshukumar@gmail.com"
                className="hover:text-accent transition-colors duration-200"
              >
                ditshukumar@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
