<template>
  <ul :class="css_class">
    <li v-for="item in items" :key="item.id" :class="item.cssClass">
      <template v-if="item.isLeaf" :id="item.id" >
        <div class="selectionItem probe" v-on:click="clickAction(item)">
          <icon-phone/>
          <label>{{ item.label }}</label>
          <span class="selector hoverParent">
            <input type="checkbox" v-model="item.checked"/>
          </span>
        </div>
      </template>
      <template v-if="item.children">
        <span>{{item.label}}</span> 
        <div class="buttons">
          <button v-if="item.children.length > 1" v-on:click="selectChildren(item.children, false, group_index)" class="iconButton"><button-x/></button>
          <button v-if="item.children.length > 1" v-on:click="selectChildren(item.children, true, group_index)" class="iconButton"><button-check/></button>
        </div>
        <recursive-render :items="item.children" :action="action" :group_index="group_index" />
      </template>
    </li>
  </ul>
</template>

<script>
import RecursiveRender from "./RecursiveRender.vue";
import Services from '../services/Services.js';
import ButtonCheck from '../icons/ButtonCheck.vue';
import IconPhone from '../icons/IconPhone.vue';
import ButtonX from '../icons/ButtonX.vue';

export default {
  name: 'RecursiveRender',
  components: {
    RecursiveRender,
    ButtonCheck,
    ButtonX, 
    IconPhone
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: 'click'
    },
    group_index: {
      type: String,
      default: ""
    },
    css_class: {
      type: String,
      default: null
    }
  }, 
  methods: {
    clickAction: function(item) {
      item.checked = !item.checked;
      Services.action(this.action, {item: item, groupIndex: this.group_index});
    }, 
    selectChildren: function(children, check, groupIndex) {
      children.forEach(item => {
        if (item.isLeaf) {
          if (item.checked != check) {
            item.checked = check;
            Services.action(this.action, {item: item, groupIndex: groupIndex});
          }
        } else {
          this.selectChildren(item.children, check, groupIndex);
        }
      });
    }
  }
};
</script>



 