<template>
    <div class="page_wrap">
      <ul class="pagination flex_center row">
        <li
          class="page-item previous paging_btn"
          v-if="props.page > 1"
          @click="props.changePage('prev')"
        >
          Previous
        </li>
        <li class="active page-item">
          {{ props.page }}
        </li>
        <li
          class="page-item next paging_btn"
          v-if="props.page != props.totalPages"
          @click="props.changePage('next')"
        >
          Next
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    page: { type: Number },
    changePage: { type: Function },
    totalPages: { type: Number },
  });
  </script>
  