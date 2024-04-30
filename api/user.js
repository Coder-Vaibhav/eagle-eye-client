import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  UpdateCommand,
  PutCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({ region: "ap-south-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const fetchUsers = async (name) => {
  let params;

  if(name){
    params = {
      TableName: "Eagleeye",
      FilterExpression: "#n = :name",
      ExpressionAttributeNames: {
        "#n": "name"
      },
      ExpressionAttributeValues: {
        ":name": name
      }
    };
  }
  else {
    params = {
      ExpressionAttributeNames: { "#name": "name" },
      ProjectionExpression: "id, #name, completed",
      TableName: "Eagleeye",
    };
  }

  const command = new ScanCommand(params);
  const response = await docClient.send(command);

  return response;
};

export const createUpdateUser = async ({ name, configjson }) => {
  const command = new PutCommand({
    TableName: "Eagleeye",
    Item: {
      name,
      configjson
    },
  });

  const response = await docClient.send(command);

  return response;
};

export const updateUsers = async ({ id, name, completed }) => {
  const command = new UpdateCommand({
    TableName: "Eagleeye",
    Key: {
      id,
    },
    ExpressionAttributeNames: {
      "#name": "name",
    },
    UpdateExpression: "set #name = :n, completed = :c",
    ExpressionAttributeValues: {
      ":n": name,
      ":c": completed,
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);

  return response;
};

export const deleteUsers = async (id) => {
  const command = new DeleteCommand({
    TableName: "Eagleeye",
    Key: {
      id,
    },
  });

  const response = await docClient.send(command);

  return response;
};
