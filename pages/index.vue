<template>
<v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="Amount" :counter="10" :rules="nameRules" label="Enter Amount" required></v-text-field>

            <v-text-field v-model="Phone" :rules="nameRules" label="Phone number" placeholder="254 34-3400-7734" required></v-text-field>

            <v-btn color="success" class="mr-4" @click="MpesaPaymentStk">
                StkPush
            </v-btn>

        </v-form>

    </v-col>

    <!-- <v-snackbar
    color="red accent-8"
    :timeout="3000"
    v-model="snackbar"
    centered
    outlined
    bottom
  >
    {{ snackbarText }}
  </v-snackbar> -->
  <v-snackbar color="success" :timeout="2000" v-model="snackbar" outlined bottom>
    {{ snackbarText }}
  </v-snackbar>
  <v-snackbar color="error" :timeout="3000" v-model="snackbar2" outlined bottom>
    {{ snackbarText2 }}
  </v-snackbar>
</v-row>
</template>

<script>
import axios from "axios";

export default {
    name: 'IndexPage',
    data() {
        return {
            Amount: "",
            Phone: null,
            UserName: "",
            snackbar: false,
            snackbar2: false,
            snackbarText: "",
            snackbarText2: "",
            timerEnabled: false,
            show6 :false,
            timerCount: 20,
            valid: true,
            name: '',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            select: null,
            items: [
                'Item 1',
                'Item 2',
                'Item 3',
                'Item 4',
            ],
            checkbox: false,
            CheckoutRequestID:"",
        }
    },
    methods: {
        validate() {
            this.$refs.form.validate()
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },

        MpesaPaymentStk() {
            let that = this;
            that.show6 = true;
            if (this.Phone == null) {
                that.snackbarText = "Provide phone number..";
                that.snackbar = true;
            } else if (this.Amount == "") {
                that.snackbarText = "Provide amount..";
                that.snackbar = true;

            } else {
                axios
                    .post("https://chargenowmpesaapi-077f3b4b044f.herokuapp.com/stk", {
                        Phonenumber: this.Phone,
                        amount: this.Amount,
                    })
                    .then(function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            if (response.data.errorCode == "400.002.02") {
                                that.snackbar2 = true;
                                that.snackbarText2 = response.data.errorMessage;

                            } else if (response.data.errorCode == "500.001.1001") {
                                that.snackbar2 = true;
                                that.snackbarText2 = response.data.errorMessage;
                            } else {
                                that.timerEnabled = true;
                                that.snackbar = true;
                                that.snackbarText = response.data.CustomerMessage;
                                that.CheckoutRequestID = response.data.CheckoutRequestID;
                                console.log(that.CheckoutRequestID);
                            }
                        } else if (response.status == 400) {
                            that.snackbar2 = true;
                            that.snackbarText2 = response.data;

                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        that.snackbarText = error;
                        that.snackbar = true;

                    })
                    .then(function () {
                        //---- always executed
                    });
            }
        },

        ////Stk Query////
        StkQuery() {
            let that = this;
            axios
                .post("https://chargenowmpesaapi-077f3b4b044f.herokuapp.com/stk/query", {
                    checkoutRequestId: that.CheckoutRequestID,
                })
                .then(function (response) {
                    console.log(response);
                    if (response.status == 200) {
                        if (response.data.errorCode == "400.002.02") {
                            that.snackbar = true;
                            that.snackbarText = response.data.errorMessage;
                            that.timerCount = 20;

                        } else if (response.data.errorCode == "500.001.1001") {
                            that.snackbar = true;gi
                            that.snackbarText = response.data.errorMessage;
                            that.timerCount = 20;

                        } else {
                            if (response.data.ResultCode == "0") {}
                            that.snackbar2 = true;
                            that.snackbarText = response.data.ResultDesc;
                            that.timerEnabled = false;
                            that.timerCount = 20;

                        }
                    } else if (response.status == 400) {
                        that.snackbar = true;
                        that.snackbarText = response.data;
                        that.timerCount = 20;

                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
    watch: {
    timerEnabled(value) {
      if (value) {
        setTimeout(() => {
          this.timerCount--;
        }, 1000);
      }
    },
    timerCount: {
      handler(value) {
        if (value > 0 && this.timerEnabled) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        } else if (value == 0) {
          this.show6 = false;
          this.Query = true;
          console.log("Done", this.Query);
          this.StkQuery();
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  }
}
</script>
