<template>
  <span class="iconFolder" :ref="container">
    <svg height="100%" width="100%" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"  viewBox="0 0 11.201 15.052" xmlns="http://www.w3.org/2000/svg">
      <path id="line" d="m1.574 0h6.23l3.397 3.396v10.082c0 0.865-0.709 1.574-1.574 1.574h-8.147c-0.868 0-1.48-0.685-1.48-1.48v-12.092c0-0.976 0.78-1.48 1.574-1.48z" />
      <g id="fill">
        <polygon id="polygon5" points="7.384 0.911 7.427 0.911 10.289 3.774 10.289 3.811 7.384 3.811" />
        <path id="path7" d="m1.574 0.911h4.898v3.289c0 0.246 0.277 0.522 0.523 0.522h3.294v8.756c0 0.363-0.299 0.663-0.662 0.663h-8.053c-0.371 0-0.663-0.194-0.663-0.569v-12.092c0-0.364 0.298-0.569 0.663-0.569z" />
      </g>
      <g id="line_2" fill="#A7BFC4">
        <rect id="rect9" x="2.782" y="6.629" width="5.468" height=".933"/>
        <rect id="rect11" x="2.782" y="8.525" width="5.468" height=".933"/>
        <rect id="rect15" x="2.782" y="10.421" width="5.468" height=".933"/>
      </g>
    </svg>
  </span>
</template>
<script>
  export default {
    name: 'IconFolder'
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .iconFolder {
    display: inline-block;
    height: toVw($vw, 20px);
    width: toVw($vw, 15px);
    padding: 0;
    
    > svg {
      display: block;
      #line {
        fill: $iconLine;
      }
      #line_2 {
        fill: $iconLine;
      }
      #fill {
        fill: white;
      }
    }
  }
 
  *:hover > .iconFolder,
  .iconFolder:hover {
    cursor: pointer;
    > svg {
      #fill {
        fill: $iconHover;
      }
      #line {
        fill: $iconLineHover;
      }
        #line_2 {
        fill: $iconLineHover;
      }
    }
  }
</style>