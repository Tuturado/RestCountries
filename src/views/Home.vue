<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import NavBar from '../components/NavBar.vue'
import Details from './Details.vue';
import { useRoute } from 'vue-router';
import CountryFlag from '../components/CountryFlag.vue'

const countryDetails = ref({
    name: '',
    code: '',
});

const route = useRoute();

const countries = ref<any[]>([]);
const region =  ref<any[]>([]);
const capitall = ref<any[]>([]);
const language = ref<any[]>([]);
const itemsPerPage = 3;
const currentPage = ref(1);

const uniqueRegions = ref<string[]>([]);
const uniqueCapitals = ref<string[]>([]);
const uniqueLanguage = ref<string[]>([]);

const getAll = async () => {
    let base_url = 'https://restcountries.com/v3.1/all?fields=flags,region,capital,languages,cca2';
    try {
        const response = await fetch(base_url);
        const data = await response.json();
        countries.value = data;
        const regionsSet = new Set<string>();
        const CapitalSet = new Set<string>();
        const languageSet = new Set<string>();

        data.forEach((country: any) => {
            if (country.region) {
                if (!regionsSet.has(country.region)) {
                    regionsSet.add(country.region);
                }
            }
        });

        data.forEach((country: any) => {
            if (country.capital) {
                if (!CapitalSet.has(country.capital)) {
                    CapitalSet.add(country.capital);
                }
            }
        });

        data.forEach((country: any) => {
            if (country.languages) {
                for (const key in country.languages) {
                    if (Object.hasOwnProperty.call(country.languages, key)) {
                        const value = country.languages[key];
                        if(!languageSet.has(country.languages[key])){
                            languageSet.add(value)
                        }
                    }
                }
            }
        });



        uniqueRegions.value = Array.from(regionsSet);
        uniqueCapitals.value = Array.from(CapitalSet);
        uniqueLanguage.value = Array.from(languageSet);

        
        console.log('CAPITALS: ', uniqueCapitals.value);
        console.log('LANGUAGES: ', uniqueLanguage.value);
        console.log('COUNTRIES: ', countries);
    } catch (error) {
        console.error('Erro ao obter dados dos países', error);
    }
};

const getRegion = async(regiao:any)=>{
    let base_url = `https://restcountries.com/v3.1/region/${regiao}`;
    const response = await fetch(base_url);
    const data = await response.json();
    region.value = data;
    console.log('REGION: ', region.value);
}


const getCapital = async(capital:any)=>{
    let base_url = `https://restcountries.com/v3.1/capital/${capital}`;
    const response = await fetch(base_url);
    const data = await response.json();
    capitall.value = data;
    console.log('Capital: ', capitall.value);
}

const getLanguage = async(lingua:any)=>{
    let base_url = `https://restcountries.com/v3.1/lang/${lingua}`;
    const response = await fetch(base_url);
    const data = await response.json();
    language.value = data;
    console.log('Language: ', language.value);
}



onMounted(getAll);

const selectedItem = ref<string | null>(null);
const selectedRegion = ref<string | null>(null);

const items = ['Região', 'Capital', 'Língua', 'País'];

const search = () => {
   console.log('SELECTED REGION: ', selectedRegion.value);

    
    //Se o item selecionado for região faço request na região
    if(selectedItem.value == 'Região'){
        getRegion(selectedRegion.value);
    }
    else if(selectedItem.value == 'Capital'){
        getCapital(selectedRegion.value);
    }
    else if(selectedItem.value == 'Língua'){
        getLanguage(selectedRegion.value);
    }
    

};

const totalPages = computed(() => Math.ceil(countries.value.length / itemsPerPage));

const displayedCountries = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return countries.value.slice(start, end);
});


const filteredCapitals = computed(() => {
  //Essa lógica até funciona, mas trava o software, basicamente ele carrega da requisição todas as informações para preencher o v-combobox com elas, mas decidi deixar isso apenas para a Região, por serem poucos os resultados
//   if (selectedItem.value == 'Região') {
//     return uniqueRegions.value
//   } else if(selectedItem.value == 'Capital'){
//     return uniqueCapitals.value
//   }else if(selectedItem.value == 'Língua'){
//     return uniqueLanguage.value
//   }else if(selectedItem.value == 'País'){

//   }

if (selectedItem.value == 'Região') {
    return uniqueRegions.value
}
});
</script>


<template>
    <NavBar />
    <div class="search-container">
        <v-combobox class="custom-combobox" v-model="selectedItem" :items="items" style="width: 10%;"></v-combobox>
        <v-combobox class="custom-combobox" v-model="selectedRegion" :items="filteredCapitals" style="width: 10%;"></v-combobox>
        <v-btn @click="search">Pesquisar</v-btn>
    </div>

    <v-row style="justify-content: space-around; padding-left: 10%; padding-top: 5%; padding-bottom: 10%;">
        <v-col v-for="(country, index) in displayedCountries" :key="index">
            <router-link :to="{ name: 'details', params: { countryCode: country.cca2 } }">
                <v-img :src="country.flags.png" alt="Flag" aspect-ratio="2" width="55%"></v-img>
            </router-link>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
        </v-col>
    </v-row>
</template>
  
<style scoped>
.search-container {
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    text-align: center;
    padding-top: 3%;
    gap: 10px;
}

.flags-exibition {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 45%;
    padding-top: 5%;
}

.pagination-row {
    position: absolute;
    bottom: 0;
    left: 0;
}

.custom-combobox {
    min-width: 15px;
    /* Ajuste o valor conforme necessário */
}
</style>