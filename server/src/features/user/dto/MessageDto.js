class MessageDto {
    constructor(message, userId) {
        this.text = message;
        this.time = new Date();
        this.sentBy = userId;
    }
}

module.exports = MessageDto;