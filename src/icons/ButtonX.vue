<template>
  <span class="buttonX">
    <svg width="100%" height="100%" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" viewBox="0 0 6.609 6.609">
      <circle id="line" cx="3.304" cy="3.304" r="3.304" />
      <circle id="fill" cx="3.304" cy="3.304" r="2.867" />
      <polygon id="foreground" points="2.012 1.457 3.305 2.749 4.599 1.455 5.154 2.01 3.86 3.304 5.152 4.597 4.597 5.152 3.304 3.86 2.01 5.154 1.455 4.599 2.749 3.305 1.457 2.012" fill="#913620"/>
    </svg>
  </span>
</template>
<script>
  export default {
      name: 'ButtonX'
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .buttonX {
    display: inline-block;
    vertical-align: top;
    padding: 0;
    width: 100%;
    height: 100%;

    > svg {
      width: 100%;
      height: 100%;
      display: block;
      #line {
        fill: $iconLine;
      }
      #fill {
        fill: white;
      }
      #foreground {
        fill: $red;
      }
    }

    &:hover {
      cursor: pointer;
      > svg {
        #fill {
          fill: $iconHover;
        }
        #line {
          fill: $iconLineHover;
        }
      }
    }
  }
</style>