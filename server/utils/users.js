

class User {
    constructor(id,name,room) {
        this.id = id;
        this.name = name;
        this.room = room;
    }
}

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id,name,room) {
        const user = new User(id,name,room);
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        const user = this.getUser(id);
        if (user) {
            this.users = this.users.filter(user => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        const user = this.users.filter(user => user.id === id);
        return user;
    }

    getUsersList(room) {
        const users = this.users.filter(user => user.room === room);
        const usersNames = users.map(user => user.name);

        return usersNames;
    }
}

module.exports = {Users};