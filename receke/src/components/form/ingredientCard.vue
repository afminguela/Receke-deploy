<script>
export default {
    props: {
        ingredients: Array,
       ingredient: Object,
       selectedIngredients: Array,
       
       
    },
    data() {
        return {
            ingredientQuantity: '',
            isActive : false,
            isRequired : false,
        }; 
    },
    methods: {
        getSelectedIngredients(ingredientName, ingredientQuantity) {

            console.log(ingredientName, ingredientQuantity);

            // Miramos si el ingrediente existe en selectedIngredients, buscamos indice con findindex y si no existe devuelve -1
            const existingIngredient = this.selectedIngredients.findIndex(ing => ing.ingredient === ingredientName);
            
            if (existingIngredient!== -1) {
                // Si el ingrediente existe, si no es igual a -1, lo elimina
                this.selectedIngredients.splice(existingIngredient, 1);
                this.isActive = false;
                this.ingredientQuantity = '';
            } else {
                // Si el ingrediente no existe, primero comprobamos que el campo de cantidad tiene algo
                if (this.ingredientQuantity == '') {
                    this.isRequired = true;
                } else {
                    // Si tiene cantidad, creamos el objeto de ingrediente y lo subimos al array
                    const ingredient = {
                        ingredient: ingredientName,
                        quantity: ingredientQuantity,
                    };
                    this.selectedIngredients.push(ingredient);
                    this.isActive = true;
                    this.isRequired = false;
                }
                
            }

            console.log(this.selectedIngredients);

        }
    },
    emits: []
}
</script>

<template>
    <div class="ingredient-card-wrapper"  :key="ingredient.id" :class="{ 'active' : isActive }">
        <div class="ingredient-card" @click="getSelectedIngredients(ingredient.name, ingredientQuantity)"> 
            <img  :src="`/media/${ingredient.image}`" :alt="ingredient.name">
            <h3>{{ ingredient.name }}</h3>
        </div>
       
        <input class="ingredient-quantity" placeholder="Cantidad" v-model="ingredientQuantity" :class="{ 'required' : isRequired }">
    </div> 
</template>

<style>
    .ingredient-card-wrapper .ingredient-card:hover{
        border: none;
    }
    .ingredient-card-wrapper.active .ingredient-card, .ingredient-card-wrapper.active .ingredient-quantity{
        border: 1px solid green;
    }
    .ingredient-card-wrapper .ingredient-quantity{
        margin: 0px 0px 6px 0px;
        width: 88px;
    }
    .ingredient-card-wrapper.active .ingredient-quantity{
        pointer-events: none;
    }
    .form-recipe-name input {
        text-align: center;
    }
    .form-recipe-name input.required {
        border: 1px solid red;
    }
    form.form-recipe-name textarea::placeholder {
        text-align: left;
    }
    textarea.disabled {
        pointer-events: none;
        border: 1px solid green;
    }
</style>
