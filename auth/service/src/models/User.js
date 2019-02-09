/**
 * User model
 */
export default class User{
    static build(data){
        let user =  new User()
        user._id        = data._id || null
        user.username   = data.username || null;
        user.email      = data.email    || null;
        user.user_id    = data.user_id  || null;
        user.password   = data.password || null;
        return user;
    }
}