<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import ConfirmationModal from "../../../components/modals/ConfirmationModal.vue";
import SearchBar from "../../../components/searchBar/BaseSearchBar.vue";
import { useDeleteProduct } from "../api/useDeleteProduct";
import {
  useGetProducts,
  type ProductsQueryParams,
} from "../api/useGetProducts";
import ProductCard from "../components/ProductCard.vue";
import type { Product } from "../types";

// Parameters for the products get request
const searchQuery = ref("");
const currentPage = ref(1);
const pageLimit = ref(12);
const sortBy = ref("id");
const sortOrder = ref("asc");

// Infinite scroll state variables
const allProducts = ref<Product[]>([]);
const hasMoreProducts = ref(true);
const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// Products get request hook
const {
  response: responseProducts,
  loading,
  error,
  execute: getProducts,
} = useGetProducts();

// Products delete request hook
const { execute: deleteProduct } = useDeleteProduct();

// Router for navigation
const router = useRouter();

// Function to load products and handle changes
async function loadProducts(reset = false) {
  const params: ProductsQueryParams = {
    query: searchQuery.value,
    page: reset ? 1 : currentPage.value,
    limit: pageLimit.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  };

  // Clear the array immediately when resetting to prevent showing old data
  if (reset) {
    allProducts.value = [];
    currentPage.value = 1;
  }

  await getProducts(params);

  if (responseProducts.value) {
    allProducts.value = [...allProducts.value, ...responseProducts.value.data];
    currentPage.value = currentPage.value + 1;
    hasMoreProducts.value = responseProducts.value.hasNext;
  }
}

function onSearch(query: string) {
  searchQuery.value = query;
  loadProducts(true);
}

const isDeleteModalOpen = ref(false);
const productToDelete = ref<Product | null>(null);

// Handle card actions
function handleViewDetails(product: Product) {
  router.push(`/products/${product.id}`);
}

function handleEdit(product: Product) {
  router.push(`/products/${product.id}/edit`);
}

function handleDelete(product: Product) {
  productToDelete.value = product;
  isDeleteModalOpen.value = true;
}

async function confirmDelete() {
  if (productToDelete.value) {
    const productIdToDelete = productToDelete.value.id;
    await deleteProduct(productIdToDelete);
    const filteredProducts = allProducts.value.filter(
      (p) => p.id !== productIdToDelete
    );
    allProducts.value = filteredProducts;
    productToDelete.value = null;
    isDeleteModalOpen.value = false;
  }
}

function cancelDelete() {
  productToDelete.value = null;
  isDeleteModalOpen.value = false;
}

// Setup intersection observer for infinite scroll
function setupIntersectionObserver() {
  if (!loadMoreTrigger.value) {
    return;
  }

  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMoreProducts.value) {
        if (!loading.value) {
          loadProducts(false);
        }
      }
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    }
  );

  observer.observe(loadMoreTrigger.value);
}

function handleSortByChange(value: string) {
  sortBy.value = value;
  loadProducts(true);
}

function handleSortOrderChange(value: string) {
  sortOrder.value = value;
  loadProducts(true);
}

onMounted(() => {
  loadProducts(true);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Watch for loadMoreTrigger changes to setup observer
watch(loadMoreTrigger, (newTrigger) => {
  if (newTrigger) {
    nextTick(() => {
      setupIntersectionObserver();
    });
  }
});
</script>

<template>
  <div class="p-4 pt-8 w-[80vw]">
    <div class="mb-6 flex items-center justify-between pt-10">
      <h1>Products</h1>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            v-model="sortBy"
            @change="loadProducts(true)"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="id">ID</option>
            <option value="gvtId">GvtID</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">Order:</label>
          <select
            v-model="sortOrder"
            @change="loadProducts(true)"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <SearchBar @search="onSearch" />
      </div>
    </div>

    <div>
      <div v-if="error" class="flex items-center justify-center h-64">
        <div class="text-red-600">{{ error }}</div>
      </div>
      <div v-else>
        <div
          v-if="allProducts.length === 0 && !loading"
          class="flex items-center justify-center h-64"
        >
          <div class="text-gray-500">No products found.</div>
        </div>
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard
              v-for="p in allProducts"
              :key="p.id"
              :product="p"
              @view-details="handleViewDetails"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>

          <div v-if="hasMoreProducts" ref="loadMoreTrigger" class="h-1"></div>
        </div>
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-gray-500">Loading products…</div>
        </div>
        <div
          v-if="!hasMoreProducts && allProducts.length > 0 && !loading"
          class="flex justify-center items-center py-8"
        >
          <div class="text-gray-400 text-sm">No more products to load.</div>
        </div>
      </div>
    </div>

    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Delete Product"
      :message="`Are you sure you want to delete ${productToDelete?.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="danger"
      @close="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>
