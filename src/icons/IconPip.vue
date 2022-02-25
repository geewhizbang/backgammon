<template>
  <span class="iconPip" :style="{'height': height }">
    <svg height="100%" width="100%" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" version="1.1" viewBox="0 0 5.4 28.11" >
      <path id="pipFill" d="m2.8 0.1 2.6 28.01h-5.4l2.6-28.01c0-0.05 0.04-0.1 0.1-0.1 0.05 0 0.1 0.05 0.1 0.1z" />
    </svg>
  </span>
</template>
<script>
  export default {
    name: 'IconPip',
    props: {
      height: {
        type: String,
        default: '200px'
      }
    }
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .iconPip {
    display: block;
    width: 100%;

    > svg {
    width: 100%;
    height: 100%;
    display: block;
   
      > #pipfill {
        fill: rgba(0, 179, 57, 0.33);
      }
    }
  }
</style>