print("InitDB Script Started");

db = db.getSiblingDB("ugram");

db.createCollection("users");
db.createCollection("photos");
db.createCollection("likes");
db.createCollection("comments");
db.createCollection("rooms");