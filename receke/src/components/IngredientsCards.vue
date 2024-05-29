<script>
import { mapState, mapActions } from 'pinia'
import { useIngredientsStore } from '@/stores/IngredientsStore'
export default {
    computed: {
        ...mapState(useIngredientsStore, ['ingredientsToShow', 'selectedIngredients'])
    },
    methods: {
        ...mapActions(useIngredientsStore, ['toggleIngredient'])

        
    }

}
</script>
<template>
    <p class="ingredients-title-desktop">Selecciona tus ingredientes</p>
    <div class="cards-container">
        <button class="ingredient-card" 
            @click='toggleIngredient(ingredient.name)'
            v-for="ingredient in ingredientsToShow" 
            :key="ingredient.name"
            :class="{ 'active': selectedIngredients.includes(ingredient.name) }"
        >
            <img :src="`/media/${ingredient.image}`" alt="ingredient.name">
            <h3>{{ ingredient.name }}</h3>
        </button>
    </div>
</template>
<style>
</style>