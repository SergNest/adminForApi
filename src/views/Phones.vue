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
                  <CTableHeaderCell>ЛО</CTableHeaderCell>
                  <CTableHeaderCell>Телефон Золото</CTableHeaderCell>
                  <CTableHeaderCell>Телефон Техніка</CTableHeaderCell>
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
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { API_URL } from '../api/index'
  
  const phones = ref([])
  const API_TOKEN = import.meta.env.VITE_API_TOKEN;
  
  const fetchPhones = async () => {
    try {
      const response = await fetch("/api/general/get_phone", {
        method: "GET",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Перетворюємо отримані дані у масив для відображення у таблиці
      phones.value = Object.entries(data).map(([id, details]) => ({
        id,
        gold: details.gold || "-",
        tech: details.tech || "-"
      }));
  
    } catch (error) {
      console.error("Помилка отримання даних", error);
    }
  }
  
  onMounted(fetchPhones)
  </script>
  