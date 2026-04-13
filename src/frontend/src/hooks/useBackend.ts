import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Category,
  FilterState,
  PlatformLink,
  Product,
  ProductInput,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useProducts(filter: FilterState) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["products", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts({
        categoryId: filter.categoryId,
        searchQuery: filter.searchQuery,
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
        sortBy: filter.sortBy,
      });
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useProduct(id: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 60_000,
  });
}

export function useRelatedProducts(productId: bigint | null, limit = 6) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["related", productId?.toString(), limit],
    queryFn: async () => {
      if (!actor || productId === null) return [];
      return actor.getRelatedProducts(productId, BigInt(limit));
    },
    enabled: !!actor && !isFetching && productId !== null,
    staleTime: 60_000,
  });
}

export function useCategories() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useBackendActor();
  const actorReady = !!actor && !isFetching;

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: actorReady,
    // No caching — always get fresh admin status to avoid stale false after claimAdmin
    staleTime: 0,
    // Retry up to 3 times with 500ms delay — handles race condition where
    // claimAdmin commit hasn't propagated by the time isAdmin fires
    retry: 3,
    retryDelay: 500,
    refetchOnMount: true,
  });
}

export function useClaimAdmin() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<boolean> => {
      if (!actor) return false;
      return actor.claimAdmin();
    },
    onSuccess: () => {
      // Invalidate isAdmin so the page re-checks immediately after claim
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useActorReady() {
  const { actor, isFetching } = useBackendActor();
  return { actorReady: !!actor && !isFetching, isFetching };
}

export function useRecordClick() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) return;
      await actor.recordClick(productId);
    },
  });
}

// ─── Platform Links hooks ─────────────────────────────────────────────────────

export function useGetPlatformLinks(productId: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PlatformLink[]>({
    queryKey: ["platformLinks", productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return [];
      return actor.getPlatformLinks(productId);
    },
    enabled: !!actor && !isFetching && productId !== null,
    staleTime: 60_000,
  });
}

export function useRecordPlatformClick() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      platform,
    }: {
      productId: bigint;
      platform: string;
    }) => {
      if (!actor) return;
      await actor.recordPlatformClick(productId, platform);
    },
    onSuccess: (_data, { productId }) => {
      qc.invalidateQueries({
        queryKey: ["platformLinks", productId.toString()],
      });
    },
  });
}

export function useAddProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProduct(input);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.refetchQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: bigint;
      input: ProductInput;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(id, input);
    },
    onSuccess: async (_data, { id }) => {
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.refetchQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", id.toString()] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["products"] });
      await qc.refetchQueries({ queryKey: ["products"] });
    },
  });
}

export function useAddCategory() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      slug,
      iconName,
    }: { name: string; slug: string; iconName: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCategory(name, slug, iconName);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// ─── Hot Deals & Category Count hooks ────────────────────────────────────────

export function useHotDeals(limit: number) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["hotDeals", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHotDeals(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useProductCountByCategory(categoryId: number | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<bigint>({
    queryKey: ["productCountByCategory", categoryId],
    queryFn: async () => {
      if (!actor || categoryId === null) return BigInt(0);
      return actor.getProductCountByCategory(BigInt(categoryId));
    },
    enabled: !!actor && !isFetching && categoryId !== null,
    staleTime: 60_000,
  });
}

// ─── ProductMetadata type (for fetchProductMetadata) ─────────────────────────
// Not yet in auto-generated bindings — defined here alongside the hook.

export interface ProductMetadata {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  detectedPlatform: string;
}

type FetchMetadataResult = Array<{ Ok: ProductMetadata } | { Err: string }>;

type ActorWithFetchMetadata = {
  fetchProductMetadata(url: string): Promise<FetchMetadataResult>;
};

export function useFetchProductMetadata() {
  const { actor } = useBackendActor();
  return useMutation<ProductMetadata, Error, string>({
    mutationFn: async (url: string): Promise<ProductMetadata> => {
      if (!actor) throw new Error("Not connected");
      const result = await (
        actor as unknown as ActorWithFetchMetadata
      ).fetchProductMetadata(url);
      const first = result[0];
      if (!first) throw new Error("Empty response from backend");
      if ("Err" in first) throw new Error(first.Err);
      return first.Ok;
    },
  });
}

// ─── Admin email/password login hook ─────────────────────────────────────────
// Calls backend.adminLogin(email, password) and returns true if credentials match.
// The backend method is not yet in the generated bindings, so we cast the actor
// to access it safely.

type ActorWithAdminLogin = {
  adminLogin(email: string, password: string): Promise<boolean>;
};

export function useAdminLogin() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<boolean> => {
      if (!actor) return false;
      return (actor as unknown as ActorWithAdminLogin).adminLogin(
        email,
        password,
      );
    },
  });
}
