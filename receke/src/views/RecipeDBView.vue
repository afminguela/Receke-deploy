<script>
import { mapState, mapActions } from "pinia";
import { useIngredientsStore } from '@/stores/IngredientsStore';
import { useRecipesStore } from '@/stores/RecipesStore';
import NavComponent from '@/components/NavComponent.vue';

export default {
    data() {
        return {
            // Estrellas seleccionadas
            starsSelected: '',
            // Valor de estrellas
            stars: '',

            // Valoración media
            mediumEvaluation: '',
            // Total de valoraciones
            totalNumEvaluation: '',
            showDelete: false,
            deleteStatus: ''
        }
    },
    methods: {
        ...mapActions(useRecipesStore, ['getRecipeById', 'editRecipe', 'deleteRecipe']),
        getIngredientImage(ingredient) {
            const ingredientMatch = this.ingredients.find((item) => item.name === ingredient)
            return ingredientMatch.image
        },
        checkStars(star) {
            // Le doy valor a starsSelected para usarlo en el dom
            this.starsSelected = star;
        },
        selectStars(star) {
            // Paso el valor de la estrella seleccionada
            this.stars = star;
            // Paso los parámetros de id de la receta, los de la evaluación actual y el del nuevo valor de estrella
            this.sendStars(this.recipeSelected.id, this.recipeSelected.evaluation, this.stars)
        },
        sendStars(id, evaluation, stars) {
            // Función para enviar las estrellas
            // Acumulo en un array los nuevos valores a partir de los datos que ya existan
            let evaluationArray = [...evaluation];
            evaluationArray.push(stars)

            // Creo el nuevo objeto con los valores de la receta
            const edited = { ...this.recipeSelected, evaluation: evaluationArray }
            console.log(edited);

            // Utilizo la función del store de editar receta
            this.editRecipe(id, edited)
        },
        showEvaluation() {
            //console.log(this.recipeSelected.evaluation);
            const evaluations = this.recipeSelected.evaluation;
            
            const sum = evaluations.reduce((total, num) => total + num, 0);
            this.totalNumEvaluation = evaluations.length;

            const medium = (sum / evaluations.length).toFixed(2);
            this.mediumEvaluation = medium;
        },
        async deleteRecipeWithError(id) {
            const response = await this.deleteRecipe(id);
            if (response === 200) {
                this.deleteStatus = 'Receta borrada correctamente'
            } else {
                this.deleteStatus = 'Error al borrar la receta'
            }
            //this.$router.push('/query-recipes');
        }
    },
    computed: {
        ...mapState(useRecipesStore, ['recipeSelected']),
        ...mapState(useIngredientsStore, ['ingredients'])
    },
    mounted() {
        this.getRecipeById(this.$route.params.id).then(()=> {
            this.showEvaluation();
        })
        
    },
    components: {
        NavComponent
    }
}
</script>

<template>

    <NavComponent link="/query-recipes" :title="recipeSelected.title" />
    <div class="recipe-layout-alignment">
        <!-- Recipe image -->
        <div class="recipe-image">
            <img :src="recipeSelected.image">
        </div>
        <div class="recipe-content">
            <h3 class="ingredients-title-recipe">Ingredientes</h3>

            <!-- Ingredients list -->
            <div class="ingredients-list" v-for="(item, index) in recipeSelected.ingredients" :key="index">
                <div>
                    <img :src="`/media/${item.image}`">
                    <h4> {{ item.ingredient }} {{ item.quantity }}</h4>
                </div>
            </div>

            <!-- Ingredients -->
            <div class="steps-menu">
                <h3 class="ingredients-title"> Pasos</h3>
                <p>Ver pasos en pictogramas</p>
            </div>

            <div class="recipe-steps">
                <ol>
                    <li v-for="(step, index) in recipeSelected.instructions" :key="index"> {{ step }} </li>
                </ol>
            </div>



            <!-- <button class="add-button" @click="showEvaluation()" >Mostrar evaluacion</button> -->
            <div class="evaluation" v-if="this.mediumEvaluation !== 0">
                <div class="cal">
                    <p>{{ this.mediumEvaluation }}</p><span>/5</span>
                </div>
                <p>de un total de <span>{{ this.totalNumEvaluation }} valoraciones</span></p>
            </div>



            <div class="stars">
                <h3>Valora esta receta</h3>
                <div class="stars-container" :class="starsSelected === 1? 'selected1' : starsSelected === 2? 'selected2' : starsSelected === 3? 'selected3' : starsSelected === 4? 'selected4' : starsSelected === 5? 'selected5': ''">
                    <div class="star"  
                        v-for="star in 5" 
                        :key="star" 
                        
                        @click="checkStars(star)">
                        <!-- <p>{{ star }}</p> -->
                    </div>
                </div>
                <button class="send-button" :class="{ 'disabled': starsSelected === '' }"
                    @click="selectStars(this.starsSelected)">Enviar valoración</button>
            </div>



            <button class="add-button" @click="showDelete = true">Borrar receta</button>
            <div class="sentMessage" v-if="showDelete">
                <div v-if="!this.deleteStatus">
                    <p>Quieres borrar esta receta?</p>
                    <button @click="deleteRecipeWithError(recipeSelected.id)" class="search-button">Aceptar</button>
                    <button @click="showDelete = false" class="add-button">Cancelar</button>
                </div>
                <div v-else>
                    <p>{{ this.deleteStatus }}</p>
                    <button @click="showDelete = false, this.$router.push('/query-recipes')"
                        class="add-button">Aceptar</button>
                </div>
            </div>

            
        </div>
    </div>

</template>
<style></style>