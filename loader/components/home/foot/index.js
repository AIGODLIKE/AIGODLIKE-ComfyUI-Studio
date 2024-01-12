export default {
  data() {
    return {
      value: 10,
    };
  },
  methods: {},
  template: `<div class="foot">
                <span>共计模型256个，其中3个无缩略图</span>
                <div class="progress">
                    <div class="value" :style="{'width':value + '%'}"></div>
                </div>
             </div>`,
};
