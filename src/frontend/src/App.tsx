import { Skeleton } from "@/components/ui/skeleton";
import { Outlet, RouterProvider, createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { Component, Suspense, lazy } from "react";
import type { ErrorInfo, ReactNode } from "react";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
const HomePage=lazy(()=>import("./pages/HomePage"));
const ProductsPage=lazy(()=>import("./pages/ProductsPage"));
const ProductDetailPage=lazy(()=>import("./pages/ProductDetailPage"));
const CategoryPage=lazy(()=>import("./pages/CategoryPage"));
const UserLoginPage=lazy(()=>import("./pages/UserLoginPage"));
const ComparePage=lazy(()=>import("./pages/ComparePage"));
const CartPage=lazy(()=>import("./pages/CartPage"));
const CheckoutPage=lazy(()=>import("./pages/CheckoutPage"));
const TrackOrderPage=lazy(()=>import("./pages/TrackOrderPage"));
const SESSION_VERIFIED_KEY="buyhubmart_admin_verified";
const SKELETON_IDS=["s1","s2","s3","s4","s5","s6","s7","s8"];
function PageLoader(){return <div className="container max-w-7xl mx-auto px-4 py-8"><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{SKELETON_IDS.map(id=><div key={id} className="rounded-xl overflow-hidden"><Skeleton className="aspect-square w-full"/><div className="p-3 space-y-2"><Skeleton className="h-4 w-3/4"/><Skeleton className="h-3 w-full"/><Skeleton className="h-8 w-full rounded-full"/></div></div>)}</div></div>}
interface ErrorBoundaryState{hasError:boolean;errorMessage:string}
class ErrorBoundary extends Component<{children:ReactNode},ErrorBoundaryState>{constructor(p:{children:ReactNode}){super(p);this.state={hasError:false,errorMessage:""}}static getDerivedStateFromError(e:Error){return{hasError:true,errorMessage:e?.message??"Unknown error"}}componentDidCatch(e:Error,i:ErrorInfo){console.error("[BuyHubMart] Uncaught error:",e,i)}render(){if(this.state.hasError)return <div className="min-h-screen bg-background flex items-center justify-center px-4"><div className="text-center max-w-md"><div className="text-5xl mb-4">⚠️</div><h1 className="font-display font-bold text-xl mb-2">Something went wrong</h1><p className="text-muted-foreground text-sm mb-6">The page encountered an unexpected error. Please refresh and try again.</p><button type="button" onClick={()=>window.location.reload()} className="px-6 py-2 rounded-full bg-primary text-primary-foreground">Refresh Page</button></div></div>;return this.props.children}}
class AdminErrorBoundary extends Component<{children:ReactNode},{hasError:boolean}>{constructor(p:{children:ReactNode}){super(p);this.state={hasError:false}}static getDerivedStateFromError(){return{hasError:true}}componentDidCatch(e:Error,i:ErrorInfo){console.error("[BuyHubMart] Admin page error:",e,i)}render(){return this.state.hasError?<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-center"><div className="text-5xl mb-4">🔧</div><h1 className="font-display font-bold text-xl mb-2">Admin page could not load</h1><button type="button" onClick={()=>window.location.reload()} className="px-6 py-2 rounded-full bg-primary text-primary-foreground">Refresh Page</button></div></div>:this.props.children}}
const rootRoute=createRootRoute({component:()=> <ErrorBoundary><Suspense fallback={<PageLoader/>}><Outlet/></Suspense></ErrorBoundary>});
const indexRoute=createRoute({getParentRoute:()=>rootRoute,path:"/",component:HomePage});
const productsRoute=createRoute({getParentRoute:()=>rootRoute,path:"/products",validateSearch:(s:Record<string,unknown>)=>({q:typeof s.q==="string"?s.q:undefined,sort:typeof s.sort==="string"?s.sort:undefined,minPrice:typeof s.minPrice==="number"?s.minPrice:undefined,maxPrice:typeof s.maxPrice==="number"?s.maxPrice:undefined}),component:ProductsPage});
const productDetailRoute=createRoute({getParentRoute:()=>rootRoute,path:"/products/$productId",component:ProductDetailPage});
const categoryRoute=createRoute({getParentRoute:()=>rootRoute,path:"/categories/$categorySlug",component:CategoryPage});
const cartRoute=createRoute({getParentRoute:()=>rootRoute,path:"/cart",component:CartPage});
const checkoutRoute=createRoute({getParentRoute:()=>rootRoute,path:"/checkout",component:CheckoutPage});
const loginRoute=createRoute({getParentRoute:()=>rootRoute,path:"/login",component:UserLoginPage});
const compareRoute=createRoute({getParentRoute:()=>rootRoute,path:"/compare",component:ComparePage});
const trackOrderRoute=createRoute({getParentRoute:()=>rootRoute,path:"/orders/track",validateSearch:(s:Record<string,unknown>)=>({orderId:typeof s.orderId==="string"?s.orderId:undefined}),component:TrackOrderPage});
const adminLoginRoute=createRoute({getParentRoute:()=>rootRoute,path:"/admin/login",component:()=> <AdminErrorBoundary><AdminLoginPage/></AdminErrorBoundary>});
const adminRoute=createRoute({getParentRoute:()=>rootRoute,path:"/admin",beforeLoad:()=>{if(sessionStorage.getItem(SESSION_VERIFIED_KEY)!== "1")throw redirect({to:"/admin/login"})},component:()=> <AdminErrorBoundary><AdminPage/></AdminErrorBoundary>});
function NotFoundPage(){return <div className="min-h-screen bg-background flex items-center justify-center px-4"><div className="text-center"><div className="text-6xl mb-4">🛍️</div><h1 className="font-display font-bold text-2xl mb-2">Page not found</h1><a href="/" className="px-6 py-2 rounded-full bg-primary text-primary-foreground">Back to Home</a></div></div>}
const notFoundRoute=createRoute({getParentRoute:()=>rootRoute,path:"*",component:NotFoundPage});
const routeTree=rootRoute.addChildren([indexRoute,productsRoute,productDetailRoute,categoryRoute,cartRoute,checkoutRoute,loginRoute,compareRoute,trackOrderRoute,adminLoginRoute,adminRoute,notFoundRoute]);
const router=createRouter({routeTree});
declare module "@tanstack/react-router"{interface Register{router:typeof router}}
export default function App(){return <ErrorBoundary><RouterProvider router={router}/></ErrorBoundary>}
