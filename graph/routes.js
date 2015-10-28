var c1 = "A";
var c2 = "F";
var cityCount = 6;

var pipeline = [
    { $match : { _id : c1 } },
    { $project : { _id : 0, route : [ "$_id" ], step : { _id : "$_id", routes : "$routes" } } },
    { $unwind : "$step.routes" }
];

// there's no way to conditionally execute the $lookup so we use a dummy end city
// this is brute force using one aggregation pipeline but multiple calls match calls
// using $in will be more optimal
for (var i = 0; i < cityCount; i++) {
    pipeline.push( {
            $project : {
                route : { $concatArrays : [ "$route", [ "$step.routes.city" ] ] },
                distance : { $sum : [ "$distance", "$step.routes.d" ] },
                from : "$step._id",
                to : {
                    $cond : {
                        if : {
                            $or : [ { $eq : [ "$step._id", "end" ] }, { $eq : [ "$step.routes.city", c2 ] } ]
                        },
                        then : { $literal : "end" },
                        else : "$step.routes.city"
                    }
                }

            }
        }
    );

    pipeline.push( { $lookup : { from : "cities", localField : "to", foreignField : "_id", as : "step" } } );
    pipeline.push( { $unwind : "$step" } );
    pipeline.push( {
            $project : {
                route : 1, distance : 1, from : 1, to : 1,
                step : {
                    _id : 1,
                    routes : {   
                        $filter : {
                            input : "$step.routes",
                            as : "route",
                            cond : { $not : [ { $setIsSubset : [ [ "$$route.city" ], "$route" ] } ] }
                        }
                    }
                }
            }
        }
    );

    pipeline.push( { $unwind : { path : "$step.routes", preserveNullAndEmptyArrays : true } } );
}

// sort by distance and take the first one as the shortest                                                                                                                        
pipeline.push( { $sort : { distance : 1 } } );
pipeline.push( { $limit : 1 } );

// strip out the null array route elements                                                                                                                                        
pipeline.push( { $project : { route : { $filter : { input : "$route", as : "city", cond : { $ne : [ "$$city", null ] }  } }, distance : 1 } } );

var routes = db.cities.aggregate(pipeline);

while (routes.hasNext()) {
    printjson(routes.next());
}