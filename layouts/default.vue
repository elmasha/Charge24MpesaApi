<template>
  <v-app dark>


    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>


  </v-app>
</template>

<script>
import { uuid } from "vue-uuid";
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Charge24 Mpesa'
    }
  }
}
</script>
<style>
* {
  font-family: "Lato";
}
</style>
