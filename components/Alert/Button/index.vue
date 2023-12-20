<script>
export default {
    props: {
        'message': {
            type: String,
            default: "No Message"
        },
        'type': {
            type: String,
            default: 'danger'
        },
        'link': {
            type: String,
            default: ''
        }
    },
    computed: {
        isDanger() {
            return this.type == 'danger';
        },
        isWarning() {
            return this.type == 'warning';
        },
        isSuccess() {
            return this.type == 'success';
        },
        isNeedGlow() {
            return this.type != 'success';
        }
    }
}
</script>
<!-- //slow-animation -->

<template>
    <div :class="['alert', 'glowing-div', 'slow-animation', { 'alert-danger': isDanger }, { 'alert-warning': isWarning }, { 'alert-success': isSuccess }]"
        role="alert" style="color: lightgray;">
        <a v-if="link !== ''" class="fadeLink" :href="link" target="_blank">{{ message }}</a>
        <span v-else>{{ message }}</span>
    </div>
</template>

<style scoped>
/* Define the glowing effect for the div */
@keyframes glowing {
    0% {
        box-shadow: 0 0 10px var(--glow-color);
    }

    50% {
        box-shadow: 0 0 20px var(--glow-color), 0 0 30px var(--glow-color);
    }

    100% {
        box-shadow: 0 0 10px var(--glow-color);
    }
}

/* Apply the glowing effect to the div and style */
.glowing-div {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    border: 2px solid transparent;
    animation: glowing 3s infinite;
    border-radius: 2rem;
}

/* Adjust the colors of the glow based on the alert color */
.alert-danger {
    color: black;
    background-color: transparent;
    --glow-color: red;
}

.alert-warning {
    color: black;
    background-color: transparent;
    --glow-color: #ffc107;
}

.alert-success {
    color: black;
    background-color: transparent;
    --glow-color: green;
}
</style>