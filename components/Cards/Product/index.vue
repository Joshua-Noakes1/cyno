<script lang="ts">
import { useDark, useToggle } from '@vueuse/core';
let isDark = useDark();

export default {
    name: 'CardsProduct',
    props: {
        'id': {
            type: String,
            required: true
        },
        'name': {
            type: String,
            required: true
        },
        'description': {
            type: String,
            required: true
        },
        'speed': {
            type: Object,
            required: true
        },
        'details': {
            type: Object,
            required: true
        }
    },
    setup() {
        return {
            isDark
        }
    },
    computed: {
        getURL() {
            return `/products/${this.id}`
        },
    }
}
</script>

<template>
    {{ isDark }}
    <div class="card shadow" style="margin-bottom: 1rem;" :data-bs-theme="`${isDark ? 'light' : 'dark'}`">
        <div class="card-body">
            <h6 class="card-text float-end"><span v-if="details['isDefault']"
                    title="This product is selected by default for this category">✔️</span><span
                    v-if="details['isInternalProduct']" title="This product is only available within Gigaclear">🔒</span>
            </h6>
            <NuxtLink class="fadeLink" :to="getURL">
                <h5 class="card-title">{{ description }}</h5>
            </NuxtLink>
            <p class="text-muted">{{ name }}</p>
            <hr>
            <h6 class="card-subtitle mb-2 text-muted">Speed</h6>
            <p class="card-text">{{ speed['max'] }} Max / {{ speed['min'] }} Min / {{ speed['avg'] }} Avg</p>
        </div>
    </div>
</template>