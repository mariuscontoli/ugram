export interface Hashtag {
  tag: string;
}

export interface Mentions {
  name: string;
}

export interface UserBar {
  id: number;
  username: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  registrationDate: string;
  photos: Post[]
}

export interface Message {
  senderUserId: number,
  message: string
}

export interface Post {
  uuid: string,
  ownerId: number,
  photoUrl: string,
  creationDate: Date,
  lastUpdated: Date,
  description: string,
  keywords: string[],
  mentions: string[],
  likes: Like[],
  comments: Comment[],
}

export interface Like {
  userId: number,
  date: Date,
}

export interface Comment {
  userId: number,
  authorUsername: string,
  createdAt: Date,
  content: string,
  uuid: string,
}

export interface UserBar {
  id: number,
  username: string,
  photoUrl: string
}

export interface GoogleInfos {
  iss: string, // The JWT's issuer
  nbf:  number,
  aud: string,
  sub: string, // The unique ID of the user's Google Account
  hd: string, // If present, the host domain of the user's GSuite email address
  email: string, // The user's email address
  email_verified: true, // true, if Google has verified the email address
  azp: string,
  name: string,
                            // If present, a URL to user's profile picture
  picture: string,
  given_name: string,
  family_name: string,
  iat: number, // Unix timestamp of the assertion's creation time
  exp: number, // Unix timestamp of the assertion's expiration time
  jti: string
}
