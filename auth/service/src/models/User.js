/**
 * User model
 */
export default class User{
    static build(data){
        console.log("BUILDING USER")
        console.log(data)
        let user =  new User()
        user._id        = data._id || null;
        user.username   = data.username || null;
        user.email      = data.email    || null;
        user.user_id    = data.user_id  || null;
//        user.password   = data.password || null;
        user.role       = data.role     || null;
        user.locked     = typeof data.locked != "undefined" ? data.locked :  true;
        return user;
    }
}