export default class Role{
    static build(data){
        let role = new Role();
        role.name       =   typeof data == 'object' ? data.name : data || null;
        return role;
    }
}