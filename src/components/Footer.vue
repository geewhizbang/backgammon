<template>
  <div class="menu">Menu Here</div>
</template>

<script>

//import { ref } from 'vue';
//import axios from 'axios';
  
export default {
  inject: ['global'],
  name: 'Menu',

  methods: {

    dummyMethod: function(x) {
      alert(x);
    }
  },
  mounted(){

    this.data.date = new Date().getFullYear();

    //this.filterMenu();
    //let that = this;
    // window.addEventListener("resize", this.setChildStyles);
    // let timeout = setTimeout(function() {
    //   that.setChildStyles();
    //   clearTimeout(timeout);
    // },200); 
    
  }
}
</script>

<style lang="scss" scoped>

  @import "../styles/_colors.scss";
  $margin: 20px;
  $spaceFromMenu: 70px;
  $menuBarWidth: 900px;
  $cursorHeight: 4px;
  $fontSize: 15px;

  div.menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: toVw($vw, $headerHeight);
    background: $headerBackground;
    border-bottom: 1px solid $headerBorder;
    z-index: 2;

    
    > .logo {
      height: toVw($vw, $headerHeight * 1.2);
      width: 317.34 / 163.19 * toVw($vw, $headerHeight * 1.2);
      padding-left: toVw($vw, $margin);
      margin-top: 0;
      float: left;
      position: relative;
      top: toVw($vw, -2px);
    }
  }

  //@import "../generatedStyles/Header.scss";
</style>

 