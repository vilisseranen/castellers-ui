<template>
  <div>
    <p class="title is-5">{{ this.castell.name }}</p>
    <div class="columns is-multiline">
      <div
        class="column is-6"
        id="canvas_tronc"
        style="border: solid 1px"
      ></div>
      <div class="column is-6" style="border: solid 1px">
        <p
          v-for="member in members"
          v-bind:key="member.id"
          v-on:click="selectMember(member.firstName)"
        >
          {{ member.firstName }}
        </p>
        <strong>{{ selectedMember }}</strong>
        <p>{{ this.positionsMembers }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Raphael from "raphael";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    castell: Object,
  },
  computed: {
    castellHeight: function () {
      let h = 0;
      if (this.castell.type) {
        h = parseInt(this.castell.type.split("d")[1]);
      }
      return h;
    },
    castellWidth: function () {
      let w;
      if (this.castell.type) {
        w = parseInt(this.castell.type.split("d")[0]);
      }
      return w;
    },
    ...mapState({
      members: (state) => state.members.members,
    }),
  },
  data() {
    return {
      paperTronc: null,
      selectedMember: "",
      positionsMembers: [],
    };
  },
  mounted() {
    this.paperTronc = new Raphael(document.getElementById("canvas_tronc"));
    this.$store.dispatch("members/getMembers");
    this.drawTronc();
  },
  methods: {
    ...mapActions({
      getMembers: "members/getMembers",
    }),
    selectMember(firstName) {
      this.selectedMember = firstName;
      console.log(this.selectedMember);
    },
    setMemberPosition(column, cordon, firstName) {
      // Remove if position already in list
      for (let i = 0; i < this.positionsMembers.length; i++) {
        if (
          this.positionsMembers[i].column === column &&
          this.positionsMembers[i].cordon === cordon
        ) {
          this.positionsMembers.splice(i, 1);
        }
      }
      for (let i = 0; i < this.positionsMembers.length; i++) {
        if (this.positionsMembers[i].name === firstName) {
          this.positionsMembers.splice(i, 1);
        }
      }
      // Add member in list of positions
      this.positionsMembers.push({
        cordon: cordon,
        column: column,
        name: firstName,
      });
      // redraw the tronc
      this.drawTronc();
    },
    drawTronc() {
      const self = this;

      this.paperTronc.clear();

      const width = this.castellWidth;
      const height = this.castellHeight - 3; // pom = 3

      const realWidth = Math.min(
        document.getElementById("canvas_tronc").offsetWidth,
        350
      );

      const posW = realWidth / (width * 1.25);
      const posH = posW * 2;

      // Resize canvas for the current castell
      this.paperTronc.setSize(width * posW * 1.25, height * posH * 1.125);

      // const positionsCanvas = []; // To attach click events
      // const positionsMembers = [];

      let h, w;
      for (h = 0; h < height; h++) {
        // positionsCanvas[h] = [];
        for (w = 0; w < width; w++) {
          const color = "gray";
          // if (members[h][w].present === "yes") {
          //   color = "green";
          // } else {
          //   if (members[h][w].registered === "yes") {
          //     color = "yellow";
          //   } else {
          //     color = "red";
          //   }
          // }
          // positionsCanvas[h].push(

          this.paperTronc
            .rect(
              posW / 8 + posW * 1.25 * w,
              posH / 16 + posH * 1.125 * h,
              posW,
              posH
            )
            .attr({ fill: color })
            .click(
              (function (w, h) {
                return function () {
                  self.setMemberPosition(w, h, self.selectedMember);
                };
              })(w + 1, height - h)
            );
          // );

          // if position in positionsMembers, write it
          for (let i = 0; i < this.positionsMembers.length; i++) {
            if (
              this.positionsMembers[i].column === w + 1 &&
              this.positionsMembers[i].cordon === height - h
            ) {
              this.paperTronc
                .text(
                  posW / 8 + posW * 1.25 * w + posW / 2,
                  posH / 16 + posH * 1.125 * h + posH / 2,
                  self.positionsMembers[i].name
                )
                .attr({ fill: "#000000" })
                .transform("R270s2");
              console.log(self.positionsMembers[i].name);
            }
          }
        }
      }
    },
  },
  watch: {
    castell: function () {
      this.drawTronc();
    },
    "castell.type": function () {
      this.drawTronc();
    },
  },
};
</script>
