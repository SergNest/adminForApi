<template>
  <CRow>
    <CCol>
      <CCard>
        <CCardHeader>
          <strong>Таблиця телефонів</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover striped bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ЛВ</CTableHeaderCell>
                <CTableHeaderCell>Телефон золото</CTableHeaderCell>
                <CTableHeaderCell>Телефон техніка</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(item, index) in phones" :key="index">
                <CTableDataCell>{{ item.id }}</CTableDataCell>
                <CTableDataCell>{{ item.gold }}</CTableDataCell>
                <CTableDataCell>{{ item.tech }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <!-- Форма додавання -->
  <CRow class="mt-4">
    <CCol>
      <CCard>
        <CCardHeader>
          <strong>Додати новий телефон</strong>
        </CCardHeader>
        <CCardBody>
          <CForm @submit.prevent="addPhone">
            <CFormFloating class="mb-3">
              <CFormInput v-model="newPhone.id" placeholder="ID" required />
              <CFormLabel>Номер ломбардного відділення</CFormLabel>
            </CFormFloating>

            <CFormFloating class="mb-3">
              <CFormInput v-model="newPhone.gold" placeholder="Телефон Золото" @input="validatePhone('gold')" />
              <CFormLabel>Телефон золото</CFormLabel>
              <p v-if="phoneErrors.gold" class="text-danger">{{ phoneErrors.gold }}</p>
            </CFormFloating>

            <CFormFloating class="mb-3">
              <CFormInput v-model="newPhone.tech" placeholder="Телефон Техніка" required
                @input="validatePhone('tech')" />
              <CFormLabel>Телефон техніка</CFormLabel>
              <p v-if="phoneErrors.tech" class="text-danger">{{ phoneErrors.tech }}</p>
            </CFormFloating>

            <CButton type="submit" color="primary" :disabled="!isFormValid">Додати</CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { API_URL } from '../api/index'
import {
  CRow, CCol, CCard, CCardHeader, CCardBody,
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CForm, CFormFloating, CFormInput, CFormLabel, CButton
} from '@coreui/vue'

const phones = ref([])
const newPhone = ref({
  id: '',
  gold: '',
  tech: ''
})
const phoneErrors = ref({ gold: '', tech: '' }) // Об'єкт для помилок

const API_TOKEN = import.meta.env.VITE_API_TOKEN

import { nextTick } from 'vue'

const validatePhone = async (field) => {
  await nextTick(); // Дочекаємося оновлення значення перед перевіркою

  const phone = newPhone.value[field].trim(); // Видаляємо пробіли

  if (!phone) {
    phoneErrors.value[field] = ''
    return;
  }
  if (!/^\d+$/.test(phone)) {
    phoneErrors.value[field] = '❌ Тільки цифри без пробілів і символів!';
    return;
  }
  if (phone.length !== 12) {
    phoneErrors.value[field] = `❌ Номер має містити рівно 12 цифр! (${phone.length} введено)`;
    return;
  }
  if (!phone.startsWith("380")) {
    phoneErrors.value[field] = '❌ Номер повинен починатися з "380"!';
    return;
  }

  // ✅ Якщо всі перевірки пройдено, очищаємо помилку
  phoneErrors.value[field] = '';
};


// 📌 **Перевіряємо, чи форма валідна перед відправкою**
const isFormValid = computed(() => {
  return (
    newPhone.value.id &&
    (!newPhone.value.gold || !phoneErrors.value.gold) &&
    (!newPhone.value.tech || !phoneErrors.value.tech)
  )
})

// 📡 **Отримання списку телефонів**
const fetchPhones = async () => {
  try {
    const response = await fetch("/api/general/get_phone_all", {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      console.error("❌ Відповідь від сервера:", response);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    phones.value = Object.entries(data).map(([id, details]) => ({
      id,
      gold: details.gold || "-",
      tech: details.tech || "-"
    }));

  } catch (error) {
    console.error("❌ Помилка отримання даних:", error);
  }
};

// 📡 **Додавання нового телефону**
const addPhone = async () => {
  validatePhone('gold')
  validatePhone('tech')

  if (phoneErrors.value.gold || phoneErrors.value.tech) {
    alert("❌ Виправте помилки перед відправкою форми!");
    return;
  }

  try {
    const response = await fetch("/api/general/add_phone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        phones: [newPhone.value]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // Додаємо новий телефон у список без перезапиту API
    phones.value.push({ ...newPhone.value });

    alert("✅ Телефон успішно додано!");
    newPhone.value = { id: '', gold: '', tech: '' }; // Очищення форми

  } catch (error) {
    console.error("❌ Помилка додавання телефону", error);
  }
}

onMounted(fetchPhones)
</script>
