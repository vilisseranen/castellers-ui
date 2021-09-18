<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-3">
        <h1 class="subtitle is-3">{{ $t("castells.available_members") }}</h1>
        <p
          v-for="member in availableMembers"
          v-bind:key="member.uuid"
          v-on:click="selectMember(member.uuid)"
          v-bind:class="{
            'has-text-success': isPresent(member.uuid),
            'has-text-danger': !isPresent(member.uuid),
          }"
        >
          <!-- if member in cas -->
          {{ member.firstName }} {{ member.lastName }}
        </p>
      </div>
      <div class="column is-3">
        <div class="columns is-multiline">
          <div class="column is-12">
            <h1 class="subtitle is-3">
              {{ $t("castells.selected_member") }}
            </h1>
            <strong>{{ selectedMemberName }}</strong>
          </div>
          <div class="column is-12">
            <h1 class="subtitle is-3">
              {{ $t("castells.selected_members") }}
              <small v-on:click="resetPositions()">
                ({{ $t("castells.remove_all") }})
              </small>
            </h1>

            <p
              v-for="member in selectedMembers"
              v-bind:key="member.uuid"
              v-on:click="selectMember(member.uuid)"
              v-bind:class="{
                'has-text-success': isPresent(member.uuid),
                'has-text-danger': !isPresent(member.uuid),
              }"
            >
              {{ member.firstName }} {{ member.lastName }}
            </p>
          </div>
        </div>
      </div>
      <div class="column is-6" id="canvas_tronc" style="padding: 0"></div>
    </div>
  </div>
</template>

<script>
import Raphael from "raphael";
import { mapActions, mapGetters, mapState } from "vuex";

export default {
  props: {
    castell: Object,
  },
  computed: {
    selectedMemberName: function () {
      if (this.selectedMemberUuid) {
        return [
          this.allMembers[this.selectedMemberUuid].firstName,
          this.allMembers[this.selectedMemberUuid].lastName,
        ].join(" ");
      } else {
        return "-";
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
        if (this.allMembers[this.positionsMembers[i].member_uuid]) {
          membersIDs.push(this.positionsMembers[i].member_uuid);
        }
      }
      return membersIDs;
    },
    availableMembers: function () {
      const allMembers = [...this.members].filter(
        (x) => !this.selectedMembersIDs.includes(x.uuid)
      );
      const availableMembers = allMembers.sort(function (a, b) {
        if (a.firstName.toUpperCase() < b.firstName.toUpperCase()) {
          return -1;
        }
        if (a.firstName.toUpperCase() > b.firstName.toUpperCase()) {
          return 1;
        }
        return 0;
      });
      return availableMembers;
    },
    selectedMembers: function () {
      const allMembers = [...this.members].filter((x) =>
        this.selectedMembersIDs.includes(x.uuid)
      );
      const availableMembers = allMembers.sort(function (a, b) {
        if (a.firstName.toUpperCase() < b.firstName.toUpperCase()) {
          return -1;
        }
        if (a.firstName.toUpperCase() > b.firstName.toUpperCase()) {
          return 1;
        }
        return 0;
      });
      return availableMembers;
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
    ...mapGetters(["uuid"]),
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
  },
  methods: {
    ...mapActions({
      getMembers: "members/getMembers",
    }),
    selectMember(uuid) {
      this.selectedMemberUuid = uuid;
    },
    resetPositions() {
      this.positionsMembers = [];
      this.drawTronc();
    },
    removePositionsOutsideCastell() {
      if (!this.castell.positions) {
        return;
      }
      for (let i = 0; i < this.positionsMembers.length; i++) {
        let remove = true;
        for (const position of this.castell.positions) {
          if (
            position.column === this.positionsMembers[i].position.column &&
            position.cordon === this.positionsMembers[i].position.cordon &&
            position.name === this.positionsMembers[i].position.name &&
            position.part === this.positionsMembers[i].position.part
          ) {
            remove = false;
          }
        }
        if (remove) {
          this.positionsMembers.splice(i, 1);
          i = i - 1;
        }
      }
    },
    setMemberPosition(column, cordon, part, name, uuid) {
      if (!uuid) {
        return;
      }
      for (let i = 0; i < this.positionsMembers.length; i++) {
        // Remove member in position if there is a member
        if (
          this.positionsMembers[i].position.column === column &&
          this.positionsMembers[i].position.cordon === cordon &&
          this.positionsMembers[i].position.part === part &&
          this.positionsMembers[i].position.name === name
        ) {
          this.positionsMembers.splice(i, 1);
          i = i - 1;
        }
        // Remove member if it is present in the list
        else if (this.positionsMembers[i].member_uuid === uuid) {
          this.positionsMembers.splice(i, 1);
          i = i - 1;
        }
      }
      // Add member in list of positions
      this.positionsMembers.push({
        member_uuid: uuid,
        position: {
          cordon: cordon,
          column: column,
          part: part,
          name: name,
        },
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
      originPart,
      originName,
      destinationColumn,
      destinationCordon,
      destinationPart,
      destinationName
    ) {
      let originUuid;
      let destinationUuid;
      for (let i = 0; i < this.positionsMembers.length; i++) {
        // Member at origin
        if (
          this.positionsMembers[i].position.column === originColumn &&
          this.positionsMembers[i].position.cordon === originCordon &&
          this.positionsMembers[i].position.part === originPart &&
          this.positionsMembers[i].position.name === originName
        ) {
          originUuid = this.positionsMembers[i].member_uuid;
        }
        // Member at destination
        if (
          this.positionsMembers[i].position.column === destinationColumn &&
          this.positionsMembers[i].position.cordon === destinationCordon &&
          this.positionsMembers[i].position.part === destinationPart &&
          this.positionsMembers[i].position.name === destinationName
        ) {
          destinationUuid = this.positionsMembers[i].member_uuid;
        }
      }
      this.setMemberPosition(
        destinationColumn,
        destinationCordon,
        destinationPart,
        destinationName,
        originUuid
      );
      this.setMemberPosition(
        originColumn,
        originCordon,
        originPart,
        originName,
        destinationUuid
      );
    },
    drawTronc() {
      if (!this.castell.positions) {
        return;
      }
      const self = this;

      this.paperTronc.clear(); // Clear the canvas before starting

      const allCells = this.paperTronc.set();

      // const width = this.castellWidth;
      const troncHeight = this.castellHeight - this.pomHeight;

      // Define size of cells
      const area = document.getElementById("canvas_tronc");
      const areaW = area.clientWidth;
      const l = Math.min(100, areaW / this.castellWidth); // long side of the rectangle. 100 or less if we don't have enough space
      const s = l / 2; // short side of rectangle
      const spacing = l / 10;

      const canvasWidth = this.castellWidth * l;
      const canvasTroncHeight = troncHeight * (l + spacing) - spacing;
      const canvasPomHeight =
        (this.pomHeight > 0 ? 1 : 0) * (2 * (s + spacing) + l + spacing);

      const defaultColor = "gray";

      // Resize canvas for the current castell
      this.paperTronc.setSize(canvasWidth, canvasTroncHeight + canvasPomHeight);

      // We draw the tronc in a grid pattern.
      // For each position of the castell, we draw the cell at (column,cordon)
      let posGroup;
      let rect;
      for (const position of this.castell.positions) {
        posGroup = self.paperTronc.set();
        let x, y;
        let dx = s;
        let dy = l;
        if (position.part === "tronc") {
          // calculate x, y tronc (with Y offset for the pom)
          x =
            ((position.column - 1) * canvasWidth) / self.castellWidth +
            (l - s) / 2;
          y = (troncHeight - position.cordon) * (l + spacing) + canvasPomHeight;
        } else if (position.part === "pom") {
          // calculate x, y pom
          if (position.cordon === 1) {
            // dosos (vertical)
            x =
              ((position.column - 1) * canvasWidth) / self.castellWidth +
              (l - s) / 2;
            y = (self.pomHeight - position.cordon) * (s + spacing);
          } else {
            // acotxador and enxaneta (horizontal)
            x = ((position.column - 1) * canvasWidth) / self.castellWidth;
            y = (self.pomHeight - position.cordon) * (s + spacing);
            dx = l;
            dy = s;
          }
        }
        rect = self.paperTronc
          .rect(x, y, dx, dy, 5)
          .attr({ fill: defaultColor, opacity: 0.3 });

        posGroup.push(rect);
        posGroup.data("column", position.column);
        posGroup.data("cordon", position.cordon);
        posGroup.data("part", position.part);
        posGroup.data("name", position.name);
        allCells.push(posGroup);
      }

      // Write the name of castellers in the castell
      allCells.forEach(function (cell) {
        const rect = cell[0]; // data is set on the set but only accessible in the rectangle
        // For each cell we will see if someone is assigned
        for (let i = 0; i < self.positionsMembers.length; i++) {
          // Write if current position matches current cell
          if (
            self.positionsMembers[i].position.column === rect.data("column") &&
            self.positionsMembers[i].position.cordon === rect.data("cordon") &&
            self.positionsMembers[i].position.part === rect.data("part") &&
            self.positionsMembers[i].position.name === rect.data("name") &&
            self.allMembers[self.positionsMembers[i].member_uuid]
          ) {
            const bbox = rect.getBBox();
            const vertical = bbox.width < bbox.height;
            // Write text and add to group
            const name = self.paperTronc
              .text(
                bbox.x + (vertical ? s / 2 : l / 2),
                bbox.y + (vertical ? l / 2 : s / 2),
                [
                  self.allMembers[self.positionsMembers[i].member_uuid]
                    .firstName,
                  self.allMembers[self.positionsMembers[i].member_uuid]
                    .lastName[0],
                ].join(" ")
              )
              .attr({ fill: "#000000" })
              // rotate and scale text. If cell width = 100, s = 1.5. If cell width = 50, s = 1
              .transform((vertical ? "R270s" : "R0s") + (l * 0.01 + 0.5))
              .toBack();
            cell.push(name);
            cell.data("uuid", self.positionsMembers[i].member_uuid);
          }
        }
        // Change color of border if self
        if (rect.data("uuid") === self.uuid) {
          rect.attr({ stroke: "purple", "stroke-width": 6 });
        }
        // Change color of fill according to presence
        if (self.isPresent(rect.data("uuid")) === true) {
          rect.attr("fill", "green");
        } else if (self.isPresent(rect.data("uuid")) === false) {
          rect.attr("fill", "red");
        }
      });

      // Attach events to elements
      allCells.forEach(function (cell) {
        const setPosition = function () {
          if (!self.dragging) {
            self.setMemberPosition(
              rect.data("column"),
              rect.data("cordon"),
              rect.data("part"),
              rect.data("name"),
              self.selectedMemberUuid
            );
            self.selectedMemberUuid = "";
          }
        };
        const rect = cell[0];
        cell
          .mouseup(setPosition)
          .touchend(setPosition)
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
                  originEl.data("part"),
                  originEl.data("name"),
                  destinationEl.data("column"),
                  destinationEl.data("cordon"),
                  destinationEl.data("part"),
                  destinationEl.data("name")
                );
                self.dragging = false;
              }
            }
          );
      });
    },
    isPresent(uuid) {
      if (this.castell && this.castell.castellers) {
        for (let i = 0; i < this.castell.castellers.length; i++) {
          if (this.castell.castellers[i].uuid === uuid) {
            if (
              // casteller is considered present
              this.castell.castellers[i].presence === "yes" ||
              (this.castell.castellers[i].presence === "" &&
                this.castell.castellers[i].participation === "yes")
            ) {
              return true;
            } else if (
              // casteller is considered absent
              this.castell.castellers[i].presence === "no" ||
              (this.castell.castellers[i].presence === "" &&
                this.castell.castellers[i].participation === "no")
            ) {
              return false;
            }
          }
        }
      }
      return undefined;
    },
  },
  watch: {
    castell: function () {
      this.drawTronc();
    },
    // castell.positions is updated after castell.type is refreshed in the parent
    // we remove the members that are outside of the castell after we
    // get the new positions for the current castell
    "castell.positions": function () {
      this.removePositionsOutsideCastell();
      this.drawTronc();
    },
    // castell.position_members is loaded asynchronously after the component is loaded
    // we add this function to react to the update
    "castell.position_members": function () {
      this.positionsMembers = this.castell.position_members;
      if (this.castell.positions) {
        this.drawTronc();
      }
    },
  },
};
</script>
