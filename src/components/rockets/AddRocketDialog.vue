<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="600"
    persistent
    :fullscreen="$vuetify.display.smAndDown"
  >
    <v-card class="add-rocket-dialog">
      <!-- Header -->
      <v-card-title class="dialog-header">
        <div class="d-flex align-center gap-3">
          <div class="icon-wrapper">
            <v-icon color="primary">mdi-rocket-launch</v-icon>
          </div>
          <div>
            <h3>Add New Rocket</h3>
            <p class="text-caption text-medium-emphasis mb-0">Create a custom rocket entry</p>
          </div>
        </div>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-divider />
      
      <!-- Form -->
      <v-card-text class="dialog-content">
        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-row>
            <!-- Rocket Name -->
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Rocket Name"
                placeholder="e.g., Super Heavy Starship"
                prepend-inner-icon="mdi-rocket"
                :rules="[rules.required, rules.minLength(3)]"
                counter
                maxlength="50"
              />
            </v-col>
            
            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                placeholder="Describe the rocket's capabilities and features..."
                prepend-inner-icon="mdi-text"
                :rules="[rules.required, rules.minLength(20)]"
                counter
                maxlength="500"
                rows="3"
                auto-grow
              />
            </v-col>
            
            <!-- Image URL -->
            <v-col cols="12">
              <v-text-field
                v-model="form.imageUrl"
                label="Image URL"
                placeholder="https://example.com/rocket-image.jpg"
                prepend-inner-icon="mdi-image"
                :rules="[rules.url]"
                hint="Optional: Provide a URL to a rocket image"
                persistent-hint
              />
              
              <!-- Image Preview -->
              <v-expand-transition>
                <div v-if="form.imageUrl && isValidUrl(form.imageUrl)" class="image-preview mt-3">
                  <v-img
                    :src="form.imageUrl"
                    height="150"
                    cover
                    rounded="lg"
                  >
                    <template #error>
                      <div class="d-flex align-center justify-center fill-height bg-surface-light">
                        <span class="text-caption text-error">Invalid image URL</span>
                      </div>
                    </template>
                  </v-img>
                </div>
              </v-expand-transition>
            </v-col>
            
            <!-- Country -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.country"
                label="Country"
                placeholder="e.g., United States"
                prepend-inner-icon="mdi-earth"
                :rules="[rules.required]"
              />
            </v-col>
            
            <!-- Cost Per Launch -->
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.cost_per_launch"
                label="Cost Per Launch (USD)"
                placeholder="e.g., 50000000"
                prepend-inner-icon="mdi-currency-usd"
                type="number"
                :rules="[rules.positiveNumber]"
                hint="Optional"
                persistent-hint
              />
            </v-col>
            
            <!-- First Flight Date -->
            <v-col cols="12">
              <v-text-field
                v-model="form.first_flight"
                label="First Flight Date"
                placeholder="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                :rules="[rules.required, rules.dateFormat]"
                hint="Format: YYYY-MM-DD"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-divider />
      
      <!-- Actions -->
      <v-card-actions class="dialog-actions">
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!isFormValid"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          <v-icon start>mdi-plus</v-icon>
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { NewRocketForm } from '@/types/rocket'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [form: NewRocketForm]
}>()

// Form state
const formRef = ref()
const isFormValid = ref(false)
const isSubmitting = ref(false)

const form = ref<NewRocketForm>({
  name: '',
  description: '',
  imageUrl: '',
  cost_per_launch: null,
  country: '',
  first_flight: '',
})

// Dialog visibility
const dialogVisible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    dialogVisible.value = newValue
  }
)

watch(dialogVisible, (newValue) => {
  emit('update:modelValue', newValue)
})

// Validation rules
const rules = {
  required: (v: string) => !!v || 'This field is required',
  minLength: (min: number) => (v: string) =>
    (v && v.length >= min) || `Must be at least ${min} characters`,
  url: (v: string) => {
    if (!v) return true
    try {
      new URL(v)
      return true
    } catch {
      return 'Please enter a valid URL'
    }
  },
  positiveNumber: (v: number | null) => {
    if (v === null || v === undefined) return true
    return v >= 0 || 'Must be a positive number'
  },
  dateFormat: (v: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    return regex.test(v) || 'Please use YYYY-MM-DD format'
  },
}

// Methods
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function closeDialog() {
  dialogVisible.value = false
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    description: '',
    imageUrl: '',
    cost_per_launch: null,
    country: '',
    first_flight: '',
  }
  formRef.value?.reset()
}

async function handleSubmit() {
  const { valid } = await formRef.value?.validate()
  
  if (!valid) return
  
  isSubmitting.value = true
  
  // Simulate a short delay for UX
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  emit('submit', { ...form.value })
  
  isSubmitting.value = false
  closeDialog()
}
</script>

<style scoped lang="scss">
.add-rocket-dialog {
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border-radius: 12px;
}

.dialog-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.image-preview {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.dialog-actions {
  padding: 16px 24px;
}
</style>
