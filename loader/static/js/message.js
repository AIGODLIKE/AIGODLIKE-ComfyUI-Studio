if (typeof Vue === "undefined") {
    await import("./vue.js");
}
import Message from "../../components/public/message.js";
let modal = null;
function getMessageInstance() {
    if (modal) return;
    const MessageBox = Vue.extend(Message);
    const instance = new MessageBox();
    modal = instance.$mount();
    document.body.appendChild(modal.$el);
}

/**
 * @param option String || { type : 'success | warn | error', message : String }
 */
function message(option) {
    if (typeof option === "string") {
        option = {
            type: "success",
            message: option,
        };
    }
    getMessageInstance();
    modal.add(option, () => {
        modal.$destroy();
        modal.$el.parentNode.removeChild(modal.$el);
        modal = null;
    });
}
Vue.prototype.$message = message;
