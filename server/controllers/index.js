module.exports = {
    search: require('./search/search'),
    signup: require("./sign/signup"),
    signin: require("./sign/signin"),
    signout: require("./sign/signout"),
    withdrawal: require("./sign/withdrawal"),
    /*-----------------------------------------------------------------*/
    socialSignin: require("./social/signin"),
    socialWithdrawl: require("./social/withdrawal"),
    /*-----------------------------------------------------------------*/
    updateUserInfo: require("./mypage/updateUserInfo"),
    getUserInfo: require("./mypage/getUserInfo"),
    getFavorites: require("./mypage/getFavorites"),
    getMyPics: require("./mypage/getMyPics"),
    deleteMyPic: require("./mypage/deleteMyPic"),
    /*-----------------------------------------------------------------*/
    createFavorites: require("./search/createFavorites"),
    cancelFavorites: require("./search/cancelFavorites"),
    /*-----------------------------------------------------------------*/
    savePicture: require("./picture/savePicture")
}