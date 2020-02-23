<template>
  <div>
    <p class="title is-5">{{ this.castell.name }}</p>
    <div><p>Pom</p></div>
    <div>
      <p>Tronc</p>
      <div id="canvas_tronc"></div>
    </div>
    <div><p>Pinya</p></div>
  </div>
</template>

<script>
import Raphael from "raphael";

export default {
  props: {
    castell: Object
  },
  computed: {
    castellHeight: function() {
      return parseInt(this.castell.type.split("d")[1]);
    },
    castellWidth: function() {
      return parseInt(this.castell.type.split("d")[0]);
    }
  },
  mounted() {
    this.drawTronc();
  },
  methods: {
    drawTronc() {
      var self = this;
      var paper = new Raphael(document.getElementById("canvas_tronc"));

      var width = self.castellWidth;
      var height = self.castellHeight - 3; // pom = 3

      var realWidth = Math.min(
        document.getElementById("canvas_tronc").offsetWidth,
        350
      );

      var posW = realWidth / (width * 1.25);
      var posH = posW * 2;

      // Resize canvas for the current castell
      paper.setSize(width * posW * 1.25, height * posH * 1.125);

      var positions = []; // To attach click events
      var members = [
        [
          { name: "René", registered: "yes", present: "yes" },
          { name: "Fabrice", registered: "yes", present: "yes" },
          { name: "Martin-Gilles", registered: "no", present: "no" }
        ],
        [
          { name: "Patrick", registered: "yes", present: "yes" },
          { name: "Clément", registered: "yes", present: "no" },
          { name: "Carles", registered: "yes", present: "yes" }
        ],
        [
          { name: "Miguel", registered: "yes", present: "yes" },
          { name: "Serge", registered: "yes", present: "yes" },
          { name: "Coline", registered: "yes", present: "yes" }
        ]
      ];

      var h, w;
      for (h = 0; h < height; h++) {
        positions[h] = [];
        for (w = 0; w < width; w++) {
          var color = "gray";
          if (members[h][w].present === "yes") {
            color = "green";
          } else {
            if (members[h][w].registered === "yes") {
              color = "yellow";
            } else {
              color = "red";
            }
          }
          positions[h].push(
            paper
              .rect(
                posW / 8 + posW * 1.25 * w,
                posH / 16 + posH * 1.125 * h,
                posW,
                posH
              )
              .attr({ fill: color })
          );
          paper
            .text(
              posW / 8 + posW * 1.25 * w + posW / 2,
              posH / 16 + posH * 1.125 * h + posH / 2,
              members[h][w].name
            )
            .attr({ fill: "#000000" })
            .transform("R270s3");
        }
      }
    }
  }
};
</script>
