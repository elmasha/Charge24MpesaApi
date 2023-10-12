<template>
<v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="Amount" :counter="10" :rules="nameRules" label="Enter Amount" required></v-text-field>

            <v-text-field v-model="Phone" :rules="nameRules" label="Phone number" placeholder="254 34-3400-7734" required></v-text-field>

            <v-btn color="success" class="mr-4" @click="MpesaPaymentStk">
                StkPush
            </v-btn>
            <div class="container">
                <v-progress-linear color="green accent-4" v-show="show6" indeterminate rounded height="6"></v-progress-linear>
            </div>
            <div class="container">
                <div class="text--green" v-show="snackbar" style="color:green">{{successResponse}}</div>
                <div class="text--green" v-show="snackbar2" style="color:red">{{errorResponse}}</div>
            </div>

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
    <v-snackbar color="success" :timeout="2000" v-model="snackbar" outlined center>
        {{ snackbarText }}
    </v-snackbar>
    <v-snackbar color="error" :timeout="3000" v-model="snackbar2" outlined center>
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
            errorResponse: "",
            successResponse: "",
            Amount: "",
            Phone: null,
            UserName: "",
            snackbar: false,
            snackbar2: false,
            snackbarText: "",
            snackbarText2: "",
            timerEnabled: false,
            show6: false,
            timerCount: 20,
            valid: true,
            name: '',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 20) || 'Name must be less than 10 characters',
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
            CheckoutRequestID: "",
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
                                that.show6 = false;

                            } else if (response.data.errorCode == "500.001.1001") {
                                that.snackbar2 = true;
                                that.snackbarText2 = response.data.errorMessage;
                                that.show6 = false;
                            } else {
                                that.timerEnabled = true;
                                that.snackbar = true;
                                that.snackbarText = response.data.CustomerMessage;
                                that.successResponse = response.data.CustomerMessage;
                                that.CheckoutRequestID = response.data.CheckoutRequestID;
                                console.log(that.CheckoutRequestID);
                            }
                        } else if (response.status == 400) {
                            that.snackbar2 = true;
                            that.snackbarText2 = response.data;
                            that.errorMessage = response.data;
                            that.show6 = false;

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
                    console.log("StkPush Query",response.data);
                    if (response.status == 200) {
                        if (response.data.errorCode == "400.002.02") {
                            that.snackbar2 = true;
                            that.snackbarText2 = response.data.errorMessage;
                            that.errorResponse = response.data.errorMessage;
                            that.errorResponse = response.data.errorMessage;
                            that.timerCount = 20;
                            that.show6 = false;
                        } else if (response.data.errorCode == "500.001.1001") {
                            that.snackbar2 = true;
                            that.snackbarText2 = response.data.errorMessage;
                            that.errorResponse = response.data.errorMessage;
                            that.timerCount = 20;
                            that.show6 = false;
                        } else {
                            if (response.data.ResultCode == "0") {
                                that.snackbar = true;
                                that.snackbarText = response.data.ResultDesc;
                                that.successResponse = response.data.ResultDesc;
                                that.timerEnabled = false;
                                that.timerCount = 20;
                                that.show6 = false;
                            } else {
                                that.snackbar2 = true;
                                that.snackbarText2 = response.data.ResultDesc;
                                that.errorResponse = response.data.ResultDesc;
                                that.timerEnabled = false;
                                that.timerCount = 20;
                                that.show6 = false;
                            }

                        }
                    } else if (response.status == 400) {
                        that.snackbar2 = true;
                        that.snackbarText2 = response.data;
                        that.timerCount = 20;
                        that.show6 = false;

                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.show6 = false;
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
