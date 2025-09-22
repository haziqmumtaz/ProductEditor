<script setup lang="ts">
import BaseButton from "./components/buttons/BaseButton.vue";
import Header from "./components/layout/BaseHeader.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
const router = useRouter();

const routeName = computed(() => router.currentRoute.value.name);

function handleCreateProduct() {
  router.push("/products/create");
}
</script>

<template>
  <div>
    <Header title="Coda Products Panel">
      <div class="flex">
        <div class="w-40 h-10">
          <BaseButton
            v-if="routeName !== 'CreateProduct'"
            @click="handleCreateProduct"
            :disabled="false"
            variant="basic"
            size="auto"
          >
            Create Product
          </BaseButton>
        </div>
      </div>
    </Header>
    <RouterView />
  </div>
</template>
