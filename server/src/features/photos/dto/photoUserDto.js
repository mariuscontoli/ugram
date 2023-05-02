class PhotoUserDto {
  constructor(photo) {
    this.photoUrl = photo.photoUrl;
    this.description = photo.description;
    this.keywords = photo.keywords;
    this.mentions = photo.mentions;
    this.uuid = photo.uuid;
    this.creationDate = photo.creationDate;
    this.likes = photo.likes;
    this.comments = photo.comments;
  }
}

module.exports = PhotoUserDto;