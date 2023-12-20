<script setup>
// set meta stuff
let url = useRequestURL();
useSeoMeta({
    title: 'Cyno',
    description: 'Unofficial Gigaclear Address Checker',
    ogTitle: 'Cyno',
    ogDescription: 'Unofficial Gigaclear Address Checker',
    ogImage: `${url.origin}/images/creg.png`,
    ogUrl: `${url.origin}`,
    twitterTitle: 'Cyno',
    twitterDescription: 'Unofficial Gigaclear Address Checkerr',
    twitterImage: `${url.origin}/images/creg.png`,
    twitterCard: 'summary_large_image'
});

useHead({
    htmlAttrs: {
        lang: 'en'
    },
    link: [
        {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.ico'
        }
    ]
})
</script>

<template>
  <div>
    <NavigationNavBar />
    <div class="container-fluid">
      <NuxtPage />
    </div>
  </div>
</template>
