<template>
  <div class="pips">
    <template v-if="data.ready">
      <div class="pipWrapper">
        <template v-for="pip, index in data.pips" :key="pip.index">
          <div class="pipBar" :style="boardData.pipBlockStyles[(config.isTop ? 'top' : 'bottom') + (config.isLeft ? 'Left' : 'Right')][index]">
            <div class="pipBarWrapper">
              <img :src="pip.pipImage">
              <template v-if="boardData.pips[pip.index].dropZone">
                <div class="markDropZone"></div>
              </template>
              <div class="stonesWrapper">
                <div class="stonesInnerWrapper">
                  <div class="stones">
                    <Stones :isTop="config.isTop" :pipIndex="pip.index" :stoneLayer="0" />
                    <Stones :isTop="config.isTop" :pipIndex="pip.index" :stoneLayer="1" />
                    <Stones :isTop="config.isTop" :pipIndex="pip.index" :stoneLayer="2" />
                  </div>
                </div>
              </div>
              <!-- <span>{{pip.index}}</span> -->
              <template v-if="boardData.pips[pip.index].dropZone">
                <div class="dropZone" @drop="onDrop(pip.index)" @dragover.prevent @dragenter.prevent></div>
              </template>  
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
    
<script>
import { ref, inject } from "vue";
import Services from "../services/Services.js";
import Stones from "./Stones.vue";

export default {
  name: "pips",
  components: {
    Stones
  },
  setup() {

    const dataSetup = {
      ready: false,
      pips: [],
    };

    const boardData = inject('boardData');

    const data = ref(dataSetup);

    return {
      data,
      boardData
    };
  },
  mounted() {
    const endIndex = this.config.start + 6;
    var pips = [];
    for (var i = this.config.start; i < endIndex; i++) {
      pips.push({
        pipImage: i % 2 == 0 ? this.boardData.pipImages.pipA : this.boardData.pipImages.pipB,
        index: i
      });
    }
    this.data.pips = pips;

    Services.log("config", this.config);
  
    //Services.log('this.data', this.data);
    //Services.log('this.boardData', this.boardData);   
    this.data.ready = true;
  },
  methods: {
    onDrop: function(dropIndex) {
      if (this.boardData.currentDragIndex == null) {
        console.log("badOnDrop");
        return;
      }
      console.log("pip-onDrop:" + dropIndex);
      
      console.log("onDrop" + dropIndex);
      
      let pip = this.boardData.pips[dropIndex];

      var moves = this.boardData.gameState.pipTurnStatus[this.boardData.currentDragIndex].moves;
      var move = moves[dropIndex]
      if (!move) {
        return;
      }

      if (this.boardData.currentDragIndex != "homeTray") {
      
        var fromPip = this.boardData.pips[this.boardData.currentDragIndex];
        fromPip.count--;
        if (fromPip.count == 0) {
          fromPip.playerId = null;
        }    
    
    } else {
        this.boardData.gameState.homeTray[this.boardData.gameState.playerId].count--;
      }

      if (pip.playerId !== null && (pip.playerId != this.boardData.gameState.playerId)) {
        this.boardData.gameState.homeTray[pip.playerId].count = this.boardData.gameState.homeTray[pip.playerId].count + 1;
        pip.count = 0;
      }

      pip.playerId = this.boardData.gameState.playerId;
      pip.count++;

      var gameRolls = this.boardData.gameState.roll;
      
      move.rollsUsed.forEach(value => {
        var found = false;
        for (var i=0; i < gameRolls.length && !found; i++) {
          var rollState = gameRolls[i];
          if (!rollState.used && rollState.value == value) {
            rollState.used = true;
            found = true;
          }
        }
      });
      this.boardData.gameState.movesMade.push({fromPip: fromPip, toPip: pip});
      this.boardData.gameState.inDrag = false;
      this.boardData.currentDragIndex == null;
      this.$emit('show_active_moves');
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
};
</script>

<style lang='scss'>
@import "../styles/_colors.scss";

//@import "../generatedStyles/pips.scss";

</style>