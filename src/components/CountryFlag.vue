<template>
    <router-link :to="{ name: 'details', params: { countryCode: country.cca2 } }">
      <v-img :src="country.flags.png" alt="Flag" aspect-ratio="2" width="55%"></v-img>
    </router-link>
  </template>
  
  <script>
  export default {
    props: {
      country: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  