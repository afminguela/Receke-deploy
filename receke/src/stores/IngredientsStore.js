//import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const useIngredientsStore = defineStore('IngredientsStore', {
  state: () => ({
    ingredients: [],
    ingredientsToShow: [],
    selectedIngredients: JSON.parse(localStorage.getItem('selectedIngredients')) || [],
    categories: []
  }),
  actions: {
    async fetchIngredients() {
      let response = await fetch('https://receke-api.vercel.app/ingredients')
      let ingredients = await response.json()
      this.ingredients = ingredients
      this.ingredientsToShow = ingredients
    },
    async fetchCategories() {
      let response = await fetch('https://receke-api.vercel.app/categories')
      let categories = await response.json()
      this.categories = categories
    },
    toggleIngredient(name) {
      if (this.selectedIngredients.includes(name)) {
        this.selectedIngredients = this.selectedIngredients.filter(
          (ingredient) => ingredient !== name
        )
      } else {
        this.selectedIngredients.push(name)
      }
      localStorage.setItem('selectedIngredients', JSON.stringify(this.selectedIngredients))
    },
    filterIngredients(category = 'all') {
      if (category === 'all') {
        this.ingredientsToShow = this.ingredients
      } else {
        this.ingredientsToShow = this.ingredients.filter(
          (ingredient) => ingredient.category === category
        )
      }
    }
  }
})