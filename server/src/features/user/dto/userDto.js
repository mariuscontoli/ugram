class UserDto {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.photoUrl = user.photoUrl ? user.photoUrl : "";
    }
}

module.exports = UserDto;