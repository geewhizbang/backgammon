<template>
  <teleport to="body">
    <div v-if="modal && data.isDisplayed" class="modalBackground" v-on:click="forceHide()"></div>
    <div class="tooltip" :style="data.style">
      <div :class="data.containerClass">
        <div ref="tooltipContent" class="tooltip-content" :style="data.contentStyle">
          <slot ref="content"></slot>
        </div>
        <div class="tooltip-arrow-box">
          <div class="tooltip-arrow" ref="tooltipArrow" :style="data.arrowStyle">
            <svg width="100%" height="100%" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality"
             fill-rule="evenodd" clip-rule="evenodd"
              viewBox="0 0 0.355 0.355">
              <polygon id="fill" points="0.177,0.044 0.332,0.355 0.022,0.355 " :fill="data.backgroundColor" />
              <polyline stroke="#ffffff" fill="none" stroke-width="1px" vector-effect="non-scaling-stroke" stroke-miterlimit="2.61313" 
              points="0,0.319 0.04,0.319 0.177,0.044 0.314,0.319 0.355,0.319 "/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref } from 'vue';
import Services from '../services/Services.js';

export default {
  name: 'Tooltip',
  setup() {
    const data = ref({
      strokeWidth: 0.108,
      contentStyle: {},
      style: {},
      arrowStyle: {},
      containerClass: '',
      backgroundColor: "#cccccc",
      showRequested: false,
      hideRequested: false,
      isDisplayed: false,
      tooltipId: null,
      active: false,
      listeners: [],
      currentShift: null,
      originalShift: null,
      retries: 0
    });

    return {
      data,
    };
  },
  props: {
    id: { 
      type: String,
      default: null
    },
    positioner: {
      type: String,
      default:""
    },
    position: {
      type: String,
      default: 's',
    },
    event_on: {
      type: String,
      default: 'mouseenter',
    },
    event_off: {
      type: String,
      default: 'mouseleave',
    },
    border_color: {
      type: String,
      default: '#ffffff'
    },
    modal: {
      type: Boolean,
      default: false
    },
    manual: {
      type: Boolean,
      default: false
    },
    shift: {
      type: String,
      default: null
    },
    keep_open: {
      type: Array,
      default: () => []
    },
    z_index: {
      type: String,
      default: '100'
    }
  },

  methods: {
    forceHide: function() {
      if (this.data.isDisplayed) {
        this.data.style = {top: '-3000px', left: '-3000px'};
      }
      this.data.hideRequested = false;
      this.data.showRequested = false;
      this.data.isDisplayed = false;

      this.setStatus("open", false);
    },
    setStatus: function(state, value) {
      if (this.id) {
        Services.setStatus(this.id, state, value);
      }
    },
    refresh: function() {
      if (this.data.isDisplayed) {
        this.show(this.positioner);
      }
    },
    manualShow: function() {
      this.show(this.positioner);
    },
    show: function (positioner) {
      let that = this;
      
      if (positioner) {
        this.data.positioner = positioner;
      }
      this.setStatus("open", true);

      var positionerRef = this.$parent.$refs[this.data.positioner];

      if (!this.$refs.tooltipContent.children) {
        this.setStatus("open", false);
        return;
        //exit, the tooltip content has been destroyed.
      }
      if (this.data.showRequested) {
        this.data.hideRequested = false;
      }
      this.data.showRequested = true;
      
      var delay = setTimeout(function() {
        that.data.showRequested = false;
        if (that.data.hideRequested) {
          that.hide();
        }
        clearTimeout(delay);
      }, 200);
      this.data.isDisplayed = true;
      var keepOpen = [this.data.tooltipId];
      this.keep_open.forEach(id => { keepOpen.push(id)})
      Services.closeOpenTooltips(keepOpen);

      var rects;

      try {
        rects = {
          positioner: positionerRef.getBoundingClientRect(),
          content: this.$refs.tooltipContent.children[0].getBoundingClientRect(),
          arrow: this.$refs.tooltipArrow.getBoundingClientRect(),
          window: Services.percentHeightWidth(100)
        };
      } catch(e) {
        console.log("the content or positioner probably no longer rendered, so close:\n" + e);
        this.hide();
      }

      if (rects.positioner.top > 20000) {
        var timeout = setTimeout(function () {
          that.data.retries++;
          if (that.data.retries > 1) {
            console.log("we are hosed on tooltip retries");
          } else {
            that.show(that.data.positioner)
          }
          clearTimeout(timeout);
        }, 100);
      }

      that.data.retries = 0;
      console.log(JSON.stringify(rects, null, ' '));

      this.data.backgroundColor =  window.getComputedStyle(this.$refs.tooltipContent.children[0]).backgroundColor;

      console.log('rects:' + JSON.stringify(rects, null, '  '));

      var shift;
      if (this.data.currentShift == null) {
        shift = this.shift ? JSON.parse(this.shift) : {};
        this.data.originalShift = shift;
        this.data.currentShift = shift;
      } else {
        shift = this.data.currentShift;
      }
      var offPage = false;
      var style;
      var iterator = 0;
      var arrowStyle;
      var offset = Services.percentHeightWidth(0.5)["width"];
      console.log("Offset: " + offset);

      do {
        offPage = false;
        arrowStyle = {};
        console.log('iterator: ' + iterator);

        switch (this.position) {
          case 's':
            style = {
              left: rects.positioner.left,
              top: rects.positioner.top + rects.positioner.height - rects.arrow.height/4,
              width: rects.content.width,
              height: rects.content.height + rects.arrow.height
            };
            break;
          case 'sc':
            style = {
              left: rects.positioner.left + rects.positioner.width/2 - rects.content.width/2,
              top: rects.positioner.top + rects.positioner.height - rects.arrow.height/4,
              width: rects.content.width,
              height: rects.content.height + rects.arrow.height
            };
            break;
          case 'n':
            style = {
              left: rects.positioner.left,
              top: rects.positioner.top - rects.content.height - rects.arrow.height + rects.arrow.height/5,
              width: rects.content.width,
              height: rects.content.height + rects.arrow.width
            };
            break;
          case 'nc':
            style = {
              left: rects.positioner.left + rects.positioner.width/2 - rects.content.width/2,
              top: rects.positioner.top - rects.content.height - rects.arrow.height - rects.arrow.height/5,
              width: rects.content.width,
              height: rects.content.height + rects.arrow.height,
            };
            break;
          case 'e':
            style = {
              left: rects.positioner.right - rects.arrow.height/4,
              top: rects.positioner.top - offset,
              width: rects.content.width + rects.arrow.width,
              height: rects.content.height
            };
            break;
          case 'w':
            style = {
              left: rects.positioner.left - rects.content.width + rects.arrow.height/4,
              top: rects.positioner.top - offset,
              width: rects.content.width + rects.arrow.width,
              height: rects.content.height
            };
            break;
          case 'ec':
            style = {
              left: rects.positioner.right - rects.arrow.height/4,
              top: rects.positioner.top + rects.positioner.height/2 - rects.content.height/2 - rects.arrow.height/5,
              width: rects.content.width + rects.arrow.width,
              height: rects.content.height
            };
            break;
          case 'wc':
            style = {
              left: rects.positioner.left - rects.content.width + rects.arrow.height/4,
              top: rects.positioner.top + rects.positioner.height/2 - rects.content.height/2 - rects.arrow.height/5,
              width: rects.content.width + rects.arrow.width,
              height: rects.content.height
            };
            break;
        }
        
        Object.keys(shift).forEach(direction => {
          style[direction] = style[direction] + Services.percentHeightWidth(shift[direction]).height;
        });
    
        switch (this.position) {
          case "e":
          case "w":
            arrowStyle.top = rects.positioner.top - style.top  + offset + 'px';
            break;
          case "s":
          case "n":
            arrowStyle.left = rects.positioner.left - style.left + offset + 'px';
            break;
          case "ec":
          case "wc":
            arrowStyle.top = rects.positioner.top - style.top + rects.positioner.height / 2 - rects.arrow.height / 2 + 'px';
            break;
          case "sc":
          case "nc":
            arrowStyle.left = rects.positioner.left - style.left + rects.positioner.width / 2 - rects.arrow.width / 2 + 'px';
            break;
        }
        
        if ((style.top + style.height) > rects.window.height) {
          shift.top = shift.top - (rects.window.height - (style.top + style.height)) + Services.percentHeightWidth(10)["height"];
          offPage = true;
        } 
        var isCentered = (this.position == "ec" || this.position == "wc");
        if ((style.top + style.height) < (rects.positioner.top - (isCentered ? rects.positioner.height / 2 : Services.percentHeightWidth(10)["height"]))) {
          shift = this.originalShift;
          offPage = true;
        }
          
        if (offPage) {
          this.data.currentShift = shift;
        }
        iterator++;
      }
      while (offPage && iterator < 2); // if we had problems try again with corrected shift;

      Object.keys(style).forEach(key => {
        style[key] = style[key] + "px";
      });

      console.log(this.position + "_" + this.id + ' Style:' + JSON.stringify(style, null, '  '));
      this.data.containerClass = 'tooltip-container_' + this.position;
      this.data.arrowStyle = arrowStyle;
      this.data.contentStyle = {background: this.data.backgroundColor};
      style.zIndex = this.z_index;
      this.data.style = style;

    },
    hide: function () {
      console.log('hide');
      if (this.data.showRequested) {
        this.data.hideRequested = true;
        console.log("cancelled hide");
        return;
      }
      var that = this;

      var delay = setTimeout(function() {
        if (!that.data.showRequested) {
          that.data.style = '{top: -1000px, left: -1000px}';
          that.data.isDisplayed = false;
          that.setStatus("open", false);
        } 
        clearTimeout(delay);
        that.data.hideRequested = false;
      }, 400);

      this.data.hideRequested = true;
      
    },
  },

  mounted() {

    //if id is provided, it uses the tooltip id, or the service creates one. Ids have to be unique or events overwrite each other.
    this.data.tooltipId = Services.registerTooltip(this.id, this.show, this.forceHide, this.refresh);
    this.setStatus("open", false);

    if (this.positioner) {
      var positionerRef = this.$parent.$refs[this.positioner];
      this.data.positioner = this.positioner;
      if (!this.manual) {
        this.data.listeners.push(Services.attachEvent(positionerRef, this.event_on, this.manualShow, "Tooltip_event_on"));
      }

      if (!this.modal && !this.manual) {
        this.data.listeners.push(Services.attachEvent(positionerRef, this.event_off, this.hide, "Tooltip_event_off"));
      }
    }
  },
  beforeUnmount() {
    Services.destroyAll(this.data.listeners);
    Services.destroyTooltip(this.data.tooltipId);
  }
};
</script>

<style lang='scss'>
@import "../styles/_colors.scss";

$arrow-size: 16px;
$arrow-overlapLR: 0px;
$arrow-overlapTB: 1px;
$arrow-indent: 8px;

div.tooltip {
  position: absolute;
  width: 1px;
  height: auto;
  overflow: hidden;
  z-index: 100;
  left: -3000px;
  top: -3000px;
  padding: 0;
  margin: 0;

  > div {

    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: visible;

    &.tooltip-container_s, &.tooltip-container_sc {
      > .tooltip-arrow-box {
        top: 0;
        left: 0;
        bottom: auto;
        height: toVw($vw, $arrow-size);
        right: 0;
        > .tooltip-arrow {
          top: toVw($vw, 2px);
        }
      }
      > .tooltip-content {
        top: toVw($vw, $arrow-size);
        bottom: 0;
        right: 0;
        left: 0;
      }
    }

    &.tooltip-container_n, &.tooltip-container_nc {
      > .tooltip-arrow-box {
        top: auto;
        bottom: 0;
        left: 0;
        height: toVw($vw, $arrow-size);
        right: 0;
        > .tooltip-arrow {
          transform: rotate(180deg);
          bottom: $arrow-overlapTB;
        }
      }
      > .tooltip-content {
        top: 0;
        bottom: toVw($vw, $arrow-size);
        right: 0;
        left: 0;
      }
    }

    &.tooltip-container_e, .tooltip-container_ec {
      > .tooltip-arrow-box {
        top: 0;
        left: 0;
        right: auto;
        width: toVw($vw, $arrow-size);
        bottom: 0;
        > .tooltip-arrow {
          transform: rotate(-90deg);
          left: toVw($vw, $arrow-overlapLR);
        }
      }
      > .tooltip-content {
        top: 0;
        bottom: 0;
        right: 0;
        left: toVw($vw, 15px);
      }
    }

    &.tooltip-container_w, .tooltip-container_wc {
      > .tooltip-arrow-box {
        top: 0;
        bottom: 0;
        right: 0;
        width: toVw($vw, $arrow-size);
        left: auto;
        padding: 0;

        > .tooltip-arrow {
          padding: 0;
          transform: rotate(90deg);
          left: toVw($vw, $arrow-overlapTB);
        }
      }
      > .tooltip-content {
        top: 0;
        left: 0;
        bottom: 0;
        right: toVw($vw, $arrow-size);
      }
    }
    
    > .tooltip-arrow-box {
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: toVw($vw, $arrow-size);
      bottom: auto;
      padding: 0;
      z-index: 101;

      > .tooltip-arrow {
        position: relative;
        width: toVw($vw, $arrow-size);
        height: toVw($vw, $arrow-size);
        > svg {
          display:block;
        }
      }
    }

    > .tooltip-content {
      display: block;
      position: absolute;
      top: toVw($vw, $arrow-size);
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 100;
      padding: 0;
      border-radius: toVw($vw, 8px);
      margin: 0;
      z-index: 100;
      overflow: hidden;
      border: 1px solid white;
    }
  }
}

</style>
 