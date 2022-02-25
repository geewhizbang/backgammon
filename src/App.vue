<template>
  <div class="App">
    <Menu></Menu>
    <router-view></router-view>
    <div class="footer">
      <div>
        Footer Here
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "./components/Menu.vue";
import { ref } from 'vue';
import { useRoute } from "vue-router";
  
export default {
  name: "App",
  title: "Geewhizbang Backgammon",
  components: {
    Menu
  },
  inject: ['global'],

  setup() {

    let route = useRoute();

    const data = ref({
      route: route,
    });

    return {
      data
    };
  },

  methods: {

    dummyMethod: function(x) {
      alert(x);
    }
  }
}

</script>