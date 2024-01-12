const styleInnerHtml = `
@keyframes enter {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes leave {
    0% {
      opacity: 1;
      left: 0;
    }
    100% {
      opacity: 0;
      left: -50px;
    }
  }
  .message-enter-active {
    opacity: 0;
  }
  .message-enter-to {
    animation: enter 0.5s forwards;
  }
  .message-leave-to {
    animation: leave 1s forwards;
  }
  .warn {
    background: #fff1e3;
    color: #ff8d1a;
  }
  .warn em {
    color: #ff8d1a;
  }
  .error {
    background: #fae1e1;
    color: #ff5733;
  }
  .error em {
    color: #ff5733;
  }
  .success {
    background: #e5f0fb;
    color: #2a81e4;
  }
  .success em {
    color: #2a82e4;
  }
  .messageBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    left: 50%;
    top: 2vw;
    transform: translateX(-50%);
    z-index: 9999;
    gap: 10px;
  }
  .messageBox .message-item {
    display: flex;
    align-items: center;
    position: absolute;
    box-sizing: border-box;
    padding: 0 20px;
    border-radius: 20px;
    box-shadow: 0 2px 6px 2px #00000010;
    transform: translate(-50%, var(--transformY));
    height: 4vw;
    transition: 0.2s;
  }
  .messageBox .message-item em {
    font-size: 25px;
  }
  .messageBox .message-item .message {
    white-space: nowrap;
    font-weight: bold;
    font-size: 16px;
    margin-left: 15px;
  }
`;
export default {
  name: "MessageTips",
  data() {
    return {
      timer: null,
      isFirst: true,
      id: 0,
      pt: 0,
      messageList: [],
      destroyedTimer: false,
    };
  },
  mounted() {
    const style = document.createElement("style");
    style.innerHTML = styleInnerHtml;
    this.$refs.messageBox.appendChild(style);
  },
  methods: {
    add(option, callback) {
      clearTimeout(this.destroyedTimer);
      this.destroyedTimer = false;
      if (this.messageList.length >= 4) {
        this.messageList.shift();
      }
      this.messageList.push({
        id: this.id,
        isLeave: false,
        ...option,
      });
      this.id++;
      if (this.isFirst) {
        this.addDelete(callback);
        this.isFirst = false;
      }
    },
    exposed() {
      return {
        add: this.add,
      };
    },
    addDelete(callback) {
      this.timer = setInterval(() => {
        this.messageList.shift();
        if (this.messageList.length === 0) {
          clearInterval(this.timer);
          this.isFirst = true;
          this.destroyedTimer = setTimeout(() => {
            callback();
          }, 500);
        }
      }, 2000);
    },
  },
  template: `
  <div ref="messageBox" class="messageBox" :style="{'padding-top':pt +'px'}">
  <transition-group name="message" tag="div">
    <div
      v-for="(item, index) in messageList"
      :key="item.id"
      class="message-item"
      :style="{'--transformY':index * 110 +'%'}"
      :class="{
        leaveAnm: item.isLeave,
        success: item.type === 'success',
        error: item.type === 'error',
        warn: item.type === 'warn',
      }"
    >
      <em v-if="item.type === 'success'" class="iconfont icon-cube"></em>
      <em v-if="item.type === 'error'" class="iconfont icon-cube"></em>
      <em v-if="item.type === 'warn'" class="iconfont icon-cube"></em>
      <span class="message">{{ item.message }}</span>
    </div>
  </transition-group>
</div>
  `,
};
