import { Router } from 'express';
import verifyAccessToken from '../../helpers/verifyAccessToken';
import Controller from './user.controller';

const user: Router = Router();
const controller = new Controller();

// Retrieve all Users
user.get('/', verifyAccessToken, controller.findAll);

// Retrieve a Specific User
user.get('/:id', verifyAccessToken, controller.findOne);

// Update a User with Id
user.put('/:id', controller.update);

// Delete a User with Id
user.delete('/:id', controller.remove);


export default user;
