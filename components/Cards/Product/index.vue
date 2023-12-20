<script lang="ts">
import { useDark } from '@vueuse/core';
const isDark = useDark();

export default {
    name: 'CardsProduct',
    props: {
        'name': {
            type: String,
            required: true
        },
        'description': {
            type: String,
            required: true
        },
        'speed': {
            type: Array,
            required: true
        },
        'details': {
            type: Array,
            required: true
        }
    },
    setup() {
        return {
            isDark
        }
    }
}
</script>

<template>
    <div class="card shadow" style="margin-bottom: 1rem;" :data-bs-theme="`${isDark ? 'light' : 'dark'}`">
        <div class="card-body">
            <h5 class="card-title">{{ description }} ({{ name }})</h5>
        </div>
    </div>
</template>