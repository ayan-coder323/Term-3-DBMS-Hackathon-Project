import Tasks from "../models/task.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const SECRETE_KEY = process.env.SECRETE_KEY;

export async function createTask(data, token) {
        console.log("DATA:", data);
    console.log("TOKEN:", token);
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        console.log(payload)
        data.createdby =  payload.crid;
        await Tasks.create(data);
        return {code: 200, message: "New task has been created"};
    } catch (error) {
        return {code: 500, message: error.message};
    }
}

export async function getAllTasks(page, size, token){
    let response;
    try{
        const payload = jwt.verify(token, SECRETE_KEY); // Authorization
        const skip = (page - 1) * size;
        const tasks = await Tasks.find({createdby: payload.crid})
                                       .skip(skip)
                                       .limit(size)
                                       .sort({_id: 1});
        const totalrecords = await Tasks.countDocuments({createdby: payload.crid});
        response = {code: 200, page: page, size: size, totalpages: Math.ceil(totalrecords/size), tasks: tasks};
    } catch (e) {
        response = {code: 500, message: e.message};
    }
    return response;
}

export async function deleteTask(id, token)
{
    let response;
    try{
        const payload = jwt.verify(token, SECRETE_KEY); //Autorization

        await Tasks.findOneAndDelete({_id: id});

        response = {code: 200, message: "Task has been deleted"};
    }catch(e)
    {
        response = {code: 500, message: e.message};
    }
    return response;
}

export async function getTask(id, token) {
    try {
        const payload = jwt.verify(token, SECRETE_KEY);
        const task = await Tasks.findOne({ _id: id, createdby: payload.crid });

        if (!task)
            return { code: 404, message: "Task not found" };

        return { code: 200, task };
    } catch (e) {
        return { code: 500, message: e.message };
    }
}


export async function updateTask(id, data, token) {
  let response;
  try {
    const payload = jwt.verify(token, SECRETE_KEY, { algorithms: ["HS384"] });

    const updated = await Tasks.findOneAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      response = { code: 404, message: "Task not found" };
    } else {
      response = { code: 200, message: "Task has been updated", task: updated };
    }
  } catch (e) {
    response = { code: 500, message: e.message };
  }
  return response;
}