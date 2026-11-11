<template>
  <div>
    <member-filter
      :types="this.memberTypes"
      :statuses="this.memberStatuses"
      @filterMembers="filterMembers"
    ></member-filter>
    <div class="columns is-multiline">
      <div class="column is-3" v-if="!readonly">
        <div class="columns is-multiline">
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
                'has-text-weight-bold is-underlined':
                  member.uuid === selectedMemberUuid,
              }"
            >
              {{ member.firstName }} {{ member.lastName }}
            </p>
          </div>
        </div>
      </div>
      <div class="column is-3" v-if="!readonly">
        <h1 class="subtitle is-3">{{ $t("castells.available_members") }}</h1>
        <div class="field" v-if="hasParticipation">
          <o-checkbox v-model="onlyPresent" variant="success">
            <span>{{ $t("castells.onlyPresent") }}</span>
          </o-checkbox>
        </div>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input
              class="input"
              type="search"
              v-model="memberSearchQuery"
              :placeholder="$t('members.searchPlaceholder')"
              autocomplete="off"
            />
          </div>
          <div class="control">
            <button
              type="button"
              class="button is-light"
              @click="memberSearchQuery = ''"
              :disabled="!memberSearchQuery.trim()"
              :aria-label="$t('members.clearSearch')"
            >
              {{ $t("members.clearSearch") }}
            </button>
          </div>
        </div>
        <p class="help" v-if="availableMembers.length === 0">
          {{ $t("castells.noAvailableMember") }}
        </p>
        <p
          v-for="member in availableMembers"
          v-bind:key="member.uuid"
          v-on:click="selectMember(member.uuid)"
          v-bind:class="{
            'has-text-success': isPresent(member.uuid),
            'has-text-danger': !isPresent(member.uuid),
            'has-text-weight-bold is-underlined':
              member.uuid === selectedMemberUuid,
          }"
        >
          <!-- if member in cas -->
          {{ member.firstName }} {{ member.lastName }}
        </p>
      </div>
      <div
        class="column is-6"
        id="canvas_tronc"
        ref="canvas"
        style="padding: 0"
      >
        <svg
          v-if="drawing"
          ref="svg"
          xmlns="http://www.w3.org/2000/svg"
          :width="drawing.width"
          :height="drawing.height"
          :viewBox="'0 0 ' + drawing.width + ' ' + drawing.height"
          font-family="Arial"
          font-size="10"
          text-anchor="middle"
          :style="
            readonly ? null : 'user-select: none; -webkit-user-select: none'
          "
          @pointerdown="startPress"
          @touchstart="preventScroll"
        >
          <!-- The texts are drawn first, under the cells: a cell is half
               transparent and receives the taps and the drags -->
          <text
            v-for="label in drawing.labels"
            :key="label.key"
            :x="label.x"
            :y="label.y"
            :fill="label.fill"
            :font-size="label.fontSize"
            :font-weight="label.bold ? 'bold' : null"
            :transform="
              label.vertical
                ? 'rotate(270 ' + label.x + ' ' + label.y + ')'
                : null
            "
            dominant-baseline="central"
            style="pointer-events: none"
          >
            {{ label.text }}
          </text>
          <!-- Landmark for the baix in the pinya. Not a position. -->
          <rect
            v-if="drawing.baix"
            :x="drawing.baix.x"
            :y="drawing.baix.y"
            :width="drawing.baix.w"
            :height="drawing.baix.h"
            rx="5"
            ry="5"
            fill="none"
            stroke="gray"
            stroke-dasharray="4,3"
            style="pointer-events: none"
          />
          <rect
            v-for="cell in drawing.cells"
            :key="cell.key"
            :data-cell="cell.key"
            :x="cell.x"
            :y="cell.y"
            :width="cell.w"
            :height="cell.h"
            rx="5"
            ry="5"
            :fill="cell.fill"
            :stroke="cell.stroke"
            :stroke-width="cell.strokeWidth"
            opacity="0.3"
            :style="readonly ? null : 'touch-action: none'"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import MemberFilter from "./MemberFilter-Component.vue";
import {
  pinyaBaixCell,
  pinyaCell,
  pinyaLabel,
  pinyaScale,
  pinyaSize,
} from "../api/pinyaLayout";

export default {
  components: { MemberFilter },
  props: {
    castell: Object,
    readonly: Boolean,
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
    selectedMembersIDs: function () {
      const membersIDs = [];
      for (let i = 0; i < this.positionsMembers.length; i++) {
        if (this.allMembers[this.positionsMembers[i].member_uuid]) {
          membersIDs.push(this.positionsMembers[i].member_uuid);
        }
      }
      return membersIDs;
    },
    // true when we know who comes to the event of the castell
    hasParticipation: function () {
      return Array.isArray(this.castell && this.castell.castellers);
    },
    availableMembers: function () {
      let allMembers = [...this.members].filter(
        (x) => !this.selectedMembersIDs.includes(x.uuid)
      );
      const query = this.normalizeText(this.memberSearchQuery);
      if (query) {
        // A search looks in all the members of the filter, present or not
        allMembers = allMembers.filter((x) =>
          this.normalizeText(`${x.firstName} ${x.lastName}`).includes(query)
        );
      } else if (this.onlyPresent && this.hasParticipation) {
        allMembers = allMembers.filter((x) => this.isPresent(x.uuid) === true);
      }
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
    // Everything to draw: size of the drawing, cells of the positions and texts.
    // null as long as we do not know the positions of the castell.
    drawing: function () {
      if (!this.castell || !this.castell.positions) {
        return null;
      }
      const positionsMembers = this.positionsMembers || [];
      const troncHeight = this.castellHeight - this.pomHeight;

      // Define size of cells
      const areaW = this.areaWidth;
      const l = Math.min(100, areaW / this.castellWidth); // long side of the rectangle. 100 or less if we don't have enough space
      const s = l / 2; // short side of rectangle
      const spacing = l / 10;

      const troncWidth = this.castellWidth * l;
      const canvasTroncHeight = troncHeight * (l + spacing) - spacing;
      const canvasPomHeight =
        (this.pomHeight > 0 ? 1 : 0) * (2 * (s + spacing) + l + spacing);

      // The pinya is drawn under the tronc, as a plan seen from above.
      // Only the castells with pinya positions have one.
      const pinyaPositions = this.castell.positions.filter(
        (position) => position.part === "pinya" && pinyaCell(position)
      );
      const hasPinya = pinyaPositions.length > 0;
      const pinyaZoom = pinyaScale(pinyaPositions, areaW);
      const pinya = pinyaSize(pinyaPositions, pinyaZoom);
      const pinyaMargin = 40; // space above and under the plan, for the captions
      const canvasPinyaHeight = hasPinya ? pinya.height + 2 * pinyaMargin : 0;

      const canvasWidth = Math.max(troncWidth, pinya.width);
      const troncX = (canvasWidth - troncWidth) / 2; // the tronc is centered above the pinya
      // position of the baix on the plan
      const pinyaX = canvasWidth / 2;
      const pinyaY =
        canvasPomHeight + canvasTroncHeight + pinyaMargin + pinya.height / 2;

      const defaultColor = "gray";
      const captionColor = "#666666";

      const labels = [];
      const cells = [];
      let baix = null;

      if (hasPinya) {
        // Captions and baix. They are not positions: nobody can be assigned there.
        labels.push({
          key: "caption-pinya",
          x: pinyaX,
          y: pinyaY - pinya.height / 2 - pinyaMargin / 2,
          text: "Pinya",
          fill: captionColor,
          fontSize: 14,
          bold: true,
        });
        labels.push({
          key: "caption-front",
          x: pinyaX,
          y: pinyaY + pinya.height / 2 + pinyaMargin / 2,
          text: this.$t("castells.pinyaFront"),
          fill: captionColor,
          fontSize: 12,
        });
        const baixCell = pinyaBaixCell(pinyaZoom);
        baix = {
          x: pinyaX - baixCell.w / 2,
          y: pinyaY - baixCell.h / 2,
          w: baixCell.w,
          h: baixCell.h,
        };
        // Show who is the baix, to see around whom the pinya is built
        const baixMember = positionsMembers.find(
          (member) =>
            member.position.part === "tronc" &&
            member.position.name === "baix" &&
            this.allMembers[member.member_uuid]
        );
        labels.push({
          key: "caption-baix",
          x: pinyaX,
          y: pinyaY,
          text: baixMember
            ? this.shortName(this.allMembers[baixMember.member_uuid])
            : "baix",
          fill: captionColor,
          fontSize: 12,
        });
      }

      // We draw the tronc in a grid pattern.
      // For each position of the castell, we draw the cell at (column,cordon)
      for (const position of this.castell.positions) {
        let x, y;
        let dx = s;
        let dy = l;
        if (position.part === "tronc") {
          // calculate x, y tronc (with Y offset for the pom)
          x = troncX + (position.column - 1) * l + (l - s) / 2;
          y = (troncHeight - position.cordon) * (l + spacing) + canvasPomHeight;
        } else if (position.part === "pom") {
          // calculate x, y pom
          if (position.cordon === 1) {
            // dosos (vertical)
            x = troncX + (position.column - 1) * l + (l - s) / 2;
            y = (this.pomHeight - position.cordon) * (s + spacing);
          } else {
            // acotxador and enxaneta (horizontal)
            x = troncX + (position.column - 1) * l;
            y = (this.pomHeight - position.cordon) * (s + spacing);
            dx = l;
            dy = s;
          }
        } else if (position.part === "pinya") {
          const cell = pinyaCell(position, pinyaZoom);
          if (!cell) {
            continue; // pinya position that we do not know how to draw
          }
          x = pinyaX + cell.cx - cell.w / 2;
          y = pinyaY + cell.cy - cell.h / 2;
          dx = cell.w;
          dy = cell.h;
        } else {
          continue; // unknown part of the castell
        }

        const key = [
          position.part,
          position.name,
          position.column,
          position.cordon,
        ].join("/");
        const vertical = dx < dy;
        const longSide = Math.max(dx, dy);
        const centerX = x + dx / 2;
        const centerY = y + dy / 2;

        // Write the name of the casteller assigned to the cell
        let uuid;
        for (const positionMember of positionsMembers) {
          if (
            positionMember.position.column === position.column &&
            positionMember.position.cordon === position.cordon &&
            positionMember.position.part === position.part &&
            positionMember.position.name === position.name &&
            this.allMembers[positionMember.member_uuid]
          ) {
            uuid = positionMember.member_uuid;
            labels.push({
              key: "name/" + key + "/" + uuid,
              x: centerX,
              y: centerY,
              text: this.shortName(this.allMembers[uuid]),
              fill: "#000000",
              // rotate and scale text. If cell width = 100, size = 15. If cell width = 50, size = 10
              fontSize: 10 * (longSide * 0.01 + 0.5),
              vertical: vertical,
            });
          }
        }
        // In the pinya, the cells look the same: write the name of the position in the free ones
        if (uuid === undefined && position.part === "pinya") {
          labels.push({
            key: "position/" + key,
            x: centerX,
            y: centerY,
            text: pinyaLabel({ name: position.name, cordon: position.cordon }),
            fill: captionColor,
            fontSize: 10 * (longSide * 0.01 + 0.3),
            vertical: vertical,
          });
        }

        // Change color of fill according to presence
        const present = this.isPresent(uuid);
        let fill = defaultColor;
        if (present === true) {
          fill = "green";
        } else if (present === false) {
          fill = "red";
        }
        // Change color of border if self
        const isSelf = uuid === this.uuid;

        cells.push({
          key: key,
          position: position,
          uuid: uuid,
          x: x,
          y: y,
          w: dx,
          h: dy,
          fill: fill,
          stroke: isSelf ? "purple" : "#000000",
          strokeWidth: isSelf ? 6 : 1,
        });
      }

      const canvasHeight =
        canvasTroncHeight + canvasPomHeight + canvasPinyaHeight;
      if (!(canvasWidth >= 0) || !(canvasHeight >= 0)) {
        return null; // castell without a known type: nothing to draw
      }

      return {
        width: canvasWidth,
        height: canvasHeight,
        labels: labels,
        cells: cells,
        baix: baix,
      };
    },
    ...mapState({
      members: (state) => state.members.members,
    }),
    ...mapGetters(["uuid"]),
  },
  data() {
    return {
      // width available for the drawing, measured in drawTronc()
      areaWidth: 0,
      selectedMemberUuid: "",
      positionsMembers: [],
      memberTypes: ["admin,member,canalla", "guest"],
      memberStatuses: ["active"],
      allMembers: {},
      // When the castell has an event, list only the members who come to it
      onlyPresent: true,
      memberSearchQuery: "",
    };
  },
  created() {
    // Press of a finger or of the mouse in progress on a cell, see startPress()
    this.press = null;
  },
  mounted() {
    this.getAllMembers(); // We need all members to be able to write the names even if we filter the member list
    this.getMembers({ type: this.memberTypes, status: this.memberStatuses }); // We refresh the member list with the current filters
    this.drawTronc();
  },
  beforeUnmount() {
    this.endPress();
  },
  methods: {
    ...mapActions({
      getMembers: "members/getMembers",
    }),
    getAllMembers() {
      const self = this;
      this.getMembers({
        type: ["admin", "member", "canalla", "guest"],
        status: ["created", "active", "paused", "deleted"],
      }).then(function (response) {
        const members = {};
        for (let i = 0; i < response.data.length; i++) {
          members[response.data[i].uuid] = response.data[i];
        }
        self.allMembers = members;
      });
    },
    filterMembers(filters) {
      this.getMembers({
        type: filters.types,
        status: filters.statuses,
      });
    },
    // "Maria Soler" => "Maria S"
    shortName(member) {
      return [member.firstName, member.lastName[0]].join(" ");
    },
    selectMember(uuid) {
      this.selectedMemberUuid = uuid;
    },
    // lower case, without accents and extra spaces: "  Éric " => "eric"
    normalizeText(text) {
      return String(text || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
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
    // The drawing itself is the computed property "drawing", refreshed when
    // the castell or the members change. Here we only measure the room we have.
    drawTronc() {
      if (this.$refs.canvas) {
        this.areaWidth = this.$refs.canvas.clientWidth;
      }
    },
    // Cell of the drawing under this element of the page, if any
    cellOfElement(element) {
      const svg = this.$refs.svg;
      if (!svg || !element || !svg.contains(element)) {
        return null;
      }
      const key = element.getAttribute("data-cell");
      if (!key || !this.drawing) {
        return null; // captions and the baix of the pinya are not positions
      }
      return this.drawing.cells.find((cell) => cell.key === key) || null;
    },
    assignSelectedMember(cell) {
      this.setMemberPosition(
        cell.position.column,
        cell.position.cordon,
        cell.position.part,
        cell.position.name,
        this.selectedMemberUuid
      );
      this.selectedMemberUuid = "";
    },
    // A finger put on a cell must not scroll the page: the browser would take
    // the move for itself and the drag would never reach another cell.
    preventScroll(event) {
      if (
        !this.readonly &&
        event.cancelable &&
        this.cellOfElement(event.target)
      ) {
        event.preventDefault();
      }
    },
    // A finger or the mouse is pressed on a cell. We follow it until it is
    // released: on the same cell it is a tap, on another one it is a drag.
    startPress(event) {
      if (this.readonly || event.button > 0) {
        return;
      }
      const cell = this.cellOfElement(event.target);
      if (!cell) {
        return;
      }
      // A new press always starts as a tap, even if the end of the previous
      // one was never received
      this.endPress();
      this.press = {
        pointerId: event.pointerId,
        key: cell.key,
        x: event.clientX,
        y: event.clientY,
        moved: false,
      };
      window.addEventListener("pointermove", this.movePress);
      window.addEventListener("pointerup", this.releasePress);
      window.addEventListener("pointercancel", this.cancelPress);
    },
    movePress(event) {
      const press = this.press;
      if (!press || event.pointerId !== press.pointerId) {
        return;
      }
      if (
        Math.abs(event.clientX - press.x) + Math.abs(event.clientY - press.y) >
        10
      ) {
        press.moved = true;
      }
    },
    releasePress(event) {
      const press = this.press;
      if (!press || event.pointerId !== press.pointerId) {
        return;
      }
      // The press is over, whatever happens below
      this.endPress();
      const origin = this.drawing
        ? this.drawing.cells.find((cell) => cell.key === press.key)
        : null;
      if (!origin) {
        return;
      }
      // Without move, the cell under the finger is the one that was pressed
      const destination = press.moved
        ? this.cellOfElement(
            document.elementFromPoint(event.clientX, event.clientY)
          )
        : origin;
      if (!destination) {
        return; // dropped outside of the cells
      }
      if (destination.key === origin.key) {
        // The finger may have moved a bit but stayed in the cell: it is a tap
        this.assignSelectedMember(origin);
      } else {
        this.swapMemberPositions(
          origin.position.column,
          origin.position.cordon,
          origin.position.part,
          origin.position.name,
          destination.position.column,
          destination.position.cordon,
          destination.position.part,
          destination.position.name
        );
      }
    },
    cancelPress(event) {
      if (this.press && event.pointerId === this.press.pointerId) {
        this.endPress();
      }
    },
    endPress() {
      this.press = null;
      window.removeEventListener("pointermove", this.movePress);
      window.removeEventListener("pointerup", this.releasePress);
      window.removeEventListener("pointercancel", this.cancelPress);
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
