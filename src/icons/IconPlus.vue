<template>
  <span class="iconPlus">
    <svg xml:space="preserve" width="100%" height="100%" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"
      viewBox="0 0 8.489 8.479">
      <polygon id="color" points="4.994,0 4.994,3.49 8.489,3.49 8.489,4.989 4.994,4.989 4.994,8.479 3.495,8.479 3.495,4.989 0,4.989 0,3.49 3.495,3.49 3.495,0 "/>
    </svg>
  </span>
</template>
<script>
  export default {
      name: 'IconPlus'
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .iconPlus {
    display: inline-block;
    padding: 0;
    width: toVw($vw, 18px);
    height: toVw($vw, 18px);
    margin: 0;

    &.large {
      width: toVw($vw, 32px);
      height: toVw($vw, 32px);
    }

    > svg {
      display: block;
      #color {
        fill: $buttonBackground;
      }
    }

    &:hover {
      cursor: pointer;
      > svg {
        #color{
          fill: $buttonHoverBackground;
        }
      }
    }
  }

  button {

    > span.iconPlus {
      padding: 0;
      height: toVw($vw, 13px);
      width: toVw($vw, 13px);
      margin: 0;
      position: relative;
      top: toVw($vw, 1px);

      + span {
        vertical-align: top;
        display: inline-block;
        margin-left: toVw($vw, 3px);
        color: white;
      }
    }


    &:hover {
      > .iconPlus {
         + span {
          color: $buttonHoverColor;
        }
        > svg {
          #color {
            fill: $buttonHoverColor;
          } 
        }
      }
    }
    
    > .iconPlus > svg {
      #color {
        fill: white;
      } 
    }
  }
</style>