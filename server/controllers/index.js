module.exports = {
    search: require('./search/search'),
    signup: require("./sign/signup"),
    signin: require("./sign/signin"),
    signout: require("./sign/signout"),
    withdrawal: require("./sign/withdrawal"),
    /*-----------------------------------------------------------------*/
    emailCode: require("./sign/emailCode"),
    emailVerification: require("./sign/emailVerification.js"),
    // /*-----------------------------------------------------------------*/
    // googleSignin: require("./google/signin"),
    // googleWithdrawal: require("./google/withdrawal"),
    /*-------------------------------------------------*/
    updateUserInfo: require("./mypage/updateUserInfo"),
    getUserInfo: require("./mypage/getUserInfo"),
    getFavorites: require("./mypage/getFavorites"),
    /*-------------------------------------------------*/
    createFavorites: require("./search/createFavorites"),
    cancelFavorites: require("./search/cancelFavorites"),
}