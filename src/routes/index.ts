import * as Express from 'express';

import { checkRectangleRelations } from 'routes/rectangles';

export const initRoutes = (app: Express.Application) => {
	app.post('/api/v1/check-rectangles-relation', checkRectangleRelations);
};
