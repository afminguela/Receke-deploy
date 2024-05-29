<script>
import { mapState, mapActions } from 'pinia';
import { useIngredientsStore } from '@/stores/IngredientsStore.js'
import { useRecipesStore } from '@/stores/RecipesStore';
import NavComponent from '@/components/NavComponent.vue'

export default {
    computed: {
        ...mapState(useIngredientsStore, ['ingredients', 'categories', 'selectedIngredients']),
        ...mapState(useRecipesStore, ['recipes', 'recipesFiltered'])
    },


    data() {
        return {
            //recipesFiltered: []
        }
    },
    created() {
        this.test()
        this.fetchRecipes().then(() => {
            this.filterRecipesByIngredients(this.recipes, this.selectedIngredients)
        })
        //this.filterRecipesByIngredients(this.recipes,this.selectedIngredients)
    },
    // watch: {
    //     recipes: {
    //         handler() {
    //             this.filterRecipesByIngredients(this.recipes,this.selectedIngredients)
    //         },
    //         immediate: true
    //     },

    // },

    methods: {
        // ...mapActions(useIngredientsStore,)
        ...mapActions(useRecipesStore, ['fetchRecipes', 'filterRecipesByIngredients']),

        //testeo de que funciona
        async test() {
            // console.log("estoy aqui")
            // console.log("ingredientes Seleccionados" , this.selectedIngredients)
            // console.log("todas las recetas" , this.recipes)
            // console.log("resultado del filtrado" , this.recipesFiltered)
        },



        //Función para filtrar recetas por ingredientes seleccionados
        // async filterRecipesByIngredients(recipes, selectedIngredients) {
        //     let recipesFiltered =
        //     recipes.filter(recipe =>
        //         recipe.ingredients.some(ing =>
        //             selectedIngredients.includes(ing.ingredient)
        //         )
        //     );
        //     console.log(recipesFiltered) //test 1 

        // },

        

        // selectRecipe(recipe) {
        //     this.$store.recipes.setSelectedRecipe(recipe);
        // }

    },

    components: {
        NavComponent
    }
}


</script>

<template>
    <NavComponent link="/" title="Explora estas sugerencias" />
<!-- 
    <div class="query-nav">
        <button><router-link to="/"><img src="../assets/img/back-arrow.png"></router-link> </button>
        <h1>¡Manos en la masa!</h1>
    </div> -->
    <!-- Recipe cards -->

    <div class="recipes-container">


        <button class="recipe-card" 
        v-for="recipe in recipesFiltered" 
        :key="recipe.id"
        
        >

            <router-link :to="`/recipe-view/${recipe.id}`">

               <div id="recipe-query--container" :class="{ 'bg-green': recipe.matchAll === true }">
                    <div class="image-container"  > 
                    <img :src="recipe.image" :alt="`${recipe.title}`" >
                    </div>

                    <h2  >{{ recipe.title }}</h2>
                    <p v-if="recipe.matchAll === true">Tienes todos los Ingredientes</p>
                    <p v-else-if="recipe.count === 1">Tienes {{ recipe.count }} ingrediente</p>
                    <p v-else>Tienes {{ recipe.count }} ingredientes</p>
                </div>

                


            </router-link>

        </button>


    </div>

</template>

<style></style>