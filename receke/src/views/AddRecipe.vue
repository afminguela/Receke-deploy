<script>
import newStep from '../components/form/newStep.vue'
import ingredientCard from '../components/form/ingredientCard.vue'
import NavComponent from '@/components/NavComponent.vue'

import { mapState, mapActions } from 'pinia'

import { useIngredientsStore } from '@/stores/IngredientsStore'
import { useRecipesStore } from '@/stores/RecipesStore'

export default {
  computed: {
    ...mapState(useIngredientsStore, ['ingredients', 'categories'])
  },

  components: {
    newStep,
    NavComponent,
    ingredientCard
  },

  data() {
    return {
      recipeName: '',
      selectedIngredients: [],

      steps: ['pasoDummy'],
      recipeImage: '',

      isActive: false,
      isSent: false,
    }
  },
  created() {},
  methods: {
    ...mapActions(useRecipesStore, ['postRecipe']),

    async createRecipe(recipeName, steps, selectedIngredients, recipeImage) {
      console.log(recipeName, steps, selectedIngredients, recipeImage)

      steps.shift();
      const newRecipe = {
        title: recipeName,
        instructions: steps,
        image: recipeImage,
        ingredients: selectedIngredients
      }

      console.log(newRecipe)
      this.postRecipe(newRecipe)

      this.isSent = true
    }
  }
}
</script>

<template>
  <NavComponent link="/" title="Contribuye con tu receta" />
  <form  @submit.prevent="createRecipe(this.recipeName, this.steps, this.selectedIngredients, this.recipeImage)">
    <div class="form-block form-recipe-name">
      <label class="ingredients-title" for="recipe-name">Nombre de la receta</label>
      <input id="recipe-name"  v-model="recipeName" />
    </div>
    <div class="form-block form-recipe-name">
      <label class="ingredients-title" for="recipe-name">Ingredientes básicos</label>
      <div class="cards-container">
        <ingredientCard
          v-for="ingredient in ingredients"
          :selectedIngredients="selectedIngredients"
          :ingredients="ingredients"
          :ingredient="ingredient"
          :key="ingredient.id"
        />
        <!-- <div class="ingredient-card"  > 
                </div> -->
      </div>
    </div>
    <div class="form-block recipe-steps-container form-recipe-name">
      <label for="steps">Pasos</label>

      <ol>
        <newStep
          v-for="step in steps"
          :key="step"
          :steps="steps"
          @add-step="(descriptionStep) => addStep(descriptionStep)"
        />
      </ol>
    </div>
    <div class="form-block form-recipe-name">
      <label class="ingredients-title" for="recipe-img">Imagen de la receta</label>
      <input id="recipe-img" v-model="recipeImage" />
    </div>

    
    <button :class="{ 'disabled': recipeName === '' || selectedIngredients.length === 0 || steps.length === 0  || recipeImage === ''}"
      class="send-button"
      type="submit"
      
    >
      Enviar receta
    </button>
    
    
  </form>

  <div class="sentMessage" v-if="isSent">
    <p>Tu receta se ha enviado con éxito a nuestro repositorio</p>
    <router-link to="/">
      <button class="search-button">Volver a la home</button>
    </router-link>
  </div>
</template>

<style>
    form .form-recipe-name input {
        background-color: #FAFAFA!important;
        border-radius: 10px;
        border: 1px solid #EFEFEF;
    }
    form button.send-button.disabled {
      background-color: grey;
    }
    .sentMessage {
      display: flex;
      text-align: center;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding: 20px;
      top: 0px;
      left: 0px;
      position:fixed;
      width: 100vw;
      height: 100vh;
      background-color: #EDEDD4;
    }
    .sentMessage p {
      color: black;
      margin-bottom: 20px;
    }

   
</style>
