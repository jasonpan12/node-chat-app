[{
  id: 'o;32j2ro',
  name: 'Andrew',
  room: 'wowspin'
}]

// add user via add user method
// take id, name, Room

// remove user when they leave
// by idea

// get user method, takes id, returns object above

// get user list takes room name and figures out which users are in it

class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    // filter whole array down to users that have the room
    var users = this.users.filter((user) => user.room === room); // equivalent to {return user.room === room}

    // return user only
    var namesArray = users.map( (user) => user.name);

    return namesArray;
  }
}

module.exports = {Users};

// class Person {
//   constructor(name, age) { // gets called by default
//     this.name = name;
//     this.age = age; // this customizes the individual instance
//   }
//   getUserDescription () {
//     return `${this.name} is ${this.age} year(s) old`
//   }
// }
//
// var me = new Person('andrew', 25);
// var description = me.getUserDescription();
// console.log(description);
