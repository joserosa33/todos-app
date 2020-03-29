const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');
const todo = require('../mock-data/todo.json');

/*
Mocks
 */
jest.mock('../../model/todo.model');

const todoId = '5e7f883285abf5140f3d1587';

let req, res, next;
beforeEach(()=> {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('TodoController.getTodoById', () => {
    beforeEach(() => {
        req.params.todoId = todoId;
    });

    it('should have a getTodoById function', () => {
        expect(typeof TodoController.getTodoById).toBe('function');
    });

    it('should call TodoModel.findById with route parameters', async () => {
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toHaveBeenCalledWith(todoId);
    });

    it('should return response with status 200 and json body', async () => {
        TodoModel.findById.mockReturnValue(todo);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(todo);
    });

    it('should return response with status 404 when item doesnt exists', async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error finding by id'};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findById.mockReturnValue(rejectedPromise);
        
        await TodoController.getTodoById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('TodoController.getTodos', () => {
    it('should have a getTodos function', () => {
        expect(typeof TodoController.getTodos).toBe('function');
    });

    it('should call TodoModel.find({})', async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    });

    it('should return response with status 200 and all todos', async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error finding'};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.find.mockReturnValue(rejectedPromise);
        
        await TodoController.getTodos(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('TodoController.updateTodo', () => {
    beforeEach(() => {
        req.params.todoId = todoId;
        req.body = newTodo;
    });

    it('should have a updateTodo function', () => {
        expect(typeof TodoController.updateTodo).toBe('function');
    });

    it('should update with TodoModel.findByIdAndUpdate', async () => {
        await TodoController.updateTodo(req, res, next);
        expect(TodoModel.findByIdAndUpdate).toHaveBeenLastCalledWith(
            todoId,
            newTodo,
            {
                new: true,
                useFindAndModify: false
            });
    });

    it('should return a response with json data and http code 200', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it('should return response with status 404 when item doesnt exists', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error finding'};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

        await TodoController.updateTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    });
});

describe('TodoController.createTodo', () => {
    beforeEach(() => {
        req.body = newTodo;
    });

    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function');
    });

    it('should call TodoModel.Create', ()=> {
        TodoController.createTodo(req, res, next);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });

    it('should return 201 response code', async ()=> {
        await TodoController.createTodo(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return json body in response', async () => {
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Done property missing'};
        const rejectedPromise = Promise.reject(errorMessage);

        TodoModel.create.mockReturnValue(rejectedPromise);
        
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});