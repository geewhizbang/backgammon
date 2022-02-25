<template>
  <div class="appBody">
    <template v-if="boardData.ready">
      <div :class="['board', {'inDrag': boardData.gameState.inDrag}]" :style="boardData.outerStyle">
        <div :style="boardData.leftPanelStyle">
          <template v-for="image in boardConfig.images" :key="image.name">
            <template v-if="!image.cloneOnly">
              <div :style="boardData.boardImages[image.name].style">
                <div class="imageContainer">
                  <template v-if="image.image"><img :src="image.image" :style="boardData.boardImages[image.name].imageStyle" /></template>
                  <template v-if="image.writePips">
                    <Pips @show_active_moves="showActiveMoves()" :config="config.pipBlocks[boardData.boardDirection].tl" />
                    <Pips @show_active_moves="showActiveMoves()" :config="config.pipBlocks[boardData.boardDirection].bl" />
                  </template>
                  <template v-if="image.writeTrays && !config.pipBlocks[boardData.boardDirection].trayOnRight"> 
                    <HomeTray :isTop="image.isTrayTop" :isLeft="true" />
                    <BearingTray :isTop="image.isTrayTop" :isLeft="true"/>
                  </template>
                </div>
              </div>
            </template>
          </template>
        </div>
        <div :style="boardData.rightPanelStyle">
          <template v-for="image in boardConfig.images" :key="image.name">
            <template v-if="!image.firstOnly">
              <div draggable="false" :style="boardData.boardImages[image.name].cloneStyle">
                <div class="imageContainer">
                  <template v-if="image.image"><img draggable="false" :src="image.image" :style="boardData.boardImages[image.name].cloneImageStyle"/></template>
                  <template v-if="image.writePips">
                    <Pips @show_active_moves="showActiveMoves()" :config="config.pipBlocks[boardData.boardDirection].tr"/>
                    <Pips  @show_active_moves="showActiveMoves()" :config="config.pipBlocks[boardData.boardDirection].br" />
                  </template>
                  <template v-if="image.writeTrays && config.pipBlocks[boardData.boardDirection].trayOnRight" >
                    <BearingTray @show_active_moves="showActiveMoves()"  :isTop="image.isTrayTop" :isLeft="false"/>
                    <HomeTray :isTop="image.isTrayTop" :isLeft="false" />
                  </template>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    
      <div v-if="boardData.gameState.showRoller" class="outerPanel" :style="boardData.buttonPanelStyle">
        <div class="panel">
          <div class="diceState" v-if="boardData.gameState.rollCount > 1">
            <label>Moves In Play</label>
            <div class="diceValues">
              <template v-for="roll, index in boardData.gameState.roll" :key="index">
                <span :class="{'used': roll.used, 'blocked': roll.blocked}">{{roll.value}}</span>
              </template>
            </div>
          </div>
          <div class="player">
            {{boardData.players[boardData.gameState.playerId].name}}'s Turn
          </div>
          <div class="buttons">
            <template v-if="boardData.gameState.rollCount > 1">
              <button :disabled="boardData.gameState.state != 'movesComplete'" @click="submitTurn()">Submit Turn</button>
              <button :disabled="!boardData.gameState.movesMade.length > 0" @click="undoMoves()">Undo Moves</button>
            </template>
            <button :disabled="!config.enableDiceRoll[boardData.gameState.state]" @click="rollDice()">Roll Dice</button>
          </div>
        </div>
     
        <div class="diePanelWrapper" v-if="config.showDice[boardData.gameState.state]">
          <div class="diePanelOuter">
            <div class="diePanel" v-for="(n, index) in 2" :key="index">
              <div class="dieContainer">
                <div :ref="'die' + n" class="die">
                  <div class="front">
                    <span class="dot dot1"></span>
                  </div>
                  <div class="back">
                    <span class="dot dot1"></span>
                    <span class="dot dot2"></span>  
                    <span class="dot dot3"></span>
                    <span class="dot dot4"></span>
                    <span class="dot dot5"></span>
                    <span class="dot dot6"></span>
                  </div>
                  <div class="right">
                    <span class="dot dot1"></span>
                    <span class="dot dot2"></span>  
                    <span class="dot dot3"></span>
                  </div>
                  <div class="left">
                    <span class="dot dot1"></span>
                    <span class="dot dot2"></span>  
                    <span class="dot dot3"></span>
                    <span class="dot dot4"></span>
                  </div>
                  <div class="top">
                    <span class="dot dot1"></span>
                    <span class="dot dot2"></span>  
                    <span class="dot dot3"></span>
                    <span class="dot dot4"></span>
                    <span class="dot dot5"></span>
                  </div>
                  <div class="bottom">
                    <span class="dot dot1"></span>
                    <span class="dot dot2"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <IconHelp/>
      <div class="boardState">{{boardData.gameState.state}}</div>
    </template>
  </div>
</template>
    
<script>
import { provide, ref } from "vue";
// import axios from "axios";
// import Qs from 'qs';
import Services from "../services/Services.js";
import IconHelp from "../icons/IconHelp.vue";
import Pips from "./Pips.vue";
import BearingTray from "./BearingTray.vue";
import HomeTray from "./HomeTray.vue";

export default {
  name: "Board",
  components: {
    IconHelp,
    Pips,
    HomeTray,
    BearingTray
  },
  setup() {

    const eventListeners = [];
    const listeners = [];
    const hinge = require('@/assets/images/board-hinge.png');
    const pipA = require('@/assets/images/pip-A.png');
    const pipB = require('@/assets/images/pip-B.png');
    const stoneDark = require('@/assets/images/stone-dark.png');
    const stoneWhite = require('@/assets/images/stone-white.png');
    const divider = require('@/assets/images/divider.png');
    const trayDivider = require('@/assets/images/trayDivider.png');
    const trayBottom = require('@/assets/images/trayBottom.png');
    const doublingTray = require('@/assets/images/doublingTray.png');
    const homeStoneWhite = require('@/assets/images/stone-white-tray.png');
    const homeStoneDark = require('@/assets/images/stone-dark-tray.png');
    
    const config = {
      initialPips: {
        0: 2,
        11: 5,
        16: 3,
        18: 5
      },
      pipBlocks: {
        normal: {
          tl: {start: 12, isTop: true, isLeft: true},
          bl: {start: 6, isTop: false, isLeft: true},
          tr: {start: 18, isTop: true, isLeft: false},
          br: {start: 0, isTop: false, isLeft: false},
          trayOnRight: true
        },
        reversed: {
          tl: {start: 0, isTop: true, isLeft: true},
          bl: {start: 18, isTop: false, isLeft: true},
          tr: {start: 6, isTop: true, isLeft: false},
          br: {start: 12, isTop: false, isLeft: false},
          trayOnRight: false
        },
      },
      previousDieTransform: {},
      boardStates: ['startTurn', 'rollingDice', 'rollComplete', 'movesComplete'],
      showDice: { rollComplete: true, rollingDice: true},
      enableDiceRoll: { startTurn: true }
    };

    const boardConfig = { 
      size: {height: 905, width: 550, margin: 30},
      height: 292,
      pipSpacing: 8.3,
      combinedPipMargin: 17,
      stoneContainer: {
        height: 65,
        width: 65
      },
      stoneSize: {
        height: 72,
        width: 69
      },
      mainBoardWidth: 420,
      dieParams: {
        dice: {
          'grid-gap': ['#{x}px', 2],
          'grid-template-columns': [ 'repeat(auto-fit, minmax(#{x}px, 1fr))', 8],
          padding: ['#{x}px', 2],
        },
        dieList: {
          height: ['#{x}px', 6],
          width: ['#{x}px', 6],
        }
      },
      cloneMargin: 4,
      pipBlockLocations: {
        topLeft: 9,
        topRight: 9,
        bottomLeft: 8,
        bottomRight: 8
      },
      images: [
      {
        name: 'background',
        background: '#553311',
        top: 15,
        bottom: 15,
        width: 8,
        right: -6,
        firstOnly: true,
      },{
        name: 'TL',
        image: require('@/assets/images/board-TL.png'),
        width: 550,
        height: 49,
        top: 0,
        left: 0,
        cloneTransform: 'scaleX(-1)'
      },{
        name: 'L',
        image: require('@/assets/images/board-L.png'),
        width: 34,
        height: 890,
        top: 0,
        left: 0,
        cloneTransform: 'scaleX(-1)'
      },{
        name: 'tray',
        image: trayBottom,
        width: 53,
        height: 389,
        top: 48,
        left: 34,
        cloneTransform: 'scaleX(-1)',
        isTrayTop: true,
        writeTrays: true
      },{
        name: 'trayDividerA',
        image: trayDivider,
        width: 66,
        height: 18,
        top: 432,
        left: 24,
        cloneTransform: 'scaleX(-1)',
      },{
        name: 'doublingTray',
        image: doublingTray,
        width: 60,
        height: 32,
        top: 445,
        left: 29,
        cloneTransform: 'scaleX(-1)',
        writeDoubler: true
      },{
        name: 'trayDividerB',
        image: trayDivider,
        width: 66,
        height: 18,
        top: 477,
        left: 24,
        cloneTransform: 'scaleX(-1)',
      },{
        name: 'trayBottom',
        image: trayBottom,
        width: 56,
        height: 389,
        bottom: 24,
        left: 34,
        cloneTransform: 'scaleX(-1)',
        transform:'scaleY(-1)',
        isTrayTop: false,
        writeTrays: true
      },{
        name: 'divider',
        image: divider,
        width: 25,
        height: 853,
        top: 19,
        left: 88,
        cloneTransform: 'scaleX(-1)',
      },{
        name: 'main',
        image: require('@/assets/images/board-main.png'),
        width: 420,
        height: 822,
        top: 49,
        left: 110,
        cloneTransform: 'scaleX(-1)',
        writePips: true
      }, {
        name: 'R',
        image: require('@/assets/images/board-R.png'),
        width: 19,
        height: 890,
        right: 0,
        top: 0,
        cloneTransform: 'rotate(180deg)'
      }, {
        name: 'BL',
        image: require('@/assets/images/board-BL.png'),
        width: 550,
        height: 35,
        bottom: 0,
        left: 0,
        cloneTransform: 'scaleX(-1)'
      }, {
        name: 'hinge',
        image: hinge,
        width: 7,
        top: 110,
        right: -5,
        height: 78,
        cloneOnly: true,
      }, {
        name: 'hingeRepeat',
        image: hinge,
        width: 7,
        bottom: 110,
        right: -5,
        height: 78,
        cloneOnly: true,
      }]
    };
    
    const boardDataSetup = {
      ready: false,
      boardDirection: 'normal',
      leftPanelStyle: {},
      rightPanelStyle: {},
      buttonPanelStyle: {},
      outerStyle: {},
      boardImages: {},
      pipBlockStyles: {},
      playerId: '1',
      opponentId: '2',
      homeStones: {
        light: homeStoneWhite,
        dark: homeStoneDark,
      },
      players: {
        '1': {
          name: "Bryce",
          id: '1', 
          stoneType: 'light', 
          fromBottom: true, 
          bearingOff: false
        }, 
        '2': {
          name: "Geoff", 
          id: '2',
          stoneType: 'dark',
          fromBottom: false,
          bearingOff: false
        }
      },
      gameState: { 
        state: "startTurn",
        previousStates: [],
        playerId: '1',
        opponentId: '2',
        doubleOwner: null, 
        doubleValue: 0, 
        roll:[], 
        movesMade: [],
        rollCount: 0,
        evenRoll: false,
        inDrag: false,
        pipTurnStatus: {},
        transforms: {
          die1: "",
          die2: ""
        },
        t: {
          die1: "",
          die2: ""
        },
        bearingTray: {
          '1': { count: 0, playerId: '1', dropZone: false},
          '2': { count: 0, playerId: '2', dropZone: false}
        },
        homeTray: {
          '1': { count: 0, playerId: '1', active: false, moves: null},
          '2': { count: 0, playerId: '2', active: false, moves: null}
        }
      },
      pipImages: {pipA: pipA, pipB: pipB},
      stoneImages: {light: stoneWhite, dark: stoneDark },
      pips: [],
      styles: {},
      dragHandled: null,
      currentDragIndex: null,
      paddingTop: 2,        
      stoneContainerStyle: {},
      stoneStyle: {}
    };
    
    boardConfig.images.forEach(item => {
      boardDataSetup.boardImages[item.name] = {
        style: {},
        cloneStyle: {},
        imageStyle: {},
        cloneImageStyle: {}
      }      
    });

    const boardData = ref(boardDataSetup);
    
    provide('boardData', boardData);

    const dieScale = ref('1px');

    return {
      boardConfig,
      boardData,
      dieScale,
      eventListeners,
      listeners,
      config
    };
  },
  mounted() {
    this.setScale();
    this.eventListeners.push(Services.createEventListener(window, 'resize', this.setScale, 'pageResizer'));
    this.setupBoard();
    this.boardData.ready = true;
    var that = this;
    var timeout = setTimeout(function() {
      that.showRoller(true);
      clearTimeout(timeout);
    }, 1000);

  },
  methods: {

    setBoardState: function(newState) {
      if (this.config.boardStates.indexOf(newState) < 0) {
        alert("Fatal Error. Unknown boardstate: " + newState);
      }
      if (newState == "startTurn") {
        this.boardData.gameState.previousStates = [];
      } else {
        this.boardData.gameState.previousStates.push[this.boardData.gameState.state];
      }
      this.boardData.gameState.state = newState;
    },

    submitTurn: function() {

      var temp = this.boardData.gameState.playerId;
      this.boardData.gameState.playerId = this.boardData.gameState.opponentId;
      this.boardData.gameState.opponentId = temp;
      this.boardData.gameState.roll = [];
      this.boardData.gameState.rollCount = 0;
      this.setBoardState("startTurn");
    },

    undoMoves: function() {

    },

    enableTurnButtons: function() {
      console.log("enable turn buttons");
      this.unmarkAllPips();
      this.setBoardState("movesComplete");
    },

    applyTransforms: function() {
      var t = this.boardData.gameState.transforms;
      this.$refs['die1'].style.transform = t.die1;
      this.$refs['die2'].style.transform = t.die2;
    },

    showRoller: function (state) {
      this.boardData.gameState.showRoller = state;
    },

    unmarkAllPips: function() {
      for (var i = 0; i < 24; i++) {
        this.boardData.pips[i].isActive = false;
        this.boardData.pips[i].dropZone = false;
      }
      //Services.log("pips", this.boardData.pips);
    },

    calculateMoves: function(fromBottom, index, rolls, turnStatusIndex, rollsUsed) {
      
      var playerId = this.boardData.gameState.playerId;
      var previousRollUsed = null;
      var direction = fromBottom ? 1 : -1;
      var continueLoop = true;

      for (var i = 0; i < rolls.length && continueLoop; i++) {
        var roll = rolls[i];
        if (!roll.used) {
          var currentRoll = roll.value;
          var rollMoveIndex = index + direction * currentRoll;
          if (rollMoveIndex < 24 && rollMoveIndex > -1) {
            
            var rollPip = this.boardData.pips[rollMoveIndex];
            if (
              rollPip.playerId == null ||
              rollPip.playerId == playerId || 
              rollPip.count < 2) {  

              var rollsLeft = this.cloneArray(rolls);
              rollsLeft.splice(i, 1);

              var rollsUsedNow = this.cloneArray(rollsUsed);
              rollsUsedNow.push(currentRoll);

              roll.blocked = false;
              
              if (turnStatusIndex > -1) {
                this.boardData.gameState.pipTurnStatus[turnStatusIndex].moves[rollMoveIndex] = {
                  rollsUsed: this.cloneArray(rollsUsedNow),
                  rollsLeft: rollsLeft
                };

                if (rollsLeft.length > 0) {
                  this.calculateMoves(fromBottom, rollMoveIndex, rollsLeft, turnStatusIndex, rollsUsedNow);
                }
                this.setActivePip(index);
                continueLoop = false;

              } else if (!this.boardData.gameState.pipTurnStatus[index] ) {
                this.boardData.gameState.pipTurnStatus[index] = {
                  moves: {}
                };

                this.setActivePip(index);

                this.boardData.gameState.pipTurnStatus[index].moves[rollMoveIndex] = {
                  rollsUsed: this.cloneArray(rollsUsedNow),
                  rollsLeft: rollsLeft
                };

                if (rollsLeft.length > 0) {
                  this.calculateMoves(fromBottom, rollMoveIndex, rollsLeft, index, rollsUsedNow);
                }
              } else {

                if (previousRollUsed != currentRoll) {
                  this.boardData.gameState.pipTurnStatus[index].moves[rollMoveIndex] = {
                    rollsUsed: rollsUsedNow,
                    rollsLeft: rollsLeft
                  };

                  if (rollsLeft.length > 0) {
                    this.calculateMoves(fromBottom, rollMoveIndex, rollsLeft, index, rollsUsedNow);
                  }
                }
              }
              previousRollUsed = currentRoll;          
            }       
          }
        }
      }
    },

    setActivePip: function(index) {
      this.boardData.pips[index].isActive = true;
    },

    rollDice: function() {

      this.boardData.gameState.rollCount = 0;
      this.setBoardState("rollingDice");
      this.boardData.gameState.movesMade = [];
      var rolls = [];
      var roll;
      var i;

      for (i = 1; i < 3; i++) {
        var dieName = 'die' + i;
        roll = this.getRandomNumber(1, 6);
        rolls.push({value: roll, used: false, blocked: true});
        this.setDieValue(dieName, roll);
      }
      var isDoubles = rolls[0].value == rolls[1].value;
      if (isDoubles) {
       for (i = 2; i < 4; i++) {
         rolls.push({value: roll, used: false, blocked: true});
       }
      }
      this.boardData.gameState.roll = rolls;
      this.boardData.gameState.evenRoll = !this.boardData.gameState.evenRoll;
      
    },

    forceRender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },

    showActiveMoves: function() {

      // start move logic
      this.unmarkAllPips();
      
      this.boardData.gameState.inDrag = false;
      var date = new Date();
      console.log("showActiveMoves" + date.getSeconds());
      this.boardData.gameState.pipTurnStatus = {};
      var i, index;
      let playerId = this.boardData.gameState.playerId;
      var fromBottom = this.boardData.players[playerId].fromBottom;
     
      var rolls = this.cloneArray(this.boardData.gameState.roll);
      if (this.boardData.gameState.homeTray[playerId].count > 0) {
        var turnStatus = {
          moves: {},
        };

        var direction = fromBottom ? 1 : -1;
        index = fromBottom ? -1 : 24
        
        var previousMove = null;
        var continueLoop = true;
        for (i = 0; i < rolls.length && continueLoop; i++) {
          var roll = rolls[i];
          var currentRoll = roll.value;
          if (currentRoll == previousMove) {
            continueLoop = false;
          } else {
            var rollMoveIndex = index + direction * currentRoll;
            var rollPip = this.boardData.pips[rollMoveIndex];
            if (
              rollPip.playerId == null ||
              rollPip.playerId == playerId || 
              rollPip.count < 2) 
            { 
              var rollsLeft = this.cloneArray(rolls);
              roll.blocked = false;
              turnStatus.moves[rollMoveIndex] =  {
                rollsUsed: [currentRoll],
                rollsLeft: rollsLeft.splice(i, 1)
              };
              
            }
            previousMove = currentRoll;
          }
        }
        this.boardData.gameState.pipTurnStatus['homeTray'] = turnStatus;
      }
      else {   
        for (i = 0; i < 24; i++) {
          index = this.mapPipIndex(i, fromBottom);
          var pip = this.boardData.pips[index];
          if (pip.count > 0 && pip.playerId == playerId) {
            this.calculateMoves(fromBottom, index, rolls, -1, []);
          }
        }
      }
      
      var movesAvailable = false;
      this.boardData.gameState.roll.forEach(roll => {
        if (!roll.used && !roll.blocked) {
          movesAvailable = true;
        }
      })

      if (!movesAvailable) {
        this.enableTurnButtons()
      } else {
        this.setBoardState("rollComplete");
      }
    },
    
    cloneArray : function(arr) {
      return arr.map((x) => x);
    },

    setDieValue: function(dieName, value) {

      var vt = {
        1:
        [
          [{x:0, y:0}, {x:0.6, y: 0.2, z: 0.2}],
          [{x:2, y:2}, {x:0.7, y: 0.0, z: -0.3}],
        ],
        2: 
        [
          [{x:1, y:0}, {x:0.6, y: 0.5, z: 0}],
          [{x:1, y:1}, {x:0.6, y: 0.5, z: 0}],
          [{x:1, y:2}, {x:0.6, y: 0.5, z: 0}],
          [{x:1, y:3}, {x:0.5, y: 0.5, z: 0}],
        ],
        3: 
        [
          [{x:0, y:3}, {x:0.6, y: 0.2, z: -0.1}],
          [{x:2, y:1}, {x:0.1, y: 0.2, z:0.5}],
        ],
        4: 
        [
          [{x:0, y:1},{x: -0.4, y: 0.5, z: 1.2}],
          [{x:2, y:3}, {x: 0.2, y: -0.2, z: -0.5}]
        ],
        5: 
        [
          [{x:3, y:0}, {x: 0.6, y: 0.6, z: -0.5}],
          [{x:3, y:1}, {x: -0.1, y: 0.5, z: 1}],
          [{x:3, y:2}, {x: 0.6, y: 0.3, z: 0.5}],
          [{x:3, y:3}, {x: 0.1, y: 0.5, z: -0.5}]
        ],
        6: 
        [
          [{x:0, y:2}, {x:0.7, y: -0.25, z: 0.3}],
          [{x:2, y:0}, {x:0.8, y: -0.5, z: 0.5}]
        ]
      };

      var configs = vt[value];
      var config = configs[this.getRandomNumber(0, configs.length-1)];
      var transforms = {x:0,y:0,z:0};
      var vr = config[0];
      var rotation = config[1];

      this.boardData.gameState.t[dieName] = JSON.stringify(vr);
      var sign = (this.boardData.gameState.evenRoll ? -1: 1);

      ['x','y'].forEach(t => {
        transforms[t] = vr[t] + ((this.getRandomNumber(1,2) * 4) * sign);
        if (Math.abs(this.config.previousDieTransform - transforms[t]) < 5) {
          transforms[t] += (4 * sign);
        }
      });

      ['x','y','z'].forEach(t => {
        transforms[t] = transforms[t] + (rotation[t] / 4);
      });

      this.config.previousDieTransform = transforms;
      
      var that = this;
      var timeoutDelay = setTimeout(function() {
        that.$refs[dieName].style.transform = 'rotateX('+ transforms.x * 90 + 'deg) rotateY('+ transforms.y * 90 + 'deg) rotateZ('+ transforms.z * 90 + 'deg)';
        that.boardData.gameState.transforms[dieName] = that.$refs[dieName].style.transform;
        clearTimeout(timeoutDelay);
      }, 10);
        
      var timeout = setTimeout(function (){
        that.boardData.gameState.rollCount++;
        clearTimeout(timeout);
        if (that.boardData.gameState.rollCount == 2) {
          that.showActiveMoves();
        }
      },1200);
    },

    getRandomNumber: function(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    setupBoard: function() {
      let pips = [];
      let i;

      for (i = 0; i < 24; i++) {
        let pip = {
          count: 0,
          playerId: null,
          index: i,
          isActive: false
        }
        pips.push(pip);
      }

      var playerIds = Object.keys(this.boardData.players);

      for (i = 0; i < 24; i++) {
        var count = this.config.initialPips[i];
        if (count) {
          for (var j=0; j < 2; j++) {
            var pip = pips[j==0 ? i : this.mapPipIndex(i, false)];
            pip.count = count;
            pip.playerId = playerIds[j];
          }
        }
      }
      this.boardData.pips = pips;
    },
    mapPipIndex: function(index, fromBottom) {
      return fromBottom ? index : 23 - index;
    },
    setScale: function() {
      var width = window.innerWidth - 80;
      var height = window.innerHeight - 80;
      var scaleWidth = this.boardConfig.size.width / 2 + this.boardConfig.size.margin;
      var scaleByWidth = width / scaleWidth;
      var scaleByHeight = Math.min(height / this.boardConfig.size.height, width / (scaleWidth + 300));
      
      var scale = Math.min(scaleByHeight, scaleByWidth);
      var heightLimited = (scale == scaleByHeight);

      var cloneMap = {left: 'right', right: 'left'};

      Object.keys(this.boardConfig.images).forEach(key => {
        var image = this.boardConfig.images[key];
        var style = {};
        var cloneStyle = {};
        ['width', 'height', 'top', 'bottom', 'right', 'left'].forEach(attr => {
          if (typeof image[attr] == 'number') {
            style[attr] = image[attr] * scale + 'px';
            if (cloneMap[attr]) {
              cloneStyle[cloneMap[attr]] = image[attr] * scale + 'px';
            } else {
              cloneStyle[attr] = image[attr] * scale + 'px';
            }
          }
        })
        if (image.background) {
          style.background = image.background;
          cloneStyle.background = image.background;
        }

        var imageTransform = image.transform ? image.transform : '';
        var cloneImageTransform = imageTransform + (image.cloneTransform ?  " " + image.cloneTransform : '');
        
        this.boardData.boardImages[image.name] = {
          style: style,
          cloneStyle: cloneStyle,
          imageStyle: {transform: imageTransform},
          cloneImageStyle: {transform: cloneImageTransform}
        };  

        //Services.log("imageStyles", this.boardData.boardImages[image.name]);
        
        if (image.writePips) {

          var spacing = this.boardConfig.pipSpacing * scale;
          var pipWidth = (this.boardConfig.mainBoardWidth * scale - (5 * spacing) - (scale * this.boardConfig.combinedPipMargin)) / 6;
          
          this.boardData.stoneStyle = {
            width: this.boardConfig.stoneSize.width * scale + "px",
            height: this.boardConfig.stoneSize.height * scale + "px"
          };
          
          this.boardData.stoneContainerStyle = {
            width: this.boardConfig.stoneContainer.width * scale + "px",
            height: this.boardConfig.stoneContainer.height * scale + "px"
          };

          Object.keys(this.boardConfig.pipBlockLocations).forEach(pos => {

            var leftStart =  this.boardConfig.pipBlockLocations[pos] * scale;
            var directions = pos.indexOf('top') > -1 ? {lr: 'left', tb: 'top'} : {lr: 'right', tb: 'bottom'};
            var styles = [];

            for (var i = 0; i < 6; i++) {
              var x = leftStart + (pipWidth + spacing) * i + 'px';
              
              var style = {
                width: pipWidth + "px"
              };
              style[directions.lr] = x;
              style[directions.tb] = 0;

              styles.push(style);

            }
            this.boardData.pipBlockStyles[pos] = styles;
          });      
        }
       
      });

      this.boardData.leftPanelStyle = { 
        width: this.boardConfig.size.width * scale + 'px',
        height: this.boardConfig.size.height * scale + 'px' 
      };

      var boardWidth = (this.boardConfig.size.width * scale * 2) + this.boardConfig.size.margin * scale;
      this.boardData.outerStyle = {
        width: boardWidth + 'px',
      };

      if (heightLimited) {
        var panelWidth = (width - boardWidth);
        this.boardData.buttonPanelStyle = {
          width: panelWidth + 'px'
        };
        this.dieScale = '0.4px';

      } else {
        //tbd
      }

      this.boardData.rightPanelStyle = Object.assign({}, this.boardData.leftPanelStyle);
      this.boardData.rightPanelStyle['margin-left'] = this.boardConfig.cloneMargin * scale + 'px';
    }
  },
  unmounted() {
    Services.removeListeners(this.eventListeners);
    Services.destroyAll(this.listeners);
  }
};
</script>

<style lang='scss'>
@import "../styles/_colors.scss";
$headerHeight: 0px;
$footerHeight: 0px;
$boardPadding: 40px;

@font-face { 
  font-family: 'dice'; 
	src: url('../assets/fonts/dice.woff2') format('woff2'); 
}

div.appBody {
  position: fixed;
  top: $headerHeight;
  background: linear-gradient(180deg, hsla(0, 12%, 34%, 1) 0%, hsla(0, 15%, 21%, 1) 100%);
  left: 0;
  right: 0;
  bottom: $headerHeight;
  padding: $boardPadding;
  box-sizing: border-box;

  > .boardState {
    color: white;
    font-family: 'Open Sans';
    position: fixed;
    right: 50px;
    bottom: 30px;
    width: 100px;
    text-align: right;
  }

  > div.outerPanel {
    float: right;
    height: 100%;
    display: flex;
    flex-direction: column;

    > .panel {
      padding: 15px;
      height: 140px;
      width: 100%;
      border-radius: 10px;
      box-sizing: border-box;
      background: #e0ffea;
      position: relative;
      flex: none;

      > .diceState {
        padding: 10px;
        float: left;
        width: 270px;
        height: 100%;
        background: #33aa96;
        box-sizing: border-box;
        border-radius: 6px;

        label {
          display: block;
          font-family: 'Open Sans';
          font-size: 18px;
          font-weight: 20px;
          margin-bottom: 10px;
          color: white;
        }

        > .diceValues {
          float: left;
          border-radius: 10px;

          > span {
            font-family: 'dice';
            font-size: 45px;
            width: 50px;
            height: 50px;
            text-align: center;
            display: inline-block;
            border: 1px solid #999999;
            background: white;
            border-radius: 7px;
            padding: 0;
            margin: 0 5px;

            &.used {
              background: #CCCCCC;
              border-color: #555555;
              color: #333333;
            }

            &.blocked {
              background: rgb(163, 29, 29);
              border-color: #555555;
              color: #5e4d4d;
            }
          }
        }
      }

      > .interface {
        position: absolute;
        height: 100%;
        width: 400px;
        top: 20px;
        left: 600px;

        > input, label {
          display: block;
          width: 90%;
          margin-bottom: 10px;
        }
      }

      > .player {
        right: 20px;
        top: 20px;
        font-weight: bold;
        font-size: 20px;
        font-family: 'Open Sans';
        width: 200px;
        text-align: right;
        position: absolute;
      }

      > .buttons {

        right: 20px;
        bottom: 20px;
        position: absolute;

        > button {
          align-self: center;
          background-color: #ce6161;
          border: none;
          color: #ececec;
          font-size: 18px;
          line-height: 20px;
          font-weight: 700;
          padding: 5px 10px;
          border-radius: 6px;
          margin-left: 15px;
          cursor: pointer;

          &:disabled {
            background-color: #777777;
            color: #999999;
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
      button:hover {
        cursor: pointer;
      }
    }

    > .diePanelWrapper {
      flex: 1;

      > .diePanelOuter {

        width: calc(v-bind(dieScale) * 690);
        height: calc(v-bind(dieScale) * 270);
        margin-top: calc((100% - 140px - v-bind(dieScale) * 270) / 2);
        margin-left: calc((100% - v-bind(dieScale) * 690) / 2);

        > div.diePanel {
          width: calc(v-bind(dieScale) * 200);
          height: calc(v-bind(dieScale) * 200);
          float: left;
          position: relative;
          perspective: calc(v-bind(dieScale) * 1000);
          perspective-origin: 150% 150%;
          margin: 0 calc(v-bind(dieScale) * 80) 0  calc(v-bind(dieScale) * 60);

          > .dieContainer {
            width: calc(v-bind(dieScale) * 200);
            height: calc(v-bind(dieScale) * 200);
            position: relative;
            float: left;
            margin: 0 auto calc(v-bind(dieScale) * 40);
            perspective: calc(v-bind(dieScale) * 1000);
            perspective-origin: 100% 100%;

            > .die {
              width: 100%;
              height: 100%;
              top: (calc(v-bind(dieScale) * 50));
              position: absolute;
              transform-style: preserve-3d;
              transition: transform 1.2s ease-out;

              .front {
                transform: 
                  translateZ(calc(v-bind(dieScale) * 100));
              }

              .back {
                transform: 
                  rotateX(-180deg)
                  translateZ(calc(v-bind(dieScale) * 100));
              }

              .right {
                transform:
                  rotateY(90deg)
                  translateZ(calc(v-bind(dieScale) * 100));
              }

              .left {
                transform:
                  rotateY(-90deg)
                  translateZ(calc(v-bind(dieScale) * 100));
              }

              .top {
                transform:
                  rotateX(90deg)
                  translateZ(calc(v-bind(dieScale) * 100));
              }

              .bottom {
                transform:
                  rotateX(-90deg)
                  translateZ(calc(v-bind(dieScale) * 100));
              }

              > div {
                background: hsla(0, 0%, 95%, 0.9);
                display: block;
                position: absolute;
                width: calc(v-bind(dieScale) * 200);
                height: calc(v-bind(dieScale) * 100);
                border: 1px solid #c7c7c7;
                border-radius: 2px;
                
                margin: 0 auto;  
                font-size: 500%;
                text-align: center;
                padding: calc(v-bind(dieScale) * 50) 0;
              }

              .dot {
                display: block;
                position: absolute;
                width: calc(v-bind(dieScale) * 30);
                height: calc(v-bind(dieScale) * 30);
                background: #5e5e5f;
                border-radius: calc(v-bind(dieScale) * 15);  
              }

              .front {
                > .dot1 { 
                  top: calc(v-bind(dieScale) * 85); 
                  left: calc(v-bind(dieScale) * 85);
                }
              }
              .back {
                > .dot1 { 
                  top: calc(v-bind(dieScale) * 35); 
                  left: calc(v-bind(dieScale) * 35); 
                }
                > .dot2 { 
                  top: calc(v-bind(dieScale) * 35); 
                  left: calc(v-bind(dieScale) * 85);
                }
                > .dot3 {
                  top: calc(v-bind(dieScale) * 35);
                  left: calc(v-bind(dieScale) * 135); 
                }
                > .dot4 { 
                  top: calc(v-bind(dieScale) * 135); 
                  left: calc(v-bind(dieScale) * 35);
                }
                > .dot5 {
                  top: calc(v-bind(dieScale) * 135);
                  left: calc(v-bind(dieScale) * 85); 
                }
                > .dot6 {
                  top: calc(v-bind(dieScale) * 135);
                  left: calc(v-bind(dieScale) * 135);
                }
              }
              .right {
                > .dot1 { 
                  top: calc(v-bind(dieScale) * 35);
                  left: calc(v-bind(dieScale) * 35);
                }
                > .dot2 {
                  top: calc(v-bind(dieScale) * 85);
                  left: calc(v-bind(dieScale) * 85);
                }
                >.dot3 {
                  top: calc(v-bind(dieScale) * 135);
                  left: calc(v-bind(dieScale) * 135);
                }
              }
              .left {
                >.dot1 {
                  top: calc(v-bind(dieScale) * 35); 
                  left: calc(v-bind(dieScale) * 35);
                }
                > .dot2 { 
                  top: calc(v-bind(dieScale) * 35);
                  left: calc(v-bind(dieScale) * 135);
                }
                > .dot3 { 
                  top: calc(v-bind(dieScale) * 135);
                  left: calc(v-bind(dieScale) * 35);
                }
                > .dot4 { 
                  top: calc(v-bind(dieScale) * 135); 
                  left: calc(v-bind(dieScale) * 135);
                }
              }
              .top {
                > .dot1 { 
                  top: calc(v-bind(dieScale) * 35); 
                  left: calc(v-bind(dieScale) * 35);
                }
                > .dot2 { 
                  top: calc(v-bind(dieScale) * 35);
                  left: calc(v-bind(dieScale) * 135);
                }
                > .dot3 {
                  top: calc(v-bind(dieScale) * 85);
                  left: calc(v-bind(dieScale) * 85);
                }
                > .dot4 {
                  top: calc(v-bind(dieScale) * 135);
                  left: calc(v-bind(dieScale) * 35);
                }
                >.dot5 { 
                  top: calc(v-bind(dieScale) * 135); 
                  left: calc(v-bind(dieScale) * 135);
                }
              }
              .bottom {
                > .dot1 { 
                  top: calc(v-bind(dieScale) * 35); 
                  left: calc(v-bind(dieScale) * 35); 
                }
                .dot2 { 
                  top: calc(v-bind(dieScale) * 135); 
                  left: calc(v-bind(dieScale) * 135);
                }
              }
            }
          }
        }
      }

      div.diePanel + div.diePanel > .dieContainer {
        perspective-origin: 0 100%;
      }
    }
  }

  div.board {
    display: block;
    float: left;

    // div, span {
    //   user-select: none;
    // }

    .stones {
      position: absolute;
      top: 0;

      .stone {
       
        position: relative;
        left: -8%;
        > img {
          position:absolute;
        }

        &.dragStone {

          user-select: all !important;

          &::after {
            content: '';
            height: 40%;
            width: 40%;
            background: cyan;
            opacity: 0.3;
            border-radius: 50%;
            top: 26%;
            left: 32%;
            position: absolute;
            display: block;
          }
        }
      }
    }
    
    > div {
      position: relative;
      float: left;

      > div > span {
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        top: 0; 
        left: 0;

        > span {
          position: absolute;
          display: block;
          margin-left: 30px;
          width: calc(100% - 60px);
          box-sizing: border-box;
          color: red;
         
        }
      }

      > div {
        position: absolute;

        > img {
          width: 100%;
          height: 100%;
          user-select: none;
        }
 
        > .imageContainer {
          width: 100%;
          height: 100%;
          position: relative;

          > img {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
          }

          span {
            position: absolute;
            top: 10px;
            left: 10px;
            display: block;
            background: red;
            width: 30px;
            color: white;
            text-align: center;
          }

          > .pips {
            height: 50%;
            width: 100%;
            top: 0;
            position: absolute;
            user-select: none;
            box-sizing: border-box;

            > .pipWrapper {
              height: 100%;
              width: 100%;
              position: relative;
              user-select: none;
          
              > .pipBar {
                position: absolute;
                height: 100%;

                > .pipBarWrapper {
                  height: 100%;
                  position: relative;
                  box-sizing: border-box;

                  > .stonesWrapper {
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    position: absolute;
                    box-sizing: border-box;

                    > .stonesInnerWrapper {
                      position: relative;
                      width: 100%;
                      height: 100%;
                      box-sizing: border-box;
                      top: 0;
                      left: 0;
                  
                      // .stoneLayer0 {
                      //   position: absolute;
                      //   top: 0;
                      //   left: 0;
                      //   width: 100%;
                      //   height: 100%;
                      //   background: pink;
                      // }
                    }
                  }

                  > img { 
                    width: 100%;
                    position: absolute;
                  }
                  > .markDropZone {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: #1ca756;
                    opacity: 0.2;
                    width: 100%;
                    height: 85%;
                  }
                  > .dropZone {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }

            &:first-of-type {
              > .pipWrapper {
                > .pipBar {
                  > .pipBarWrapper {
                    > img {
                      transform: rotate(180deg);
                    }

                    > .stonesWrapper > .stonesInnerWrapper > .stones {

                      > .stoneLayer0, > .stoneLayer1, > .stoneLayer2 {

                        > .stone {

                          &.dragStone::after {
                            top: 23%;
                          }
                         
                          > img {
                            top: -10%;
                          }
                        }
                      }
                    }

                    > .markDropZone { 
                      border-bottom-left-radius: 14px;
                      border-bottom-right-radius: 14px;
                    }
                    
                  }
                }
              }
            }

            &:last-of-type {
              top: 50%;
              > .pipWrapper {
                > .pipBar  {
                  > .pipBarWrapper  {
                    position: relative;

                    > span {
                      top: auto;
                      bottom: 10px;
                    }

                    > .stonesWrapper > .stonesInnerWrapper > .stones {
                      height: 100%;
                      width: 100%;

                      > .stoneLayer0, > .stoneLayer1, > .stoneLayer2 {
                        display: flex;
                        flex-flow: column;
                        top: auto;
                        bottom: -2%;

                        > .stone {
                          flex: none;
                          > img {
                            top: -7%;
                          }
                        }
                      }
                    }
                    > img {
                      position: absolute;
                      left: 0;
                      bottom: 0;
                    }

                    > .markDropZone { 
                      bottom: 0;
                      top: auto;
                      border-top-left-radius: 14px;
                      border-top-right-radius: 14px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .transparent{ opacity: 0.5}
  div.board.inDrag  .stones .stone.dragStone::after {
    display: none;
  }
}

//@import "../generatedStyles/Board.scss";

</style>