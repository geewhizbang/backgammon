<template>
  <template v-if="data.ready">
    <div v-if="boardData.gameState.homeTray[data.playerId].count > 0" draggable="false" :class="'stones homeTray' + index">
      <template v-for="(n,index) in boardData.gameState.homeTray[data.playerId].count" :key="index">
        <template v-if="playerId != boardData.gameState.playerId || boardData.gameState.state != 'rollComplete' || n < boardData.gameState.homeTray[data.playerId].count">
          <div class="stone" draggable="false" :style="boardData.bearingStoneContainerStyle">
            <img draggable="false" :src="data.stone" :style="boardData.bearingStoneStyle"/> 
          </div>
        </template>
        <template v-else>
          <div class="stone dragStone" :style="boardData.bearingStoneContainerStyle"
            @dragstart="dragStart()" draggable="true" @dragend="dragEnd()">
            <img class="dragPip" draggable="true" :src="data.stone" :style="boardData.bearingStoneStyle"/>
          </div>
        </template>
      </template>
    </div>
  </template>
</template>

<script>
import { ref, inject } from "vue";
//import Services from "../services/Services.js";

export default {
  name: "HomeTray",
  components: {
    //IconPip,
  },
  setup() {

    const data = ref({
      ready: false,
      stone: null,
      playerId: ''
    });

    const boardData = inject('boardData');
    
    return {
      data,
      boardData
    };
  },
  mounted() {
    this.data.playerId = !this.isTop && !this.isLeft || this.isTop && this.isLeft ? this.boardData.playerId : this.boardData.opponentId;
    this.data.stone = this.boardData.homeStones[this.boardData.players[this.data.playerId].stoneType];
    this.data.ready = true;
  },
  props: {
    isTop:{
      type: Boolean,
      default: false
    },
    isLeft: {
      type: Boolean,
      default: false
    },
    stones: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['show_active_moves', 'enable_turn_buttons'],
  methods: {
    clearDropzones: function() {
      for (var i=0; i < 24; i++) {
         this.boardData.pips[i].dropZone = false;
      }
      this.boardData.gameState.bearingTray[this.boardData.gameState.playerId].dropZone = false;
    },
    dragStart: function() {
      console.log("home-dragStart");
      if (this.boardData.gameState.inDrag) {
        return;
      }
      this.clearDropzones();
      this.boardData.currentDragIndex = "homeTray";
      var pipTurnStatus = this.boardData.gameState.pipTurnStatus;
      var moveData = pipTurnStatus.homeTray.moves;
      Object.keys(moveData).forEach(pipIndex => {
        this.boardData.pips[pipIndex].dropZone = true;
      });
      this.boardData.gameState.inDrag = true;
    },

    dragEnd: function() {
      this.boardData.gameState.inDrag = false;
    },
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