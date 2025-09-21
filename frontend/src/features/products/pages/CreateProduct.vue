<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePostProduct } from "../api/usePostProduct";
import ProductForm from "../components/ProductForm.vue";
import type { Product } from "../types";
import BaseButton from "../../../components/buttons/BaseButton.vue";

const router = useRouter();

const {
  response: responseCreatedProduct,
  loading: creatingProduct,
  error: creatingProductError,
  execute: createProduct,
} = usePostProduct();

// Form state
const product = ref<Omit<Product, "id">>({ __typename: "ProductInfo" } as Omit<
  Product,
  "id"
>);
const isFormValid = ref(false);

function handleValidationChange(isValid: boolean) {
  isFormValid.value = isValid;
}

async function handleCreate() {
  if (!isFormValid.value) {
    return;
  }

  try {
    await createProduct(product.value);
    if (!creatingProductError.value && responseCreatedProduct.value) {
      router.push(`/products/${responseCreatedProduct.value.id}`);
    }
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

function updateProduct(updatedProduct: Partial<Product>) {
  product.value = { ...product.value, ...updatedProduct };
}

function handleCancel() {
  router.push("/products");
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 w-[80vw]">
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-6 py-4">
        <div class="flex items-center justify-end">
          <div class="flex gap-2">
            <BaseButton @click="handleCancel" variant="basic" size="md">
              Cancel
            </BaseButton>
            <BaseButton
              @click="handleCreate"
              variant="primary"
              size="md"
              :loading="creatingProduct"
              :disabled="!isFormValid"
            >
              Create Product
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Create New Product
        </h1>
        <p class="text-gray-600">
          Fill in the details below to create a new product.
        </p>
      </div>
      <div
        v-if="creatingProductError"
        class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <div class="text-red-800 font-medium">Error creating product:</div>
        <div class="text-red-600 mt-1">{{ creatingProductError }}</div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-8">
          <ProductForm
            :product="product"
            :loading="creatingProduct"
            mode="create"
            @update:product="updateProduct"
            @validation-change="handleValidationChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
