<template>
  <div>
    <div
      id="dragBar"
      ref="dragBar"
      draggable="false"
      style="position:fixed;
      top:0;
      left:0;
      bottom:0;
      width:9px;
      display: flex;
      cursor: pointer;
      z-index:100;
      backgroud:white;
      "
      @click="toggle"
    >
      <i
        style="width: 100%;
display: block;
align-self: center;
background: #FFF;
width:1px;
border-left: 1px solid #ccc;
border-right: 1px solid #ccc;
height: 30px;
border-top: none;
border-bottom: none;"
      ></i>
    </div>
    <span
      class="r shrink2"
      @click="toggleLeft"
      :class="{ dock: isDockLeft }"
    ></span>
    <slot />
    <span
      class="d shrink2"
      @click="isShrink = !isShrink"
      :class="{ dock: isShrink }"
    ></span>
  </div>
</template>
<script>
import { animation, animation2 } from "@/lib/WinUtils";
export default {
  data() {
    return {
      isDockLeft: false,
      isShrink: false
    };
  },
  props: {
    left: Boolean,
    childsWind: Array
  },
  watch: {},
  methods: {
    toggle() {
      let win = this.$electron.remote.getCurrentWindow();
      let screen = this.$electron.remote.screen;
      let x2 = screen.getPrimaryDisplay().workAreaSize.width - win.getSize()[0];
      let x = win.getPosition()[0];

      if (x <= x2) this.onLeave(true);
      else this.onEnter(true);
    },
    toggleLeft() {
      this.isDockLeft = !this.isDockLeft;
    },
    onEnter(force) {
      let win = this.$electron.remote.getCurrentWindow();
      let screen = this.$electron.remote.screen;
      let biasX = 0;
      let biasY = 0;
      let timerID;
      let con = this.$electron.remote.getGlobal("console");

      con.log("ALT+Z mouseenter");
      win.focus();
      this.isleave = false;
      if (timerID) clearTimeout(timerID);
      let x = win.getPosition()[0];
      let x2 = x;
      if (force || this.isDockLeft) {
        x2 = screen.getPrimaryDisplay().workAreaSize.width - win.getSize()[0];
      }
      let winSize = win.getSize();

      let h = winSize[1] - (win.isFrame ? 27 : 0);
      let h2 = h;
      if (this.isShrink) {
        this.$emit("onCollapseH", false);
        h2 = this.resizeWin();
      }
      animation2(
        [
          [x, x2],
          [h, h2]
        ],
        ([curx, curH]) => {
          win.setPosition(curx, win.getPosition()[1]);
          this.setSize(winSize[0], curH);
        }
      );
    },
    onLeave(force) {
      let win = this.$electron.remote.getCurrentWindow();
      let screen = this.$electron.remote.screen;
      let biasX = 0;
      let biasY = 0;
      let timerID;
      let con = this.$electron.remote.getGlobal("console");
      if (
        this.childsWind &&
        this.childsWind.filter(w => w && !w.closed).length > 0
      ) {
        return;
      }
      con.log("ALT+Z mouseleave");
      this.isleave = true;
      let wsize = win.getSize();

      let toLeft = () => {
        let x = win.getPosition()[0];
        let x2 = x;
        let h = wsize[1] - (win.isFrame ? 27 : 0);
        let h2 = h;
        if (force || this.isDockLeft) {
          x2 = screen.getPrimaryDisplay().workAreaSize.width - 3;
        }
        if (this.isShrink) {
          h2 = 27;
          this.$emit("onCollapseH", true);
        }

        animation2(
          [
            [x, x2],
            [h, h2]
          ],

          ([curx, curh]) => {
            con.log(curx, curh);
            win.setPosition(curx, win.getPosition()[1]);
            this.setSize(wsize[0], curh);
          }
        );
      };
      if (force) toLeft();
      else {
        timerID = setInterval(() => {
          let wsize = win.getSize();

          let mpos = this.$electron.screen.getCursorScreenPoint();
          let wPos = win.getPosition();

          if (
            mpos.x < wPos[0] ||
            mpos.x > wPos[0] + wsize[0] ||
            mpos.y < wPos[1] ||
            mpos.y > wPos[1] + wsize[1]
          ) {
            clearInterval(timerID);
            toLeft();
          }
        }, 500);
      }
    },
    resizeWin() {
      let win = this.$electron.remote.getCurrentWindow();
      let screen = this.$electron.remote.screen;
      let winSize = win.getSize();
      let body = document.body,
        html = document.documentElement;

      let height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.offsetHeight,
        27
      );
      return height;
    },
    onResize() {
      let win = this.$electron.remote.getCurrentWindow();

      let winSize = win.getSize();
      let h = winSize[1] - (win.isFrame ? 27 : 0);
      let h2 = this.resizeWin();

      animation2([[h, h2]], ([curH]) => {
        this.setSize(winSize[0], curH);
      });
    },
    setSize(w, h) {
      let win = this.$electron.remote.getCurrentWindow();
      //win.setResizable(true);
      win.setSize(w, (win.isFrame ? 27 : 0) + h);

      // win.setResizable(false);
    }
  },
  mounted() {
    if (this.left) this.isDockLeft = true;
    let win = this.$electron.remote.getCurrentWindow();
    let screen = this.$electron.remote.screen;

    let timerID;
    let con = this.$electron.remote.getGlobal("console");

    document.addEventListener("mouseleave", event => {
      this.onLeave();
    });

    document.addEventListener("mouseenter", event => {
      this.onEnter();
    });
    this.onEnter();
    this.$electron.ipcRenderer.on("ALT+Z", () => {
      this.toggle();
    });

    let biasX = 0;
    let biasY = 0;
    document.addEventListener("mousedown", e => {
      switch (e.button) {
        case 0:
          biasX = e.x;
          biasY = e.y;
          document.addEventListener("mousemove", moveEvent);
          break;
      }
    });

    document.addEventListener("mouseup", () => {
      biasX = 0;
      biasY = 0;
      document.removeEventListener("mousemove", moveEvent);
    });

    function moveEvent(e) {
      win.setPosition(e.screenX - biasX, e.screenY - biasY);
    }
  }
};
</script>
<style>
.dock.shrink2:after {
  background: green !important;
}
.shrink2 {
  width: 6px;
  height: 6px;
  position: fixed;
  right: 5px;
  border: none;

  cursor: pointer;
  z-index: 2;
}
.shrink2:after {
  position: absolute;
  content: "";
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 3px;
  border: 1px solid black;
}
.r {
  top: 5px;
}
.d {
  bottom: 5px;
  right: 5px;
}
.wrap {
  margin-left: 6px;
  margin-right: 6px;
  background: white;
  border-radius: 3px;
  border-bottom: 1px dashed #ccc;
}
.arrow {
  background: white;
}
</style>
