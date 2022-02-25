<template>
  <span class="iconX">
    <svg shape-rendering="geometricPrecision" text-rendering="geometricPrecision" height="100%" width="100%"
      image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 1.146 1.146">
      <rect fill="none" width="1.146" height="1.146"/>
      <g id="color">
        <line fill="none" stroke-width="0.061" stroke-miterlimit="2.61313" x1="0.02" y1="0.02" x2="1.037" y2= "1.037" />
        <line fill="none" stroke-width="0.061" stroke-miterlimit="2.61313" x1="1.037" y1="0.02" x2="0.02" y2= "1.037" />
      </g>
   </svg>
  </span>
</template>
<script>
  export default {
      name: 'IconX'
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .iconX {
    display: inline-block;
    padding: 0;
    width: toVw($vw, 14px);
    height: toVw($vw, 14px);
    overflow: hidden;
    vertical-align: top;
    margin: 0;
    overflow: visible;

    > svg {
      padding: 0;
      margin: 0;
      display: block;
      #color {
        stroke: $navy;
      }
    }

    &:hover:not(.disabled) {
      cursor: pointer;
      > svg {
        #color{
          stroke: $hoverStrokeColor;
        }
      }
    }
  }
  
</style>