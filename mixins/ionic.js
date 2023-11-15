import {
  loadingController,
  toastController,
  alertController,
  modalController,
  popoverController,
  actionSheetController
} from "@ionic/vue";
export default {
  methods: {
    async showToast(message, seconds = 3) {
      const toast = await toastController.create({
        message: message,
        duration: seconds * 1000
      });
      toast.present();
      return toast;
    },
    async showLoading(message = "Loading...", hide = 0) {
      if (this.$loading) {
        this.$loading.message = message;
      }
      else {
        this.$loading = await loadingController.create({
          message: message
        });
        await this.$loading.present();
      }
      if (hide && hide > 0) {
        this.hideLoading(hide);
      }
      return this.$loading;
    },
    async hideLoading(delay = 200) {
      setTimeout(async() => {
        if (this.$loading) {
          await this.$loading.dismiss();
          this.$loading = null;
        }
      }, delay);
    },
    async showActionSheet(options = {}, cancel = true) {
      let buttons = [];
      for (let option of Object.keys(options)) {
        buttons.push({
          text: options[option],
          data: {
            action: option,
          },
        });
      }
      if (cancel) {
        buttons.push({
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        });
      }
      const actionSheet = await actionSheetController.create({ buttons: buttons });
      await actionSheet.present();
      const data = await actionSheet.onDidDismiss();
      return data && data.data && data.data.action ? data.data.action : null;
    },
    async showAlert(title, subtitle = null, message = null, buttons = [
      "Ok"
    ]) {
      let alert = await alertController.create({
        header: title ? title : null,
        subHeader: subtitle ? subtitle : null,
        message: message ? message : null,
        buttons: buttons
      });
      await alert.present();
      return await alert.onDidDismiss();
    },
    async hideAlert() {
      await alertController.dismiss();
    },
    async showConfirm(title, subtitle = null, message = null, callback) {
      this.showAlert(title, subtitle, message, [
        {
          text: "Cancel"
        }, {
          text: "Ok",
          handler: () => {
            if (callback) {
              callback();
            }
          }
        }
      ]);
    },
    async showModal(component, props = {}, cssClasses = []) {
      let modal = await modalController.create({
        component: component,
        componentProps: props,
        cssClass: cssClasses.join(" ")
      });
      await modal.present();
      return await modal.onDidDismiss();
    },
    async hideModal(data = null) {
      await modalController.dismiss(data);
    },
    async showPopover(component, props = {}, event = null) {
      const popover = await popoverController.create({
        component: component,
        componentProps: props,
        event: event,
        translucent: true
      });
      await popover.present();
      return await popover.onDidDismiss();
    },
    async showError(title, error) {
      return await this.showAlert(title, error);
    }
  }
};