<template>
  <div :class="data.layerClass">  
    <template v-for="stoneItem in stoneList" :key="stoneItem.index">
      <template v-if="stoneItem.isActive">
        <div class="stone dragStone" :style="boardData.stoneContainerStyle"
        @dragstart='dragStart(pipIndex)' draggable  @dragend="dragEnd(pipIndex)">
          <img class="dragPip" draggable="true"
          :src="stoneItem.stoneType" :style="boardData.stoneStyle" />
        </div>
      </template>
      <template v-else>
        <div class="stone" draggable="false" :style="boardData.stoneContainerStyle">
          <img :src="stoneItem.stoneType" 
            :style="boardData.stoneStyle" draggable="false"/> 
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { ref, inject } from "vue";

export default {
  name: "stones",
  setup() {
    const boardData = inject('boardData');
    const dataSetup = {
      ready: false,
      layerClass: ''
    };
    const data = ref(dataSetup);

    return {
      data,
      boardData
    };
  },
  computed: {
    stoneList() {

      let list = [];
      let pip = this.boardData.pips[this.pipIndex];
      let startIndex = this.stoneLayer * 5;

      if (pip.index == 18) {
        console.log("i wuz here");
      }

      let maxEndIndex = Math.min(startIndex + 5 - 1, pip.count - 1);
      if (maxEndIndex < startIndex) {
        return list;
      }
      let stoneType = this.boardData.stoneImages[this.boardData.players[pip.playerId].stoneType];
      var count =  maxEndIndex + 1;

      for (let i=startIndex; i < count; i++) {
        list.push({isActive: false, index: i, stoneType: stoneType});
      }
      
      if (pip.isActive && pip.playerId == this.boardData.gameState.playerId && count == pip.count) {
        list[this.isTop ? list.length - 1 : 0].isActive = true;
      }

      return list;      
    }
  },

  mounted() {
    this.data.layerClass = 'stoneLayer' + this.stoneLayer;
  },

  props: {
    isTop: {
      type: Boolean,
      default: false
    },
    pipIndex: {
      type: Number
    },
    stoneLayer: {
      type: Number
    }
  },
  emits: ['show_active_moves'],
  methods: {
    clearDropzones: function() {
      for (var i=0; i < 24; i++) {
         this.boardData.pips[i].dropZone = false;
         this.boardData.pips[i].active = false;
      }
      this.boardData.gameState.bearingTray[this.boardData.gameState.playerId].dropZone = false;
    },
    dragStart: function(startIndex) {
      console.log("pip-dragStart:" + startIndex);
      if (this.boardData.gameState.inDrag) {
        console.log("badDragStart")
        return;
      }
      this.boardData.gameState.inDrag = true;
      this.clearDropzones();
      var gameState = this.boardData.gameState;
      var moveData = gameState.pipTurnStatus[startIndex];
      Object.keys(moveData.moves).forEach(pipIndex => {
        if (this.boardData.pips[pipIndex]) {
          this.boardData.pips[pipIndex].dropZone = true;
        } else {
          gameState.bearingTray[gameState.playerId].dropZone = true;
        }
      });
      this.boardData.currentDragIndex = startIndex;
    },

    dragEnd: function(index) {
      console.log("pip-dragEnd:" + index)
      console.log("dragEnd" + index);
      if (this.boardData.gameState.inDrag) {
        this.boardData.gameState.inDrag = false;
      }
    }
  }
}
</script>