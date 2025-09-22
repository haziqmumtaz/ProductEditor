<script setup lang="ts">
import type { Product } from "../types";
import { ViewIcon, EditIcon, DeleteIcon } from "../../../assets/icons";
import BaseButton from "../../../components/buttons/BaseButton.vue";

defineProps<{ product: Product }>();
</script>

<template>
  <div
    class="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
  >
    <div
      id="action-icons"
      class="absolute top-3 right-3 flex flex-col gap-1 z-10"
    >
      <BaseButton
        @click="$emit('viewDetails', product)"
        title="View Details"
        variant="basic"
        size="md"
      >
        <ViewIcon class="w-6 h-6" />
      </BaseButton>

      <BaseButton
        @click="$emit('edit', product)"
        title="Edit Product"
        variant="basic"
        size="md"
      >
        <EditIcon class="w-6 h-6" />
      </BaseButton>

      <BaseButton
        @click="$emit('delete', product)"
        title="Delete Product"
        variant="danger"
        size="md"
      >
        <DeleteIcon class="w-6 h-6" />
      </BaseButton>
    </div>

    <div class="flex justify-center items-center bg-gray-50 h-48 p-4">
      <img
        :src="product.logoLocation"
        :alt="product.name"
        class="object-contain rounded h-full w-full"
        @error="
          ($event.target as HTMLImageElement).src =
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzljYTNhZiIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
        "
      />
    </div>

    <div class="p-4 space-y-3">
      <div class="group flex justify-between">
        <h4>Id: {{ product.id }}</h4>
        <h4>GvtId: {{ product.gvtId }}</h4>
      </div>
      <h4
        class="font-semibold text-gray-900 text-lg leading-tight line-clamp-2"
      >
        {{ product.name }}
      </h4>

      <p
        class="text-gray-600 text-sm line-clamp-2"
        v-html="product.shortDescription"
      />

      <div class="flex items-center justify-between">
        <div
          v-if="product.variableDenomPriceMinAmount"
          class="text-sm text-gray-700 font-medium"
        >
          ${{ product.variableDenomPriceMinAmount }} - ${{
            product.variableDenomPriceMaxAmount
          }}
        </div>
      </div>
    </div>
  </div>
</template>
