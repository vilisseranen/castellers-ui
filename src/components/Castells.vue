<template>
  <div>
    <p class="title is-5">{{ this.castell.name }}</p>
    <div class="columns is-multiline">
      <div class="column is-6" id="canvas_tronc" style="padding: 0"></div>
      <div class="column is-3" style="border: solid 1px">
        <h1 class="subtitle is-3">Membres Disponibles</h1>
        <p
          v-for="uuid in availableMembersIDs"
          v-bind:key="uuid"
          v-on:click="selectMember(uuid)"
        >
          {{ allMembers[uuid].firstName }}
        </p>
        <strong>{{ selectedMemberFirstName }}</strong>
        <p>{{ positionsMembers }}</p>
      </div>
      <div class="column is-3" style="border: solid 1px">
        <h1 class="subtitle is-3">Membres dans le castell</h1>
        <p v-for="uuid in selectedMembersIDs" v-bind:key="uuid">
          {{ allMembers[uuid].firstName }}
        </p>
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
    selectedMemberFirstName: function () {
      if (this.selectedMemberUuid) {
        return this.allMembers[this.selectedMemberUuid].firstName;
      } else {
        return "";
      }
    },
    allMembers: function () {
      const members = {};
      for (let i = 0; i < this.members.length; i++) {
        members[this.members[i].uuid] = this.members[i];
      }
      return members;
    },
    selectedMembersIDs: function () {
      const membersIDs = [];
      for (let i = 0; i < this.positionsMembers.length; i++) {
        membersIDs.push(this.positionsMembers[i].uuid);
      }
      return membersIDs;
    },
    availableMembersIDs: function () {
      return Object.keys(this.allMembers).filter(
        (x) => !this.selectedMembersIDs.includes(x)
      );
    },
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
      selectedMemberUuid: "",
      positionsMembers: [],
      swapOriginPosition: [0, 0],
      swapDestinationPosition: [0, 0],
    };
  },
  mounted() {
    this.paperTronc = new Raphael(document.getElementById("canvas_tronc"));
    this.$store.dispatch("members/getMembers");
    this.drawTronc();
    this.positionsMembers = this.castell.positions;
  },
  methods: {
    ...mapActions({
      getMembers: "members/getMembers",
    }),
    selectMember(uuid) {
      this.selectedMemberUuid = uuid;
    },
    setMemberPosition(column, cordon, uuid) {
      if (!uuid) {
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
        else if (this.positionsMembers[i].uuid === uuid) {
          this.positionsMembers.splice(i, 1);
        }
      }
      // Add member in list of positions
      this.positionsMembers.push({
        cordon: cordon,
        column: column,
        uuid: uuid,
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
      let originUuid;
      let destinationUuid;
      for (let i = 0; i < this.positionsMembers.length; i++) {
        if (
          this.positionsMembers[i].column === originColumn &&
          this.positionsMembers[i].cordon === originCordon
        ) {
          originUuid = this.positionsMembers[i].uuid;
        }
        if (
          this.positionsMembers[i].column === destinationColumn &&
          this.positionsMembers[i].cordon === destinationCordon
        ) {
          destinationUuid = this.positionsMembers[i].uuid;
        }
      }
      this.setMemberPosition(destinationColumn, destinationCordon, originUuid);
      this.setMemberPosition(originColumn, originCordon, destinationUuid);
      this.swapOriginPosition = [0, 0];
      this.swapDestinationPosition = [0, 0];
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

      const posW = realWidth / (width + (width - 1) / 4); // width of a cell (1/4 is the space between cells)
      const posH = posW * 2; // height of a cell

      // Resize canvas for the current castell
      this.paperTronc.setSize(realWidth, height * posH * 1.125);

      let h, w;
      for (h = 0; h < height; h++) {
        for (w = 0; w < width; w++) {
          const color = "gray";

          const posGroup = this.paperTronc.set(); // Group a cell and its text

          // draw cell and add to group
          const rect = this.paperTronc
            .rect(posW * 1.25 * w, posH * 1.125 * h, posW, posH, 5)
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
                  self.allMembers[self.positionsMembers[i].uuid].firstName
                )
                .attr({ fill: "#000000" })
                .transform("R270s2")
                .toBack();
              posGroup.push(name);
              posGroup.data("name", self.positionsMembers[i].name); // Set name if there is someone in this position
            }
          }
          posGroup
            .mouseup(
              (function (w, h) {
                return function () {
                  self.setMemberPosition(w, h, self.selectedMemberUuid);
                };
              })(w + 1, height - h)
            )
            .drag(
              function (dx, dy, mx, my) {
                self.swapOriginPosition = [0, 0];
                self.swapDestinationPosition = [0, 0];

                // TODO improve that part
                if (Math.abs(dx) + Math.abs(dy) > 10) {
                  self.swapOriginPosition = [
                    mx - dx,
                    my - dy - document.body.scrollTop,
                  ];
                  self.swapDestinationPosition = [
                    mx,
                    my - document.body.scrollTop,
                  ];
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
