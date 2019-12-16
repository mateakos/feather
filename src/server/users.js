//const users = {};

async function randomID(users){
    let id = Math.random().toString(36).substring(7);
    while (id in users){
        await Promise.delay(5);
        id = Math.random().toString(36).substring(7);
    }
    return id;
}

// exports.create = async(socket) => {
//     const id = await randomID();
//     users[id] = socket;
//     return id;
// };

// exports.get = id => users[id];

// exports.remove = id => delete users[id];

class Users {
    constructor(){
        this.userlist = {}
        // this.createHandler = this.Create.bind(this);
        // this.getHandler = this.Get.bind(this);
        // this.removeHandler = this.Remove.bind(this);
    }

    async create(socket) {
        const id = await randomID(this.userlist);
        this.userlist[id] = socket;
        return id;
    }
    
    get(id){
        return this.userlist[id];
    }

    remove(id){
        return delete this.userlist[id];
    }
}

export default new Users();