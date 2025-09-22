<script setup lang="ts">
import { ref, watch } from "vue";
import {
  createProductSchema,
  updateProductSchema,
} from "../api/schemas/productSchema";
import type { Product } from "../types";

interface Props {
  product: Product | Omit<Product, "id">;
  loading?: boolean;
  disabled?: boolean;
  mode?: "create" | "edit";
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  mode: "edit",
});

const emit = defineEmits<{
  "update:product": [product: Partial<Product>];
  "validation-change": [isValid: boolean];
}>();

// Form state
const errors = ref<Record<string, string>>({});
const touched = ref<Record<string, boolean>>({});
let debounceTimeout: NodeJS.Timeout | undefined;

// Form data
const form = ref<Product | Omit<Product, "id">>({ ...props.product });

// Watch for form changes and emit updates (for edit mode) with debounce
watch(
  form,
  (newForm) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      emit("update:product", newForm);
    }, 300);
  },
  { deep: true }
);

function validateForm() {
  try {
    const schema =
      props.mode === "create" ? createProductSchema : updateProductSchema;
    schema.parse(form.value);
    errors.value = {};
    emit("validation-change", true);
    return true;
  } catch (error: any) {
    if (error) {
      const newErrors: Record<string, string> = {};
      JSON.parse(error).forEach((err: any) => {
        const field = err.path[0];
        newErrors[field] = err.message;
      });
      errors.value = newErrors;
    }
    emit("validation-change", false);
    return false;
  }
}

function validateField(field: string) {
  touched.value[field] = true;
  if (
    field === "variableDenomPriceMinAmount" ||
    field === "variableDenomPriceMaxAmount"
  ) {
    form.value[field] = form.value[field]?.toString() ?? "";
  }
  validateForm();
}
</script>

<template>
  <form class="space-y-6">
    <div class="group">
      <label>
        Logo Location
      </label>
      <input
        label="Logo Location"
        v-model="form.logoLocation"
        type="url"
        placeholder="Image URL"
        :class="{
          'invalid-form-field': errors.logoLocation && touched.logoLocation,
        }"
        @blur="validateField('logoLocation')"
        @input="validateField('logoLocation')"
      />
      <div
        v-if="errors.logoLocation && touched.logoLocation"
        class="text-danger"
      >
        {{ errors.logoLocation }}
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-6">
        <div class="group">
          <label>
            Product Name
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter product name"
            :class="{ 'invalid-form-field': errors.name && touched.name }"
            @input="validateField('name')"
            @blur="validateField('name')"
          />
          <div v-if="errors.name && touched.name" class="text-danger">
            {{ errors.name }}
          </div>
        </div>

        <div class="group">
          <label>
            Product Title
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.productTitle"
            type="text"
            placeholder="Enter product title"
            class="form-control"
            :class="{
              'invalid-form-field': errors.productTitle && touched.productTitle,
            }"
            @blur="validateField('productTitle')"
            @input="validateField('productTitle')"
          />
          <div
            v-if="errors.productTitle && touched.productTitle"
            class="text-danger"
          >
            {{ errors.productTitle }}
          </div>
        </div>

        <div class="group">
          <label>
            GvtID
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.gvtId"
            type="number"
            placeholder="Enter gvtId"
            :class="{ 'invalid-form-field': errors.gvtId && touched.gvtId }"
            @blur="validateField('gvtId')"
            @input="validateField('gvtId')"
          />
          <div v-if="errors.gvtId && touched.gvtId" class="text-danger">
            {{ errors.gvtId }}
          </div>
        </div>

        <div class="group">
          <label>
            Product Tagline
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.productTagline"
            type="text"
            placeholder="Enter product tagline"
            :class="{
              'invalid-form-field':
                errors.productTagline && touched.productTagline,
            }"
            @blur="validateField('productTagline')"
            @input="validateField('productTagline')"
          />
          <div
            v-if="errors.productTagline && touched.productTagline"
            class="text-danger"
          >
            {{ errors.productTagline }}
          </div>
        </div>

        <div class="group">
          <label>
            Voucher Type Name
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.voucherTypeName"
            type="text"
            placeholder="Enter voucher type name"
            :class="{
              'invalid-form-field':
                errors.voucherTypeName && touched.voucherTypeName,
            }"
            @blur="validateField('voucherTypeName')"
            @input="validateField('voucherTypeName')"
          />
          <div
            v-if="errors.voucherTypeName && touched.voucherTypeName"
            class="text-danger"
          >
            {{ errors.voucherTypeName }}
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="group">
          <label>
            Product URL
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.productUrl"
            type="text"
            placeholder="Enter product URL"
            :class="{
              'invalid-form-field': errors.productUrl && touched.productUrl,
            }"
            @blur="validateField('productUrl')"
            @input="validateField('productUrl')"
          />
          <div
            v-if="errors.productUrl && touched.productUrl"
            class="text-danger"
          >
            {{ errors.productUrl }}
          </div>
        </div>

        <div class="group">
          <label>
            Order URL
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.orderUrl"
            type="url"
            placeholder="Enter order URL"
            :class="{
              'invalid-form-field': errors.orderUrl && touched.orderUrl,
            }"
            @blur="validateField('orderUrl')"
            @input="validateField('orderUrl')"
          />
          <div v-if="errors.orderUrl && touched.orderUrl" class="text-danger">
            {{ errors.orderUrl }}
          </div>
        </div>

        <div class="group">
          <label >
            Denom Price Min Amount
          </label>
          <input
            v-model="form.variableDenomPriceMinAmount"
            type="number"
            step="0.1"
            placeholder="Enter minimum amount"
            :class="{
              'invalid-form-field':
                errors.variableDenomPriceMinAmount &&
                touched.variableDenomPriceMinAmount,
            }"
            @blur="validateField('variableDenomPriceMinAmount')"
            @input="validateField('variableDenomPriceMinAmount')"
          />
          <div
            v-if="
              errors.variableDenomPriceMinAmount &&
              touched.variableDenomPriceMinAmount
            "
            class="text-danger"
          >
            {{ errors.variableDenomPriceMinAmount }}
          </div>
        </div>

        <div class="group">
          <label  >
            Denom Price Max Amount
          </label>
          <input
            v-model="form.variableDenomPriceMaxAmount"
            type="number"
            step="0.1"
            placeholder="Enter maximum amount"
            :class="{
              'invalid-form-field':
                errors.variableDenomPriceMaxAmount &&
                touched.variableDenomPriceMaxAmount,
            }"
            @blur="validateField('variableDenomPriceMaxAmount')"
            @input="validateField('variableDenomPriceMaxAmount')"
          />
        </div>
        <div class="group">
          <div
            v-if="
              errors.variableDenomPriceMaxAmount &&
              touched.variableDenomPriceMaxAmount
            "
            class="text-danger"
          >
            {{ errors.variableDenomPriceMaxAmount }}
          </div>
        </div>
        <div class="group">
          <label class="pb-4"> Type of Product </label>
          <select v-model="form.__typename">
            <option value="ProductInfo">ProductInfo</option>
          </select>
          <div
            v-if="errors.__typename && touched.__typename"
            class="text-danger"
          >
            {{ errors.__typename }}
          </div>
        </input>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="group">
        <label>
          Short Description
          <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.shortDescription"
          placeholder="Enter short description"
          rows="4"
          :class="{
            'invalid-form-field':
              errors.shortDescription && touched.shortDescription,
          }"
          @blur="validateField('shortDescription')"
          @input="validateField('shortDescription')"
        ></textarea>
        <div>{{ form?.shortDescription?.length || 0 }} / 2000</div>
        <div
          v-if="errors.shortDescription && touched.shortDescription"
          class="text-danger"
        >
          {{ errors.shortDescription }}
        </div>
      </div>

      <div class="group">
        <label>
          Long Description
          <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.longDescription"
          placeholder="Enter long description"
          rows="6"
          :class="{
            'invalid-form-field':
              errors.longDescription && touched.longDescription,
          }"
          @blur="validateField('longDescription')"
          @input="validateField('longDescription')"
        ></textarea>
        <p>{{ form?.longDescription?.length || 0 }} / 3000</p>
        <div
          v-if="errors.longDescription && touched.longDescription"
          class="text-danger"
        >
          {{ errors.longDescription }}
        </div>
      </div>
    </div>
  </form>
</template>
