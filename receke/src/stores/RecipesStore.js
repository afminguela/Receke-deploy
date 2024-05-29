//import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useIngredientsStore } from '@/stores/IngredientsStore'
import { mapState } from 'pinia'
const baseUrl = import.meta.env.VITE_APP_BACKEND_URL
//console.log("Hola", baseUrl);

export const useRecipesStore = defineStore('recipesStore', {
  //el default
  state: () => ({
    //data de default
    recipes: [],
    recipeSelected: {}
    // recipeName: '',

    // selectedIngredients: [],

    // steps: ["pasoDummy"],

    // recipeImage: '',

    // isActive: false,

    //ingredients : parseInt(localStorage.getItem('ingredients') || []), //obtiene los ingredientes guardados en LocalStorage en futuro quitamos esto cuando pongamos usuarios
  }),
  getters: {
    ...mapState(useIngredientsStore, ['ingredients'])
  },
  actions: {
    //methods de default

    async fetchRecipes() {
      let response = await fetch(`${baseUrl}/recipes`)
      let recipes = await response.json()
      this.recipes = recipes
    },

    async getRecipeById(id) {
      let response = await fetch(`${baseUrl}/recipes/${id}`)
      let recipe = await response.json()

      //Get the image of the ingredient from the ingredients store
      const recipeIngredientsWithImage = await Promise.all(
        recipe.ingredients.map(async (ingredient) => {
          return {
            ...ingredient,
            image: await this.getIngredientImage(ingredient.ingredient)
          }
        })
      )

      recipe.ingredients = recipeIngredientsWithImage

      this.recipeSelected = await recipe
    },

    async getIngredientImage(ingredient) {
      try {
        const ingredientMatch = await this.ingredients.find((item) => item.name === ingredient)
        return ingredientMatch.image
      } catch (error) {
        console.error(error)
      }
    },

    async postRecipe(newRecipe) {
      const url = `${baseUrl}/recipes`
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecipe)
      })
    },

    async editRecipe(id, evaluation) {
      const url = `${baseUrl}/recipes/${id}`
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(evaluation)
      })
    },

    async deleteRecipe(id) {
      const url = `${baseUrl}/recipes/${id}`
      const response = await fetch(url, {
        method: 'DELETE'
      })
      return response.status
    },

    //obtiene un listado de recetas de la base de datos

    // marca como seleccionada una receta
    // async setSelectedRecipe(recipe) {
    //   this.selectedRecipe = recipe
    // },

    //   async filterRecipesByIngredients(recipes, selectedIngredients) {
    //     console.log("recipes", recipes) //test 1
    //     console.log("selectedIngredients", selectedIngredients) //test 2

    //         let recipesFiltered =
    //         recipes.filter(recipe => {
    //           console.log("antes de función recipe.ingredient", recipe["ingredients"])
    //           recipe.ingredients == (for ingredient of selectedIngredients)
    //         })

    //       console.log("despues de la funcion" ,recipesFiltered) //test 3

    // async filterRecipesByIngredients(recipes, selectedIngredients) {
    //   const matchingRecipes = []
    //   for (const recipe of recipes) {
    //     for (const recipeIngredient of recipe.ingredients) {
    //       for (const selectedIngredient of selectedIngredients) {
    //         if (selectedIngredient === recipeIngredient.ingredient){
    //           matchingRecipes.push(recipe)
    //         }
    //       }
    //     }
    //   }
    //   console.log()

    //   this.recipesFiltered = matchingRecipes

    // }

    async filterRecipesByIngredients(recipes, selectedIngredients) {
      //console.log('inside filterRecipesByIngredients')
      //console.log("esto es el array recipes", recipes);
      //console.log("esto es el array selectedIngredients", selectedIngredients);

      let recipesFiltered = []

      recipes.forEach((recipe) => {
        let ingredientsFiltered = []

        recipe.ingredients.forEach((objIng) => {
          ingredientsFiltered.push(objIng.ingredient)
        })

        let matchCount = ingredientsFiltered.filter((ing) =>
          selectedIngredients.includes(ing)
        ).length
        //console.log("match", matchCount);
        if (matchCount === ingredientsFiltered.length) {
          recipesFiltered.push({ ...recipe, count: matchCount, matchAll: true })
        } else if (matchCount >= 1) {
          recipesFiltered.push({ ...recipe, count: matchCount, matchAll: false })
        }
      })

      recipesFiltered.sort((a, b) => b.count - a.count)

      //console.log('después de la función', recipesFiltered) //test 3

      this.recipesFiltered = recipesFiltered

      //console.log("después de asignar", this.recipesFiltered); //test 3
    }
  }
})
