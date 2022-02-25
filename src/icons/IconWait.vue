<template>
  <span class="iconWait">
    <span>
       <svg width="100%" height="100%" display="block" shape-rendering="auto" preserveAspectRatio="xMidYMid" version="1.1" viewBox="0 0 53 53" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-23.5,-23.5)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.9166666666666666s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(30 82.102 -5.6016)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.8333333333333334s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(60 58.602 17.898)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.75s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(90,50,26.5)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.6666666666666666s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(120 45.034 31.466)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.5833333333333334s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(150 41.398 35.102)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.5s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(180,38.25,38.25)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.4166666666666667s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(210 35.102 41.398)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.3333333333333333s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(240 31.466 45.034)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.25s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(-90,26.5,50)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.16666666666666666s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(-60 17.898 58.602)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="-0.08333333333333333s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
        <g transform="rotate(-30 -5.6016 82.102)">
          <rect x="47" y="24" width="6" height="12" rx="3" ry="6" fill="#337ab7">
            <animate attributeName="opacity" begin="0s" dur="1s" keyTimes="0;1" repeatCount="indefinite" values="1;0"/>
          </rect>
        </g>
      </svg>
    </span>
  </span>
</template>
<script>
  export default {
      name: 'IconWait'
  }
</script>
<style lang="scss"> 
  @import "../styles/_colors.scss";

  .iconWait {
    display: inline-block;
    padding: 0;
    width: toVw($vw, 30px);
    height: toVw($vw, 30px);
    margin: 0;
    position: relative;

    > span {
      > svg {
        display: block;
      }
    }
  }

  .small .iconWait {
    width: toVw($vw, 18px);
    height: toVw($vw, 18px);
  }
</style>