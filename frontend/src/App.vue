<script setup lang="ts">
import BaseButton from "./components/buttons/BaseButton.vue";
import Header from "./components/layout/BaseHeader.vue";
import { useRouter } from "vue-router";
const router = useRouter();

function handleCreateProduct() {
  router.push("/products/create");
}
</script>

<template>
  <div>
    <Header title="Coda Products Panel">
      <div class="flex">
        <div class="w-40 h-10">
          <BaseButton @click="handleCreateProduct" variant="basic" size="auto">
            Create Product
          </BaseButton>
        </div>
      </div>
    </Header>
    <RouterView />
  </div>
</template>
