<script>
import HomeView from '@/views/HomeView.vue';

export default {
    name: 'HeaderComponent',
}
</script>

<template>
    <div class="header-arrangement">
        <header class="header-logo">
            <router-link to="/">

            <img src="../assets/img/Receke.png" alt="Receké Logo" />
            </router-link>

            <h1>Recetas fáciles con <br />lo que tienes en la nevera</h1>
            <p>Selecciona tus ingredientes</p>
        </header>
        <div class="desktop-logo">
            <router-link to="/">
                <img src="../assets/favicons/android-chrome-192x192.png" alt="Receké Logo" />
            </router-link>
        </div>
    </div>
</template>

<style></style>