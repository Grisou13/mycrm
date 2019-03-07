export class EventEmmiter{
    /**
     * String representing the entity the emmiter is for
     * User, AuthToken, etc...
     * @var string
     */
    entity;

    constructor(client, entity){
        this.client = client;
        this.entity = entity;
    }
    emit(event, id, data){
        this.client.emit(event, {
            ressource: this.entity,
            _id: id,
            timestamp: Date.now(),
            payload: data
        })
    }
}

export class EventRecevier{
    
}