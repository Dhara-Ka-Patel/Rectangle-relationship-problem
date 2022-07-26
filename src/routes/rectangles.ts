import * as Express from 'express';

export const checkRectangleRelations = (req: Express.Request, res: Express.Response) => {
	const body: RectangleRequest = req.body;
    const MIN_LIMIT : number = 0;
    const MAX_LIMIT : number = 100;
    console.log('Request body:' + body.toString());

    // check if request format is valid
    if (body.rectangle1 == null || 
        body.rectangle1.length !== 2 || 
        body.rectangle2 == null || 
        body.rectangle2.length !== 2 || 
        body.rectangle1[0] == null ||
        body.rectangle1[0].length !== 2 ||
        body.rectangle1[1] == null ||
        body.rectangle1[1].length !== 2 ||
        body.rectangle2[0] == null ||
        body.rectangle2[0].length !== 2 ||
        body.rectangle2[1] == null ||
        body.rectangle2[1].length !== 2) {

        res.statusMessage = 'Please send valid rectangle data!';
        res.status(400).end();
    }

    // fetch x, y cordinates of rectangle
    const rectangle1Point1 : Vertex = {
        x: body.rectangle1[0][0],
        y: body.rectangle1[0][1],
    };

    const rectangle1Point2 : Vertex = {
        x: body.rectangle1[1][0],
        y: body.rectangle1[1][1],
    };

    const rectangle2Point1 : Vertex = {
        x: body.rectangle2[0][0],
        y: body.rectangle2[0][1],
    };

    const rectangle2Point2 : Vertex = {
        x: body.rectangle2[1][0],
        y: body.rectangle2[1][1],
    };

    // check if vertex are valid
    if (rectangle1Point1.x >= MIN_LIMIT && rectangle1Point1.x <= MAX_LIMIT && 
        rectangle1Point1.y >= MIN_LIMIT && rectangle1Point1.y <= MAX_LIMIT && 
        rectangle1Point2.x >= MIN_LIMIT && rectangle1Point2.x <= MAX_LIMIT && 
        rectangle1Point2.y >= MIN_LIMIT && rectangle1Point2.y <= MAX_LIMIT && 
        rectangle2Point1.x >= MIN_LIMIT && rectangle2Point1.x <= MAX_LIMIT && 
        rectangle2Point1.y >= MIN_LIMIT && rectangle2Point1.y <= MAX_LIMIT && 
        rectangle2Point2.x >= MIN_LIMIT && rectangle2Point2.x <= MAX_LIMIT && 
        rectangle2Point2.y >= MIN_LIMIT && rectangle2Point2.y <= MAX_LIMIT &&
        rectangle1Point1.x < rectangle1Point2.x && 
        rectangle1Point1.y < rectangle1Point2.y &&
        rectangle2Point1.x < rectangle2Point2.x && 
        rectangle2Point1.y < rectangle2Point2.y) {
            console.log('rectangle1 point 1: ' + rectangle1Point1.x + ', ' + rectangle1Point1.y);
            console.log('rectangle1 point 2: ' + rectangle1Point2.x + ', ' + rectangle1Point2.y);
            console.log('rectangle2 point 1: ' + rectangle2Point1.x + ', ' + rectangle2Point1.y);
            console.log('rectangle2 point 2: ' + rectangle2Point2.x + ', ' + rectangle2Point2.y);
        
            // check for adjacency, intersection & containment
            const rectResponse : RectangleResponse = {
                adjacency: checkAdjacency(
                    rectangle1Point1,
                    rectangle1Point2, 
                    rectangle2Point1,
                    rectangle2Point2,
                ), 
                containment: checkContainment(
                    rectangle1Point1,
                    rectangle1Point2, 
                    rectangle2Point1,
                    rectangle2Point2,
                ), 
                intersection: checkIntersection(
                    rectangle1Point1,
                    rectangle1Point2, 
                    rectangle2Point1,
                    rectangle2Point2,
                ),  
            };
            res.send({ 
                ...rectResponse,
            });
        } else {
            res.statusMessage = 'Please send valid rectangle points data!';
            res.status(400).end();
        }

    
};

const checkIntersection = (r1p1: Vertex, r1p2: Vertex, r2p1: Vertex, r2p2: Vertex) => {
    console.log('checkIntersection:');

    // check if they don't intersect horizontally
    if (r1p1.y > r2p2.y 
      || r1p2.y < r2p1.y) {
        return 'Both Rectangles does not intersect.';
    }

    // check if they don't intersect vertically
    if (r1p1.x > r2p2.x 
      || r1p2.x < r2p1.x) {
        return 'Both Rectangles does not intersect.';
    }
    
    // check if they don't contain other one
    if (checkContainment(r1p1, r1p2, r2p1, r2p2) !== 'No rectangle contains another rectangle.') {
        return 'Both Rectangles does not intersect.';
    }

    // return that they intersect
    return 'Both Rectangles intersects.';
};

const checkAdjacency = (r1p1: Vertex, r1p2: Vertex, r2p1: Vertex, r2p2: Vertex) => {
    console.log('checkAdjacency:');

    // horizontally adjacent
	if (r1p1.x === r2p1.x || 
        r1p1.x === r2p2.x || 
        r1p2.x === r2p1.x || 
        r1p2.x === r2p2.x) {
            return 'Both Rectangles are adjacent to each other.';
        }

	// vertically adjacent
	if (r1p1.y === r2p1.y || 
        r1p1.y === r2p2.y || 
        r1p2.y === r2p1.y || 
        r1p2.y === r2p2.y) {
           return 'Both Rectangles are adjacent to each other.';
        }

    return 'Both Rectangles are not adjacent.';
};

const checkContainment = (r1p1: Vertex, r1p2: Vertex, r2p1: Vertex, r2p2: Vertex) => {
    console.log('checkContainment:');

    // rectangle 2 is inside rectangle 1
	if (r1p1.x <= r2p1.x && 
        r1p1.y <= r2p1.y && 
        r1p2.x >= r2p2.x && 
        r1p2.y >= r2p2.y) 
        return 'Rectangle 2 is inside rectangle 1.';

	// rectangle 2 is inside rectangle 1
	if (r2p1.x <= r1p1.x && 
        r2p1.y <= r1p1.y && 
        r2p2.x >= r1p2.x && 
        r2p2.y >= r1p2.y) 
        return 'Rectangle 1 is inside rectangle 2.';

	return 'No rectangle contains another rectangle.';
};
