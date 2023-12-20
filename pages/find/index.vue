<script setup>
// set meta stuff
let pageTitle = 'Find Address';
let pageDescription = 'Find your address';
useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
});
</script>

<script>
// refs and stuff
let postcodeStageOne;
let postcodeFinder;
let postcodeText;

let addressFinder;
let addressList;
onMounted(() => {
    postcodeStageOne = ref(false);
    postcodeFinder = ref(null);
    postcodeText = ref('');

    addressFinder = ref(null);
    addressList = ref(null);
});
onUnmounted(() => {
    postcodeStageOne = null;
    postcodeFinder = null;
    postcodeText = null;

    addressFinder = null;
    addressList = null;
});

export default {
    methods: {
        async submit() {
            if (!postcodeStageOne) { // We use the same form for both stages
                postcodeText = postcodeText?.toString().toUpperCase();
                // check if postcode is real and matches regex
                if (!postcodeText.match(/^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/)) {
                    // We would show an error here but we dont have a design for it
                    alert("Invalid Postcode");
                    return;
                }
                postcodeText = postcodeText.replace(/\s/g, ''); // remove spaces from postcode

                // We fetch all addresses at the postcode
                let postcodeAddresses = await fetch(`/api/v1/getPostcodeDetails?postcode=${postcodeText}`);
                let postcodeAddressesData = await postcodeAddresses.json();
                if (postcodeAddresses['status'] !== 200) {
                    // We would show an error here but we dont have a design for it
                    alert(`${postcodeAddressesData['statusMessage']}`);
                    return;

                }

                // We should now have a list of addresses at the postcode
                for (let address of postcodeAddressesData['data']) {
                    let option = document.createElement('option');
                    option.value = address['property_id'];
                    option.innerText = address['address'];
                    addressList.appendChild(option);
                }

                // hide the postcode finder (make unrequired) and show the address finder
                postcodeFinder.style.display = 'none';

                addressFinder.style.display = 'block';
                postcodeStageOne = true;
            } else {
                // get the selected address
                let selectedAddress = addressList.value;
                console.log(selectedAddress?.toString().replace(/\s/g, '').trim())
                if (!selectedAddress || selectedAddress?.toString().replace(/\s/g, '').trim().toLowerCase() == 'selectyouraddress') {
                    // We would show an error here but we dont have a design for it
                    alert("Please select an address");
                    return;
                }

                // send the user to the next page
                this.$router.push(`/find/${selectedAddress}`);
            }
        }
    },
    mounted() {
        // set refs
        postcodeStageOne = this.$refs.postcodeStageOne;
        postcodeFinder = this.$refs.postcodeFinder;
        postcodeText = this.$refs.postcodeText;

        addressFinder = this.$refs.addressFinder;
        addressList = this.$refs.addressList;
    }
}
</script>

<template>
    <form class="container" data-bs-theme="dark" @submit.stop.prevent="submit()">
        <legend>Find your Address</legend>
        <div ref="postcodeFinder" class="mb-3">
            <label class="form-label">Postcode <span title="This is a required field" style="color: red;">*</span></label>
            <input type="text" class="form-control" placeholder="SE1 9SG" v-model="postcodeText" required>
        </div>
        <div ref="addressFinder" class="mb-3" style="display: none;">
            <label class="form-label">Address <span title="This is a required field" style="color: red;">*</span></label>
            <select ref="addressList" class="form-select">
                <option selected hidden disabled>Select your address</option>
            </select>
        </div>
        <button type="submit" class="btn btn-outline-primary float-end">Find Address</button>
    </form>
</template>