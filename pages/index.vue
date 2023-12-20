<script setup>
// set meta stuff
let pageTitle = 'Home';
let pageDescription = 'Unofficial Gigaclear Address Checker';
useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
});

// get product data
let { data: productData, error: productError } = await useFetch('/api/v1/getAllProducts', {
    server: false
});
</script>

<template>
    <h1>Products</h1>
    <div class="row">
        <div v-if="productError" class="col-12">
            <div class="alert alert-danger" role="alert">
                Failed to Get Products: {{ productError.message?.toString().trim() }}
            </div>
        </div>
        <div v-else v-for="product in productData['data']" class="col-12 col-lg-3">
            <CardsProduct :name="product['name']" :description="product['description']" :speed="product['speed']" :details="product['details']"/>
        </div>
    </div>
</template>