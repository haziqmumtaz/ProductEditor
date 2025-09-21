<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGetProductById } from "../api/useGetProductById";
import { usePatchProduct } from "../api/usePatchProduct";
import ProductForm from "../components/ProductForm.vue";
import ProductDetailsSection from "../components/ProductDetailsSection.vue";
import type { Product } from "../types";
import BaseButton from "../../../components/buttons/BaseButton.vue";

const route = useRoute();
const router = useRouter();

// State
const {
  response: responseProduct,
  loading: loadingProduct,
  error: loadingProductError,
  execute: getProduct,
} = useGetProductById();

const {
  response: responsePatchedProduct,
  loading: patchingProduct,
  error: patchingProductError,
  execute: patchProduct,
} = usePatchProduct();

const product = ref<Product>({} as Product);
const isEditing = ref(route.name === "EditProduct");
const isFormValid = ref(false);

// Computed Product ID from Param
const productId = computed(() => route.params.id as string);

// Watch for route changes to update editing state
watch(
  () => route.name,
  (newRouteName) => {
    isEditing.value = newRouteName === "EditProduct";
  }
);

async function loadProduct() {
  await getProduct(parseInt(productId.value));
  product.value = responseProduct.value;
}

function startEditing() {
  if (route.name === "EditProduct") {
    return;
  }
  router.push(`/products/${productId.value}/edit`);
}

function cancelEditing() {
  isEditing.value = false;
  product.value = responseProduct.value;
  router.push(`/products/${productId.value}`);
}

async function saveChanges() {
  if (!product.value || !isFormValid.value) {
    console.warn("Form has invalid fields, cannot update product");
    return;
  }
  await patchProduct(parseInt(productId.value), product.value);
  if (!patchingProductError.value) {
    product.value = responsePatchedProduct.value;
    isEditing.value = false;
    router.push(`/products/${productId.value}`);
  }
}

function updateProduct(updatedProduct: Partial<Product>) {
  product.value = { ...product.value, ...updatedProduct };
}

function handleValidationChange(isValid: boolean) {
  isFormValid.value = isValid;
}

function goBack() {
  router.push("/products");
}

onMounted(() => {
  loadProduct();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 w-[75vw]">
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <BaseButton @click="goBack" variant="basic" size="md">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Products List
          </BaseButton>

          <BaseButton
            v-if="!isEditing"
            @click="startEditing"
            variant="primary"
            size="md"
          >
            Edit
          </BaseButton>

          <div v-else class="flex gap-2">
            <BaseButton @click="cancelEditing" variant="basic" size="md">
              Cancel
            </BaseButton>
            <BaseButton
              @click="saveChanges"
              variant="primary"
              size="md"
              :loading="patchingProduct"
              :disabled="!isFormValid"
            >
              Save Changes
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-8">
      <div class="group">
        <div
          class="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center rounded-lg"
        >
          <img
            :src="product.logoLocation"
            :alt="product.name"
            class="max-h-48 max-w-full object-contain rounded-lg shadow-md"
            @error="
              ($event.target as HTMLImageElement).src =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2Y5ZmFmYiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhZiIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
            "
          />
        </div>
      </div>
      <div v-if="patchingProductError">
        <div class="text-red-600 mb-4">
          Product Could Not Be Updated - Please try again
        </div>
      </div>
      <div v-if="loadingProduct" class="flex justify-center items-center h-64">
        <div class="text-gray-500">Loading product details...</div>
      </div>

      <div v-else-if="loadingProductError" class="text-center py-12">
        <div class="text-red-600 mb-4">{{ loadingProductError }}</div>
        <button
          @click="loadProduct"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>

      <div
        v-else-if="product.id && !loadingProduct && !loadingProductError"
        class="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div class="p-8">
          <ProductForm
            v-if="isEditing"
            :product="product"
            :loading="patchingProduct"
            mode="edit"
            @update:product="updateProduct"
            @validation-change="handleValidationChange"
          />

          <ProductDetailsSection v-else :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover label {
  color: #2563eb;
}

input:focus,
textarea:focus {
  outline: none;
}
</style>
