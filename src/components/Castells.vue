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
    pomHeight: function () {
      let h = 0;
      if (this.castell.type) {
        h = this.castell.type.split("d")[0] === "1" ? 0 : 3;
      }
      return h;
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
      dragging: false,
    };
  },
  mounted() {
    this.$store.dispatch("members/getMembers");
    this.paperTronc = new Raphael(document.getElementById("canvas_tronc"));
    this.positionsMembers = this.castell.positions;
    this.drawTronc();
  },
  methods: {
    ...mapActions({
      getMembers: "members/getMembers",
    }),
    selectMember(uuid) {
      this.selectedMemberUuid = uuid;
    },
    setMemberPosition(column, cordon, position, uuid) {
      if (!uuid) {
        return;
      }
      for (let i = 0; i < this.positionsMembers.length; i++) {
        // Remove member in position if there is a member
        if (
          this.positionsMembers[i].column === column &&
          this.positionsMembers[i].cordon === cordon &&
          this.positionsMembers[i].position === position
        ) {
          this.positionsMembers.splice(i, 1);
          i = i - 1;
        }
        // Remove member if it is present in the list
        else if (this.positionsMembers[i].uuid === uuid) {
          this.positionsMembers.splice(i, 1);
          i = i - 1;
        }
      }
      // Add member in list of positions
      this.positionsMembers.push({
        cordon: cordon,
        column: column,
        position: position,
        uuid: uuid,
      });
      // redraw the tronc
      this.drawTronc();
    },
    getElementBycoordinates(paper, coordinatesArray) {
      return paper.getElementByPoint(
        coordinatesArray[0] - document.body.scrollLeft,
        coordinatesArray[1] - document.body.scrollTop
      );
    },
    swapMemberPositions(
      originColumn,
      originCordon,
      originPosition,
      destinationColumn,
      destinationCordon,
      destinationPosition
    ) {
      let originUuid;
      let destinationUuid;
      for (let i = 0; i < this.positionsMembers.length; i++) {
        // Member at origin
        if (
          this.positionsMembers[i].column === originColumn &&
          this.positionsMembers[i].cordon === originCordon
        ) {
          originUuid = this.positionsMembers[i].uuid;
        }
        // Member at destination
        if (
          this.positionsMembers[i].column === destinationColumn &&
          this.positionsMembers[i].cordon === destinationCordon
        ) {
          destinationUuid = this.positionsMembers[i].uuid;
        }
      }
      this.setMemberPosition(
        destinationColumn,
        destinationCordon,
        destinationPosition,
        originUuid
      );
      this.setMemberPosition(
        originColumn,
        originCordon,
        originPosition,
        destinationUuid
      );
    },
    drawTronc() {
      const self = this;

      this.paperTronc.clear(); // Clear the canvas before starting

      const allCells = this.paperTronc.set();

      // const width = this.castellWidth;
      const troncHeight = this.castellHeight - this.pomHeight;

      const l = 150; // short side of rectangle
      const s = l / 2; // long side of rectangle
      const spacing = 10;

      const canvasWidth =
        this.castellWidth * s + (this.castellWidth - 1) * spacing;
      const canvasTroncHeight = troncHeight * (l + spacing);
      const canvasPomHeight =
        (this.pomHeight > 0 ? 1 : 0) * 2 * (s + spacing) +
        (this.pomHeight > 0 ? 1 : 0) * (l + spacing);

      const defaultColor = "gray";

      // Resize canvas for the current castell
      this.paperTronc.setSize(canvasWidth, canvasTroncHeight + canvasPomHeight);

      let h;
      let w = 1;

      // This part draws the pom
      for (h = 0; h < this.pomHeight; h++) {
        let posGroup;
        let rect;
        if (h < 2) {
          posGroup = this.paperTronc.set();
          rect = this.paperTronc
            .rect((canvasWidth - l) / 2, (s + spacing) * h, l, s, 5)
            .attr({ fill: defaultColor, opacity: 0.3 });
          posGroup.push(rect);
          posGroup.data("column", 1);
          posGroup.data("cordon", this.pomHeight - h);
          posGroup.data("position", "pom");
          allCells.push(posGroup);
        } else {
          for (w = 0; w < 2; w++) {
            posGroup = this.paperTronc.set();
            rect = this.paperTronc
              .rect(
                canvasWidth / 2 - spacing / 2 - s + w * (s + spacing),
                (s + spacing) * h,
                s,
                l,
                5
              )
              .attr({ fill: defaultColor, opacity: 0.3 });
            posGroup.push(rect);
            posGroup.data("column", w + 1);
            posGroup.data("cordon", this.pomHeight - h);
            posGroup.data("position", "pom");
            allCells.push(posGroup);
          }
        }
      }

      // This part draws the tronc
      for (h = 0; h < troncHeight; h++) {
        for (w = 0; w < this.castellWidth; w++) {
          const posGroup = this.paperTronc.set(); // Group a cell and its text
          // draw cell and add to group
          const rect = this.paperTronc
            .rect(
              (s + spacing) * w,
              canvasPomHeight + (l + spacing) * h,
              s,
              l,
              5
            )
            .attr({
              fill: defaultColor,
              opacity: 0.3,
            });
          posGroup.push(rect);
          // Add attributes representing the position in the castell
          posGroup.data("column", w + 1);
          posGroup.data("cordon", troncHeight - h);
          posGroup.data("position", "tronc");

          allCells.push(posGroup);
        }
      }

      // Write names where necessary
      allCells.forEach(function (cell) {
        const rect = cell[0]; // data is set on the set but only accessible in the rectangle
        // For each cell we will see if someone is assigned
        for (let i = 0; i < self.positionsMembers.length; i++) {
          // Write if current position matches current cell
          if (
            self.positionsMembers[i].column === rect.data("column") &&
            self.positionsMembers[i].cordon === rect.data("cordon") &&
            self.positionsMembers[i].position === rect.data("position") &&
            self.allMembers[self.positionsMembers[i].uuid]
          ) {
            const bbox = rect.getBBox();
            const vertical = bbox.width < bbox.height;
            // Write text and add to group
            const name = self.paperTronc
              .text(
                bbox.x + (vertical ? s / 2 : l / 2),
                bbox.y + (vertical ? l / 2 : s / 2),
                [
                  self.allMembers[self.positionsMembers[i].uuid].firstName,
                  self.allMembers[self.positionsMembers[i].uuid].lastName[0] +
                    ".",
                ].join(" ")
              )
              .attr({ fill: "#000000" })
              .transform(vertical ? "R270s2" : "R0s2")
              .toBack();
            cell.push(name);
          }
        }
      });

      // Attach events
      allCells.forEach(function (cell) {
        const rect = cell[0];
        cell
          .mouseup(function () {
            if (!self.dragging) {
              self.setMemberPosition(
                rect.data("column"),
                rect.data("cordon"),
                rect.data("position"),
                self.selectedMemberUuid
              );
            }
          })
          .touchend(function () {
            if (!self.dragging) {
              self.setMemberPosition(
                rect.data("column"),
                rect.data("cordon"),
                rect.data("position"),
                self.selectedMemberUuid
              );
            }
          })
          .drag(
            function (dx, dy, mx, my) {
              if (Math.abs(dx) + Math.abs(dy) > 10) {
                self.dragging = true;
                this.data("origin", [mx - dx, my - dy]);
                this.data("destination", [mx, my]);
              }
            },
            function () {
              this.data("origin", [0, 0]).data("destination", [0, 0]);
            },
            function () {
              const originEl = self.getElementBycoordinates(
                self.paperTronc,
                this.data("origin")
              );
              const destinationEl = self.getElementBycoordinates(
                self.paperTronc,
                this.data("destination")
              );
              if (
                originEl &&
                destinationEl &&
                originEl.id !== destinationEl.id
              ) {
                self.swapMemberPositions(
                  originEl.data("column"),
                  originEl.data("cordon"),
                  originEl.data("position"),
                  destinationEl.data("column"),
                  destinationEl.data("cordon"),
                  destinationEl.data("position")
                );
                self.dragging = false;
              }
            }
          );
      });
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
