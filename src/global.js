import { reactive, readonly } from "vue";

const state = reactive({
  responsiveMode: false,
  currentWidth: 2400
});

function resizer() {
  state.responsiveMode = window.innerWidth < 1600;
  var body = document.getElementsByTagName("body")[0];

  // var groupByFooter;
  // var probesPopup;
  // var x = {}, y = {};

  if (state.responsiveMode) {
    // probesPopup = document.getElementById('probesPopup');
    // groupByFooter = document.getElementById('groupByFooter');

    // if (probesPopup) {
    //   y = {
    //     gbf: window.getComputedStyle(groupByFooter),
    //     pp: window.getComputedStyle(probesPopup)
    //   };
    // }

    body.classList.add("fixedSize");
    
    // if (probesPopup) {
    //   var timeout1 = setTimeout(function () {
    //     x = {
    //       gbf: window.getComputedStyle(groupByFooter),
    //       pp: window.getComputedStyle(probesPopup)
    //     };
    //     console.log("vw: " + JSON.stringify(y, null, '  '));
    //     console.log("fixedSize: " + JSON.stringify(x, null, '  '));
    //     clearTimeout(timeout1);
    //   }, 100);
    // }
  } else {
    body.classList.remove("fixedSize");
  }
}
window.addEventListener("resize", resizer);
resizer();

export default { state: readonly(state) };