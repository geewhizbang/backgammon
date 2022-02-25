<template>
  <span class="buttonCheck">
    <svg width="100%" height="100%" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" viewBox="0 0 5.3 5.268" >
      <circle id="line" cx="2.634" cy="2.634" r="2.634"/>
      <path id="fill" d="m2.634 0.348c0.605 0 1.156 0.236 1.565 0.62l0.212-0.277c0.255 0.232 0.463 0.514 0.611 0.83l-0.244 0.319c0.091 0.247 0.142 0.515 0.142 0.794 0 1.262-1.024 2.286-2.286 2.286s-2.286-1.024-2.286-2.286 1.024-2.286 2.286-2.286z" />
      <g id="foreground">
        <polygon points="1.581 2.626 3.073 3.768 2.692 4.264 1.201 3.122" />
        <rect transform="matrix(-1.1614 1.5169 -.79401 -.60791 5.3005 .85766)" width="2.246" height=".626" />
      </g>
    </svg> 
  </span>
</template>
<script>
  export default {
      name: 'ButtonCheck'
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .buttonCheck {
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
      #foreground {
        fill: $greenDark;
      }
      #fill {
        fill: #ffffff;
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