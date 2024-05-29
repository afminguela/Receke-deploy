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
        }
    },
    methods: {
        ...mapActions(useRecipesStore, ['getRecipeById','editRecipe']),
        getIngredientImage(ingredient) {
            const ingredientMatch = this.ingredients.find((item) => item.name === ingredient)
            return ingredientMatch.image
        },
        checkStars(star){
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
            const edited = {...this.recipeSelected, evaluation: evaluationArray}
            console.log(edited);

            // Utilizo la función del store de editar receta
            this.editRecipe(id, edited)
        },
        showEvaluation(){
            console.log(this.recipeSelected.evaluation);
            const evaluations = this.recipeSelected.evaluation;
            
            const sum = evaluations.reduce((total, num) => total + num, 0);
            this.totalNumEvaluation = evaluations.length;
            
            const medium = (sum / evaluations.length).toFixed(2);
            this.mediumEvaluation = medium;
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
            <div class="evaluation" v-if="this.mediumEvaluation !== ''">
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
                <button class="send-button" :class="{'disabled': starsSelected === ''}" @click="selectStars(this.starsSelected)">Enviar valoración</button>
            </div>
        </div>
    </div>

</template>
<style>
.recipe-image img{
    max-width: 100%;
    height: 200px;
}

.evaluation {
    color: var(--receke-black);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background-color: var(--receke-lemon-50);
    overflow: hidden;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.evaluation .cal {
    display: flex;
    flex-direction: row;
    align-items: baseline;
}

.evaluation .cal p {
    font-size: 42px;
    line-height: 42px;
}

.stars h3 {
    color: var(--receke-black);
}

.stars .stars-container {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
}

.stars .stars-container.selected1 .star:nth-child(1) {
    opacity: 1;
}

.stars .stars-container.selected2 .star:nth-child(1),
.stars .stars-container.selected2 .star:nth-child(2) {
    opacity: 1;
}

.stars .stars-container.selected3 .star:nth-child(1),
.stars .stars-container.selected3 .star:nth-child(2),
.stars .stars-container.selected3 .star:nth-child(3) {
    opacity: 1;
}

.stars .stars-container.selected4 .star:nth-child(1),
.stars .stars-container.selected4 .star:nth-child(2),
.stars .stars-container.selected4 .star:nth-child(3),
.stars .stars-container.selected4 .star:nth-child(4) {
    opacity: 1;
}

.stars .stars-container.selected5 .star {
    opacity: 1;
}

.stars .stars-container .star {
    opacity: 0.5;
    width: 30px;
    aspect-ratio: 1/1;
    height: 30px;
    background-position: center center;
    background-size: contain;;
    background-image: url('data:image/svg+xml,<svg width="127" height="127" viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M63.2647 0L47.4485 47.4485H0L39.5404 79.0809L23.7243 126.529L63.2647 94.8971L102.805 126.529L86.989 79.0809L126.529 47.4485H79.0809L63.2647 0Z" fill="%23DC8A0B"/></svg>');
}

.stars .stars-container .star:hover {
    opacity: 1;
}

.send-button.disabled {
    background-color: grey;
    pointer-events: none;
}

</style>