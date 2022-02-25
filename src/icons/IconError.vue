<template>
  <span class="iconError">
    <svg xml:space="preserve" height="100%" width="100%" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 5.515 5.515">
      <circle id="background" cx="2.757" cy="2.757" r="2.757"/>
      <path id="foreground" d="M2.386 0.677l0.743 0c0.045,0 0.083,0.034 0.081,0.074l-0.09 2.85c-0.001,0.041 -0.037,0.074 -0.082,0.074l-0.562 0c-0.044,0 -0.08,-0.033 -0.081,-0.074l-0.091 -2.85c-0.001,-0.04 0.037,-0.074 0.082,-0.074zm0.371 3.191c0.268,0 0.485,0.217 0.485,0.485 0,0.267 -0.217,0.484 -0.485,0.484 -0.267,0 -0.484,-0.217 -0.484,-0.484 0,-0.268 0.217,-0.485 0.484,-0.485z"/>
    </svg>
  </span>
</template>
<script>
  export default {
      name: 'IconError'
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .iconError {
    display: inline-block;
    padding: 0;
    width: toVw($vw, 18px);
    height: toVw($vw, 18px);
    margin: 0;

    > svg {
      width: 100%;
      height: 100%;
      display: block;
      #background {
        fill: $red;
      }
      #foreground {
        fill: white;
      }
    }

    &:hover {
      cursor: pointer;
      > svg {
        #foreground{
          fill: $iconHover;
        }
      }
    }
  }
  span.icon {
    display: block;
    
    > .iconError {
      width: 100%;
      height: 100%;
    }
  }
</style>