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

<template>
    <form class="container">
        <legend>Find your Address</legend>
        <div class="mb-3">
            <label for="disabledTextInput" class="form-label">Postcode<span title="This is a required field"
                    style="color: red;"> *</span></label>
            <input type="text" class="form-control" placeholder="SE1 9SG" required>
        </div>
        <div class="mb-3" hidden>
            <label for="disabledSelect" class="form-label">Address</label>
            <select id="disabledSelect" class="form-select">
                <option selected hidden disabled>Select your address</option>
            </select>
        </div>
        <button type="submit" class="btn btn-outline-primary float-end">Find Address</button>
    </form>
</template>