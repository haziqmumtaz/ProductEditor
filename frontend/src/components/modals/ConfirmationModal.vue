<script setup lang="ts">
import BaseModal from "./BaseModal.vue";
import BaseButton from "../buttons/BaseButton.vue";

interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

withDefaults(defineProps<Props>(), {
  title: "Confirm Action",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "danger",
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

function handleConfirm() {
  emit("confirm");
  emit("close");
}
</script>

<template>
  <BaseModal :is-open="isOpen" :title="title" size="md" @close="$emit('close')">
    <div class="flex items-start gap-4">
      <div class="flex-1">
        <p class="text-gray-600 leading-relaxed">
          {{ message }}
        </p>
      </div>
    </div>

    <template #footer>
      <BaseButton @click="$emit('close')" variant="basic" size="md">
        {{ cancelText }}
      </BaseButton>

      <BaseButton @click="handleConfirm" variant="danger" size="md">
        {{ confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
