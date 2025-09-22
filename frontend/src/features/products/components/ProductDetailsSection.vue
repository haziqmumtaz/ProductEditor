<script setup lang="ts">
import type { Product } from "../types";

interface Props {
  product: Product;
}

// Reusable tailwind styles class for product field labels
defineProps<Props>();
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div class="group">
          <label> Product Name </label>
          <div class="text-lg text-gray-900 font-medium">
            {{ product.name }}
          </div>
        </div>

        <div class="group">
          <label class="product-field-label"> Product Title </label>
          <div class="text-gray-900">
            {{ product.productTitle }}
          </div>
        </div>

        <div class="group">
          <label> Government ID </label>
          <div class="text-gray-900">
            {{ product.gvtId }}
          </div>
        </div>

        <div class="group">
          <label> Tagline </label>
          <div class="text-gray-900">
            {{ product.productTagline }}
          </div>
        </div>

        <div class="group">
          <label> Voucher Type </label>
          <div class="text-gray-900">
            {{ product.voucherTypeName }}
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="group">
          <label> Product URL </label>
          <div class="text-gray-900">
            {{ product.productUrl }}
          </div>
        </div>

        <div class="group">
          <label> Order URL </label>
          <div class="text-gray-900">
            {{ product.orderUrl }}
          </div>
        </div>

        <div v-if="product.variableDenomPriceMinAmount" class="group">
          <label> Price Range </label>
          <div class="text-gray-900 font-medium">
            ${{ product.variableDenomPriceMinAmount }} - ${{
              product.variableDenomPriceMaxAmount
            }}
          </div>
        </div>
        <div class="group">
          <label> __typename </label>
          <div class="text-gray-900">
            {{ product.__typename }}
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div v-if="product.shortDescription" class="group">
        <label> Short Description </label>
        <div
          class="text-gray-900 leading-relaxed"
          v-html="product.shortDescription"
        ></div>
      </div>

      <div v-if="product.longDescription" class="group">
        <label> Long Description </label>
        <div
          class="text-gray-900 leading-relaxed"
          v-html="product.longDescription"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover label {
  color: #2563eb;
}
</style>
