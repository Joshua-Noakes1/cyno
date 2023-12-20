<script setup>
// get album id from url and storeID from params
const route = useRoute();
let propertyID = route.params.id;

// get property data
let { data: propertyData, error: propertyError, loading: propertyLoading } = await useFetch(`/api/v1/getPropertyDetails?propertyID=${propertyID}`);

// do seo stuff
if (propertyData['value'] !== null) {
    try {
        let propertyDataSEO = { ...propertyData['value'] };

        let propertyTitle = propertyDataSEO['data']['property']['address']['line1'];
        let propertyDescription = propertyDataSEO['data']['community']['name']?.toString().split("(")[0].trim();
        useSeoMeta({
            title: propertyTitle,
            description: propertyDescription,
            ogTitle: propertyTitle,
            ogDescription: propertyDescription,
            twitterTitle: propertyTitle,
            twitterDescription: propertyDescription,
        });
    } catch (err) {
        let propertyTitle = `A property covered by Gigaclear`;
        useSeoMeta({
            title: propertyTitle,
            ogTitle: propertyTitle,
            twitterTitle: propertyTitle
        });
    }
}
</script>

<script>
// it needs to look funny ya know, I'm not putting LocationIQ in :3

export default {
    computed: {

    },
    computed: {
        housePictures() {
            let housePictures = ['https://res.cloudinary.com/tigersoot/image/upload/v1703107084/vcr8esu4q4ahw5qwg9sk.jpg', 'https://res.cloudinary.com/tigersoot/image/upload/v1703107083/gyjl9wbvu9yvq8akiy2i.jpg', 'https://res.cloudinary.com/tigersoot/image/upload/v1703107081/n6uvyzmkd08rxfusdyca.jpg', 'https://res.cloudinary.com/tigersoot/image/upload/v1703107080/kauzsjqtr4zipolwkb82.jpg', 'https://res.cloudinary.com/tigersoot/image/upload/v1703107081/wdncedgomtivbijykcd3.jpg'];
            return housePictures[Math.floor(Math.random() * housePictures.length)];
        }
    }
}
</script>

<template>
    <div v-if="propertyLoading" class="col-12">
        <div class="alert alert-primary" role="alert">
            Loading Products...
        </div>
    </div>
    <div v-else-if="propertyError" class="col-12">
        <div class="alert alert-danger" role="alert">
            Failed to Get Products: {{ propertyError.message?.toString().trim() }}
        </div>
    </div>
    <span v-else>
        <div class="row">
            <div class="col-12 col-lg-3 order-1">
                <div class="card" data-bs-theme="dark" style="margin-bottom: 1rem;">
                    <img :src="housePictures" class="card-img-top" alt="Stock Image House"
                        style="max-height: 12rem; object-fit: cover;">
                    <div class="card-body">
                        <span class="float-end">
                            <AlertButton
                                :message="propertyData['data']['property']['service']['isOrderAvailable'] ? propertyData['data']['property']['service']['hasServiceInstalled'] ? 'Service Installed' : 'Ready For Service' : 'Not Available'"
                                :type="propertyData['data']['property']['service']['isOrderAvailable'] ? 'success' : 'danger'"
                                :link="propertyData['data']['property']['service']['isOrderAvailable'] ? `https://order.gigaclear.com/availability?postcode=${propertyData['data']['property']['address']['postcode']?.toString().replace(/\s/g, '').trim()}` : ''" />
                        </span>
                        <h5>{{ propertyData['data']['property']['address']['line1'] }}</h5>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-9 order-2">
                <h1>Test</h1>
            </div>
    </div>
</span></template>