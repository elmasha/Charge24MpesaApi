<template>
<v-container>
    <v-row justify="center" align="center">

        <v-col cols="12" sm="12" md="12">

            <v-card color="white" flat height="200px" tile>
                <v-toolbar elevation="0" extended extension-height="90">

                    <nuxt-link class="nuxt-link" to="/">
                        <v-img style="margin-top:10px" :src="logo" contain height="100" max-width="150"> </v-img>
                    </nuxt-link>

                    <v-spacer></v-spacer>

                    <div style="margin-top:40px">
                        <v-btn text small>
                            <v-icon>mdi-lock</v-icon><span>Secure form</span>
                        </v-btn>
                        <br>
                        <p class="text-center" style="font-size:0.7rem; color:rgb(122, 122, 120)">Your data is protected,<br />everything will be private</p>
                    </div>

                </v-toolbar>

                <v-container>
                    <v-row justify="center" align="center">

                        <v-col cols="12" sm="12" md="12">
                            <div id="charter">
                                <div class="container">
                                    <h2>Payment details</h2>
                                </div>
                                <div class="container">

                                    <p style="font-size:medium">
                                        In order to use our power bank, a refundable deposit will be required. This deposit is necessary to ensure the safe and efficient operation of our power bank rental program. <br>
                                        Here are some key details regarding the deposit:

                                        <br>
                                        <strong>Deposit Amount: Ksh 1500</strong><br>
                                        <!-- Your deposit will be refundable upon the return of the power bank in good condition and within the agreed-upon timeframe. -->
                                    </p>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <br>
                            <v-container>

                                <div class="d-flex">
                                    <v-spacer></v-spacer>
                                    <div class="col-md-6">
                                        <v-form ref="form" v-model="valid" lazy-validation>
                                            <v-text-field disabled v-model="Amount" :rules="nameRules" label="Deposit Amount" required></v-text-field>

                                            <v-text-field v-model="Phone" outlined rounded clearable type="phone" :rules="nameRules" label="Provide Mpesa number" placeholder="2547 34-3400-7734" required></v-text-field>

                                            <!--  -->
                                            <v-btn color="success" block class="mr-4 text-caption" @click="MpesaPaymentStk">
                                                Request StkPush
                                            </v-btn>
                                            <div class="container">
                                                <v-progress-linear color="green accent-4" v-show="show6" indeterminate rounded height="6"></v-progress-linear>
                                            </div>
                                            <div class="container">
                                                <div class="text--green" v-show="snackbar" style="color:green">{{successResponse}}</div>
                                                <div class="text--green" v-show="snackbar2" style="color:red">{{errorResponse}}</div>
                                            </div>

                                        </v-form>
                                    </div>

                                    <v-spacer></v-spacer>
                                </div>
                            </v-container>

                        </v-col>
                    </v-row>

                </v-container>

            </v-card>

        </v-col>

        <v-snackbar color="primary accent-8" :timeout="6000" v-model="snackbar_s" centered bottom>
            {{ snackbarText_s }}
        </v-snackbar>
        <v-snackbar color="success" :timeout="2000" v-model="snackbar" outlined center>
            {{ snackbarText }}
        </v-snackbar>
        <v-snackbar color="error" :timeout="3000" v-model="snackbar2" outlined center>
            {{ snackbarText2 }}
        </v-snackbar>
    </v-row>
</v-container>
</template>

<script>
import axios from "axios";
import dayjs from '@nuxtjs/dayjs';
import fire from '@nuxtjs/firebase';
import moment from 'moment';

import {
    uuid
} from "vue-uuid";

export default {
    name: 'IndexPage',
    data() {
        return {
            logo: require('@/assets/logo.PNG'),
            bg: require('@/assets/bg.png'),
            errorResponse: "",
            successResponse: "",
            Amount: "1500",
            Phone: null,
            UserName: "",
            snackbar_s: false,
            snackbarText_s: "",
            snackbar: false,
            snackbar2: false,
            snackbarText: "",
            snackbarText2: "",
            status: false,
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

            if (this.Phone == null) {
                that.snackbarText = "Provide phone number..";
                that.snackbar = true;
            } else if (this.Amount == "") {
                that.snackbarText = "Provide amount.";
                that.snackbar = true;

            } else {
                that.show6 = true;
                axios
                    .post("https://chargenowmpesaapi-077f3b4b044f.herokuapp.com/stk", {
                        Phonenumber: this.Phone,
                        amount: "1",
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
                        console.log("Done stk", );

                    });
            }
        },
        ////Stk Query////
        StkQuery() {

            let that = this;
            that.snackbar_s = true;
            that.snackbarText_s = "Checking payment status...";
            axios
                .post("https://chargenowmpesaapi-077f3b4b044f.herokuapp.com/stk/query", {
                    checkoutRequestId: that.CheckoutRequestID,
                })
                .then(function (response) {
                    console.log("StkPush Query", response.data);
                    if (response.status == 200) {
                        if (response.data.errorCode == "400.002.02") {
                            that.snackbar2 = true;
                            that.snackbarText2 = response.data.errorMessage;
                            that.errorResponse = response.data.errorMessage;
                            that.errorResponse = response.data.errorMessage;
                            that.timerCount = 20;
                            that.timerEnabled = false;
                            that.show6 = false;
                        } else if (response.data.errorCode == "500.001.1001") {
                            that.snackbar2 = true;
                            that.snackbarText2 = response.data.errorMessage;
                            that.errorResponse = response.data.errorMessage;
                            that.timerCount = 20;
                            that.timerEnabled = false;
                            that.show6 = false;
                        } else {
                            if (response.data.ResultCode == "0") {
                                that.snackbar = true;
                                that.snackbarText = response.data.ResultDesc;
                                that.successResponse = response.data.ResultDesc;
                                that.timerEnabled = false;
                                that.timerCount = 20;
                                that.show6 = false;
                                that.loginAnonymously1();
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
                        that.timerEnabled = false;
                        that.show6 = false;

                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.show6 = false;
                    that.snackbar2 = true;
                    that.snackbarText2 = error;
                    that.timerCount = 20;
                    that.timerEnabled = false;
                });
        },
        loginAnonymously1() {
            this.$fire.auth
                .signInAnonymously()
                .catch(function (error) {
                    this.snackbarText = error.message;
                    this.snackbar = true;
                    this.showLogin = false;
                })
                .then((user) => {
                    //we are signed in
                    this.uploadDetails(user.user.uid);
                });

        },
        uploadDetails(val) {
            const db = this.$fire.firestore;
            const start_timer = this.$dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss');
            let ID = uuid.v1();
            console.log(uuid.v1());
            db.collection("charge24_users").doc(val)
                .set({
                    user_id: val,
                    start_time: start_timer,
                    ref: ID,
                    active: true
                }).then(() => {
                    console.log("User logged in");
                    this.$router.push({
                        path: "/timer"
                    });
                })
                .catch(function(error)  {
                    console.log("Error adding document: ", error);

                });
        },
        logout() {
            this.$fire.auth.signOut();
            window.location.reload(true);
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

<style>
#charter {
    transition: 0.5s ease;
    background-image: url("@/assets/bg.png");
    background-attachment: fixed;
    background-position: center;
    background-size: contain;
    width: 100%;
    height: 260px;
}
</style>
