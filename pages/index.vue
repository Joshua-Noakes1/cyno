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
    transform: (data) => {
        // split all the products into categories eg (business, res, res 6 months)
        let categories = {
            business: [],
            residential: [],
            residential_six: []
        };
        for (let product of data['data']) {
            if (product['type'] == 'business') categories['business'].push(product);
            if (product['type'] == 'residential') {
                if (product['name'].includes("-6")) {
                    categories['residential_six'].push(product);
                } else {
                    categories['residential'].push(product);
                }
            }
        }

        return categories;
    }
});
</script>

<template>
    <h1>Products</h1>
    <div v-if="!productData" class="col-12">
        <div class="alert alert-primary" role="alert">
            Loading Products...
        </div>
    </div>
    <div v-else-if="productError" class="col-12">
        <div class="alert alert-danger" role="alert">
            Failed to Get Products: {{ productError.message?.toString().trim() }}
        </div>
    </div>
    <span v-else>
        <!-- Residential Plans -->
        <h2>Residential</h2>
        <div class="row">
            <div v-for="product in productData['residential']" class="col-12 col-lg-3">
                <CardsProduct :id="product['id']" :name="product['name']" :description="product['description']"
                    :speed="product['speed']" :details="product['details']" />
            </div>
        </div>
        <details>
            <summary>
                <h3 class="inline" title="This category can only be ordered by Gigaclear employees">Residential (6 Months)
                    <span style="color: var(--primary)">*</span></h3>
            </summary>
            <div class="row">
                <div v-for="product in productData['residential_six']" class="col-12 col-lg-3">
                    <CardsProduct :id="product['id']" :name="product['name']" :description="product['description']"
                        :speed="product['speed']" :details="product['details']" />
                </div>
            </div>
        </details>

        <!-- Business Plans -->
        <details>
            <summary>
                <h2 class="inline">Business</h2>
            </summary>
            <div class="row">
                <div v-for="product in productData['business']" class="col-12 col-lg-3">
                    <CardsProduct :id="product['id']" :name="product['name']" :description="product['description']"
                        :speed="product['speed']" :details="product['details']" />
                </div>
            </div>
        </details>
    </span>
</template>

<style scoped>
h2.inline,
h3.inline {
    display: inline-block;
    margin: 0;
    margin-bottom: 0.5rem;
}
</style>