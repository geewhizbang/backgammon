<template>
  <span class="iconPhone" :ref="container">
    <svg height="100%" width="100%" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" version="1.1" viewBox="0 0 31.184 51.551">
      <rect id="line" width="31.184" height="51.551" rx="5.142" ry="5.142" />
      <circle id="button" cx="15.879" cy="44.404" r="2.964" fill="#fff"/>
      <path id="fill" d="m5.142 4.107h20.899c0.57 0 1.035 0.467 1.035 1.035v31.63c0 0.568-0.467 1.035-1.035 1.035h-20.899c-0.568 0-1.035-0.466-1.035-1.035v-31.63c0-0.569 0.466-1.035 1.035-1.035z" />
    </svg>
  </span>
</template>
<script>
  export default {
    name: 'IconPhone'
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .iconPhone {
    display: inline-block;
    vertical-align: top;
    height: toVw($vw, 17px);
    width: toVw($vw, 17px * 31.184 / 51.551);
    padding: 0;
    margin: 0 toVw($vw, 4px);
    
    > svg {
      display: block;
      #line {
        fill: #414a81;
      }
      #fill {
        fill: white;
      }
    }
  }
 
  *:hover > .iconPhone,
  .iconPhone:hover {
    cursor: pointer;
    > svg {
      #fill {
        fill: $iconHover;
      }
    }
  }
</style>