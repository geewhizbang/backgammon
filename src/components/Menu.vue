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

    //this.data.date = new Date().getFullYear();

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
    position: relative;

    > .footer {
      position: fixed;
      bottom: 0;
      height: toVw($vw, $footerHeight);
      background: $footerBG;
      left: 0;
      right: 0;
      border-top: 2px solid white;
      > div {
        height: toVw($vw, $footerHeight) - toVw($vw, 10px);
        margin: toVw($vw, 5px) auto;
        width: toVw($vw, 500px);
      
        > p {
          color: white;
          font-weight: 500;
          font-size: toVw($vw, 14px);
          line-height: toVw($vw, 17px);
          margin: toVw($vw, 6px) 0 0 0;
          padding: 0;
          float: left;
        }
      }

       > .state {
        font-weight: 600;
        right: toVw($vw, 20px);
        top: toVw($vw, 20px);
        display: inline-block;
        vertical-align:top;
        padding: 0;
        font-size: toVw($vw, 15px);
        line-height: toVw($vw, 17px);
        color: #33333333;
      }
    }

    div.menu {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: toVw($vw, $headerHeight);
      background: $headerBackground;
      border-bottom: 1px solid $headerBorder;
      z-index: 2;
   
    }
  }   
  //@import "../generatedStyles/Header.scss";
</style>

 