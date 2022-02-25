<template>
  <span class="iconHelp">
    <svg width="100%" height="100%" viewBox="0 0 18 18" aria-label="Help">
      <path id="background" d="m18 9a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9z" fill-rule="evenodd" stroke-width="0"/>
      <g id="foreground" transform="matrix(1.0092 0 0 .99093 -26.494 -26.129)" fill="#fff">
        <path d="m33.511 37.781v-0.64351q0-0.83482 0.35654-1.4522 0.35654-0.61742 1.3044-1.3131 0.91309-0.65221 1.2001-1.0609 0.29567-0.40872 0.29567-0.91309 0-0.56525-0.41741-0.86091-0.41741-0.29567-1.1653-0.29567-1.3044 0-2.9741 0.85222l-0.94788-1.9044q1.9392-1.087 4.1133-1.087 1.7914 0 2.8436 0.86091 1.0609 0.86091 1.0609 2.2958 0 0.95657-0.4348 1.6523-0.4348 0.69569-1.6523 1.5653-0.83483 0.61742-1.0609 0.93918-0.2174 0.32176-0.2174 0.84352v0.52176zm-0.27828 2.9741q0-0.73047 0.39132-1.1044t1.1392-0.37393q0.72178 0 1.1131 0.38263 0.40002 0.38263 0.40002 1.0957 0 0.68699-0.40002 1.087-0.40002 0.39132-1.1131 0.39132-0.73047 0-1.1305-0.38263-0.40002-0.39132-0.40002-1.0957z" fill="#fff" stroke-width="0"/>
      </g>
    </svg>
  </span>
</template>
<script>
  export default {
    name: 'IconHelp'
  }
    
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .iconHelp {
    display: inline-block;
    padding: 0;
    margin: 0;
    width: toVw($vw, 18px);
    height: toVw($vw, 18px);

    > svg {
      width: 100%;
      height: 100%;
      display: block;
      #background {
        fill: $iconBackground;
      }
    }
  }

  span.icon {
    display: block;
    
    > .iconHelp {
      width: 100%;
      height: 100%;
    }
  }
</style>