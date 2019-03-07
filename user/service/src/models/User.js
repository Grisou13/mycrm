import Role from './Role'
export default class User{
    _id;
    username;
    email;
    deleted;
    created_at;
    updated_at;
    

    static build(data){
        let user =  new User()
        user._id        = data._id || null
        user.username   = data.username || null;
        user.email      = data.email    || null;
        user.deleted    = data.deleted  || null;
        user.role       = data.role ? Role.build(data.role) : null;
        return user;
    }
}