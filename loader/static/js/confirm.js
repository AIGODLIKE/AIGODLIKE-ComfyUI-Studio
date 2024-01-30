if (typeof Vue === "undefined") {
  await import("./vue.js");
}
import confirmBox from "../../components/public/confirmBox.js";

/**
 *
 option = {
  accept: Function;
  refuse: Function;
  describe?: string;
};
*/
Vue.prototype.$confirmBox = function (option) {
  const ConfirmBox = Vue.extend(confirmBox);
  const instance = new ConfirmBox({
    data: {
      ...option,
    },
  });
  const modal = instance.$mount();
  document.body.appendChild(modal.$el);
};
