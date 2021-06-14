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
      swapOriginPosition: [0, 0],
      swapDestinationPosition: [0, 0],
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
    },
    setMemberPosition(column, cordon, firstName) {
      if (!firstName) {
        return;
      }
      for (let i = 0; i < this.positionsMembers.length; i++) {
        // Remove member in position if there is a member
        if (
          this.positionsMembers[i].column === column &&
          this.positionsMembers[i].cordon === cordon
        ) {
          this.positionsMembers.splice(i, 1);
        }
        // Remove member if it is present in the list
        else if (this.positionsMembers[i].name === firstName) {
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
    getElementBycoordinates(paper, coordinatesArray) {
      return paper.getElementByPoint(coordinatesArray[0], coordinatesArray[1]);
    },
    swapMemberPositions(
      originColumn,
      originCordon,
      destinationColumn,
      destinationCordon
    ) {
      // find who is at origin
      let originName;
      let destinationName;
      for (let i = 0; i < this.positionsMembers.length; i++) {
        if (
          this.positionsMembers[i].column === originColumn &&
          this.positionsMembers[i].cordon === originCordon
        ) {
          originName = this.positionsMembers[i].name;
        }
        if (
          this.positionsMembers[i].column === destinationColumn &&
          this.positionsMembers[i].cordon === destinationCordon
        ) {
          destinationName = this.positionsMembers[i].name;
        }
      }
      this.setMemberPosition(destinationColumn, destinationCordon, originName);
      this.setMemberPosition(originColumn, originCordon, destinationName);
    },
    drawTronc() {
      const self = this;

      this.paperTronc.clear(); // Clear the canvas before starting

      const width = this.castellWidth;
      const height = this.castellHeight - 3; // pom = 3

      const realWidth = Math.min(
        document.getElementById("canvas_tronc").offsetWidth,
        350
      );

      const posW = realWidth / (width * 1.25); // width of a cell
      const posH = posW * 2; // height of a cell

      // Resize canvas for the current castell
      this.paperTronc.setSize(width * posW * 1.25, height * posH * 1.125);

      let h, w;
      for (h = 0; h < height; h++) {
        for (w = 0; w < width; w++) {
          const color = "gray";

          const posGroup = this.paperTronc.set(); // Group a cell and its text

          // draw cell and add to group
          const rect = this.paperTronc
            .rect(
              posW / 8 + posW * 1.25 * w,
              posH / 16 + posH * 1.125 * h,
              posW,
              posH,
              5
            )
            .attr({ fill: color, opacity: 0.3 });
          posGroup.push(rect);

          // Add a few attributes to the group
          posGroup.data("name", "");
          posGroup.data("column", w + 1);
          posGroup.data("cordon", height - h);

          // Write each position to the right cell
          for (let i = 0; i < this.positionsMembers.length; i++) {
            // Write if current position matches current cell
            if (
              this.positionsMembers[i].column === w + 1 &&
              this.positionsMembers[i].cordon === height - h
            ) {
              // Write text and add to group
              const name = this.paperTronc
                .text(
                  posW / 8 + posW * 1.25 * w + posW / 2,
                  posH / 16 + posH * 1.125 * h + posH / 2,
                  self.positionsMembers[i].name
                )
                .attr({ fill: "#000000" })
                .transform("R270s2")
                .toBack();
              posGroup.push(name);
              posGroup.data("name", self.positionsMembers[i].name); // Set name if there is someone in this position
            }
          }
          posGroup
            .click(
              (function (w, h) {
                return function () {
                  self.setMemberPosition(w, h, self.selectedMember);
                };
              })(w + 1, height - h)
            )
            .drag(
              function (dx, dy, x, y) {
                self.swapOriginPosition = [0, 0];
                self.swapDestinationPosition = [0, 0];
                if (Math.abs(dx) + Math.abs(dy) > 10) {
                  self.swapOriginPosition = [x - dx, y - dy];
                  self.swapDestinationPosition = [x, y];
                }
              },
              function () {},
              function () {
                const originEl = self.getElementBycoordinates(
                  self.paperTronc,
                  self.swapOriginPosition
                );
                const destinationEl = self.getElementBycoordinates(
                  self.paperTronc,
                  self.swapDestinationPosition
                );
                if (
                  originEl &&
                  destinationEl &&
                  originEl.id !== destinationEl.id
                ) {
                  self.swapMemberPositions(
                    originEl.data("column"),
                    originEl.data("cordon"),
                    destinationEl.data("column"),
                    destinationEl.data("cordon")
                  );
                }
                self.swapOriginPosition = [0, 0];
                self.swapDestinationPosition = [0, 0];
              }
            );
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
