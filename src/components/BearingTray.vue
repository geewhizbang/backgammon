<template>
  <div v-if="data.ready" draggable="false" class="bearingTray">
    <div :class="['bearingTrayContainer', {'dropZone': this.boardData.gameState.bearingTray[data.playerId].dropZone}]" >
      <template v-for="(n,index) in boardData.gameState.bearingTray[data.playerId].count" :key="index">
        <div class="stone" :style="boardData.bearingStoneContainerStyle">
          <img :src="stone" :style="boardData.bearingStoneStyle" /> 
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, inject } from "vue";
import Services from "../services/Services.js";

export default {
  name: "BearingTray",
  components: {

  },
  setup() {

    const boardData = inject('boardData');

    const data = ref({
      ready: false,
      stone: null,
      playerId: null
    });
    
     return {
      data,
      boardData
    };
  },
  mounted() {
    Services.log("boardData",this.boardData);
    this.data.playerId = this.isTop && !this.isLeft || !this.isTop && this.isLeft ? this.boardData.playerId : this.boardData.opponentId;
    this.data.stone = this.boardData.homeStones[this.boardData.players[this.data.playerId].stoneType];
    this.data.ready = true;
  },
  props: {
    isTop: {
      type: Boolean,
      default: true,
    },
    isLeft: {
      type: Boolean,
      default: true,
    }
  },
  emits: ['show_active_moves'],
  methods: {
    onDrop: function() {

      let fromPip = this.boardData.pips[this.boardData.currentDragIndex];
      fromPip.count--;
      if (fromPip.count == 0) {
        fromPip.playerId = null;
      }
      
      var move = this.boardData.gameState.bearingTray[this.data.playerId].moves["bearingTray"];
      
      var gameRolls = this.boardData.gameState.roll;
      move.forEach(value => {
        var found = false;
        for (var i=0; i < gameRolls.length && !found; i++) {
          var rollState = gameRolls[i];
          if (!rollState.used && rollState.value == value) {
            rollState.used = true;
            found = true;
          }
        }
      });
     
      this.$emit('show_active_moves');
     
    }

  },
  // unmounted() {
  //   Services.removeListeners(this.eventListeners);
  //   Services.destroyAll(this.listeners);
  // }
};
</script>

<style lang='scss'>
@import "../styles/_colors.scss";

//@import "../generatedStyles/pips.scss";

</style>