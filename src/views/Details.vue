<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const itemsPerPage = 3;
const currentPage = ref(1);

const countryDetails = ref({
    name: '',
    code: '',
    capital: '',
    region: '',
    subRegion: '',
    population: '',
    language: '',
    flag: '',
    borders: [],
    neighborFlags: [] as { flag: string; code: string }[],
});

const route = useRoute();

onMounted(async () => {
    const countryCode = route.params.countryCode;
    await fetchCountryDetails(countryCode);
});

const fetchCountryDetails = async (countryCode: string | any) => {
    let base_url = `https://restcountries.com/v3.1/alpha/${countryCode}`;
    try {
        const response = await fetch(base_url);
        const data = await response.json();
        // Atualize o conteúdo de countryDetails com os detalhes obtidos
        countryDetails.value = {
            name: data[0].name.common,
            code: data[0].cca2,
            capital: data[0].capital[0],
            region: data[0].region,
            subRegion: data[0].subregion,
            population: data[0].population,
            language: data[0].languages,
            flag: data[0].flags.png,
            borders: data[0].borders || [],
            neighborFlags: [], // Inicialmente vazio, será preenchido após a busca
        };

        // Buscar as bandeiras dos países vizinhos
        await fetchNeighborFlags();
    } catch (error) {
        console.error('Erro ao obter detalhes do país', error);
    }
};

const fetchNeighborFlags = async () => {
    try {
        const neighborFlags = await Promise.all(
            countryDetails.value.borders.map(async (borderCode: string) => {
                const borderUrl = `https://restcountries.com/v3.1/alpha/${borderCode}`;
                const borderResponse = await fetch(borderUrl);
                const borderData = await borderResponse.json();
                return { flag: borderData[0].flags.png, code: borderData[0].cca2 };
            })
        );

        // Atualizar a propriedade neighborFlags
        countryDetails.value.neighborFlags = neighborFlags;

        // Exibir as bandeiras dos países vizinhos
        console.log('Bandeiras dos países vizinhos:', neighborFlags);
    } catch (error) {
        console.error('Erro ao obter bandeiras dos países vizinhos', error);
    }
};

const totalPages = computed(() => Math.ceil(countryDetails.value.neighborFlags.length / itemsPerPage));

const displayedCountries = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return countryDetails.value.neighborFlags.slice(start, end);
});

</script>

<template>
  <div>
    <NavBar />
    <div style="display: flex; flex-direction: row;">
      <div class="flag-exhibition">
        <v-img :src="countryDetails.flag" alt="Flag" aspect-ratio="2"></v-img>
      </div>
      <div style="padding-top: 5%;">
        <p>Nome: {{ countryDetails.name }}</p>
        <p>Capital: {{ countryDetails.capital }}</p>
        <p>Região: {{ countryDetails.region }}</p>
        <p>Sub-Região: {{ countryDetails.subRegion }}</p>
        <p>População: {{ countryDetails.population }}</p>
        <p>Línguas: {{ countryDetails.language }}</p>          
      </div>
    </div>
    
    <div class="borders-flag">
      <p v-if="countryDetails.neighborFlags.length > 0">Países Vizinhos: </p>
      <v-img v-for="country in displayedCountries" :key="country.code" :src="country.flag" alt="Flag" aspect-ratio="1"></v-img>
    </div>

    <v-row>
        <v-col>
            <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
        </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.flag-exhibition {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 30%;
  padding-top: 5%;
  padding-left: 5%;
}

.borders-flag {
  display: flex;
  padding-top: 10%;
  padding-left: 10%;
  width: 45%;
  gap: 10px;
}

/* Adicione estilos conforme necessário */
</style>
