// inserts some connected city data

db.cities.insert([
{ "_id" : "A", "routes" : [ { "city" : "B", "d" : 3 }, { "city" : "D", "d" : 7 }, { "city" : "E", "d" : 6 } ] },
{ "_id" : "B", "routes" : [ { "city" : "A", "d" : 3 }, { "city" : "D", "d" : 6 }, { "city" : "C", "d" : 5 } ] },
{ "_id" : "C", "routes" : [ { "city" : "B", "d" : 5 }, { "city" : "D", "d" : 2 }, { "city" : "F", "d" : 9 } ] },
{ "_id" : "D", "routes" : [ { "city" : "A", "d" : 7 }, { "city" : "B", "d" : 6 }, { "city" : "C", "d" : 2 }, { "city" : "E", "d" : 8 }, { "city" : "F", "d" : 10 } ] },
{ "_id" : "E", "routes" : [ { "city" : "A", "d" : 6 }, { "city" : "D", "d" : 8 }, { "city" : "F", "d" : 6 } ] },
{ "_id" : "F", "routes" : [ { "city" : "C", "d" : 9 }, { "city" : "D", "d" : 10 }, { "city" : "E", "d" : 6 } ] }
]);