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

      error: false,
      errorImg: false,
      isActive: false,
      isSent: false,
    }
  },
  created() {},
  methods: {
    ...mapActions(useRecipesStore, ['postRecipe']),

    async createRecipe(recipeName, steps, selectedIngredients, recipeImage) {
      console.log(recipeName, steps, selectedIngredients, recipeImage)

      this.error = false,
      this.errorImg = false,
      console.log(selectedIngredients)
      console.log(steps.length)
      if (recipeName === '' || selectedIngredients.length === 0 || steps.length === 1 ) {
        return this.error = true;
      } else if ( !recipeImage.includes("https") ) {
        return this.errorImg = true;
      }

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
  <div class="recipe-form-content">
    <form  @submit.prevent="createRecipe(this.recipeName, this.steps, this.selectedIngredients, this.recipeImage)">
      
      <div class="form-column">
        <div class="form-block form-recipe-name">
          <label class="ingredients-title" for="recipe-name">Nombre de la receta</label>
          <input type="text" v-model="recipeName" placeholder="Ej: Salteado de champiñones" id="name" name="name" required minlength="4" size="10" />
        </div>
      </div>
      

      <div class="form-column">
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
      </div>
      

      <div class="form-column">
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

        <div class="error" v-if="error">
          <p>Revisa que todos los campos estén completos</p>
        </div>
        <div class="error" v-if="errorImg">
          <p>Revisa que el formato de la URL es correcto</p>
        </div>
      </div>
      

      
      
      
      
    </form>
  </div>

  <div class="sentMessage" v-if="isSent">
    <p>Tu receta se ha enviado con éxito a nuestro repositorio</p>
    <router-link to="/">
      <button class="search-button">Volver a la home</button>
    </router-link>
  </div>
</template>

<style>

    form .form-block.form-recipe-name {
      height: initial;
    }
  
    form .form-block.form-recipe-name input {
        background-color: #FAFAFA;
        border-radius: 10px;
        border: 1px solid #EFEFEF;
    }
    form button.send-button.disabled {
      background-color: grey;
      pointer-events: all;
    }

    form .form-block.form-recipe-name input.required {
      border: 1px solid var(--receke-red);
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

    .error p {
      color: var(--receke-red)
    }

    @media (min-width: 1024px) {
      form {
        width: 100%;
        display: grid;
        gap: 20px;
        grid-template-columns: 1fr 1fr 1fr;
      }

      form .form-column .form-block {
        width: 100%;
      }

      form .form-column .form-block .cards-container {
        height: 50vh;
      }
    }

   
</style>
