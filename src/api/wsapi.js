import axios from "axios";

const headers = {
  zsessionid: process.env.API_KEY,
  "Content-Type": "application/json",
};

const workspace = "12352608129"; //"NMDS"
const project = "16662089077"; //"a project 0"
const wsapiUrl = "https://rally1.rallydev.com/slm/webservice/v2.0";
//https://rally1.rallydev.com/slm/webservice/v2.0/workspace/48689019490/projects
const projectsUrl = `${wsapiUrl}/workspace/${workspace}/projects`;

export const getProjects = async ({ queryKey }) => {
  const params = {
    fetch: "Name,ObjectID,Parent,Children",
  };
  const { data } = await axios.get(projectsUrl, {
    params,
    headers,
  });
  return data;
};

//const type = "PortfolioItem/Feature";
//const type = "PortfolioItem/Initiative";

export const piTypes = {
  "PortfolioItem/Theme": "PortfolioItem/Initiative",
  "PortfolioItem/Initiative": "PortfolioItem/Feature",
};

export const getAllItems = async (piType, startDate, endDate) => {
  /*
  (((PlannedStartDate >= 2022-04-01) AND (PlannedEndDate <= 2022-12-31)) AND (Project.ObjectID = 16662089077))
  */

  const shortType = piType.split("/")[1];
  const url = `${wsapiUrl}/${piType}`;
  const params = {
    workspace: `/workspace/${workspace}`,
    query: `(((PlannedStartDate >= ${startDate}) AND (PlannedEndDate <= ${endDate})) AND (Project.ObjectID = ${project}))`,
    fetch:
      "ObjectID,Name,PlannedStartDate,PlannedEndDate,Project,FormattedID,PercentDoneByStoryPlanEstimate",
  };

  const { data } = await axios.get(url, {
    headers: headers,
    params: params,
  });
  return data.QueryResult.Results;
};

export const getChildren = async (piType, ref) => {
  if (!piType) return;
  const shortType = piType.split("/")[1];
  const url = `${wsapiUrl}/${piType}`;
  const parent = `(Parent = ${ref})`;
  const params = {
    workspace: `/workspace/${workspace}`,
    query: parent,
    fetch:
      "ObjectID,Name,PlannedStartDate,PlannedEndDate,Project,FormattedID,PercentDoneByStoryPlanEstimate",
  };

  const { data } = await axios.get(url, {
    headers: headers,
    params: params,
  });
  return data.QueryResult.Results;
};

export const getItem = async ({ queryKey }) => {
  const [key, { objectid }] = queryKey;
  const itemUrl = `${wsapiUrl}/${type}/${objectid}`;
  const params = {
    fetch:
      "ObjectID,Name,PlannedStartDate,PlannedEndDate,PercentDoneByStoryPlanEstimate",
  };

  const { data } = await axios.get(itemUrl, {
    headers: headers,
    params: params,
  });
  return data[shortType];
};

export const updateItem = async ({ objectid, ...payload }) => {
  console.log("updateItem", payload);
  const itemUrl = `${wsapiUrl}/${type}/${objectid}`;
  await axios.post(
    itemUrl,
    {
      [type]: payload,
    },
    {
      method: "PUT",
      headers: headers,
    }
  );
};

export const deleteItem = async (objectid) => {
  const itemUrl = `${wsapiUrl}/${type}/${objectid}`;
  await axios.delete(itemUrl, {
    method: "DELETE",
    headers: headers,
  });
  return true;
};

export const createItem = async (payload) => {
  const createUrl = `${wsapiUrl}/${type}/create`;
  const augmentedPayload = {
    ...payload,
    Workspace: `workspace/${workspace}`,
    Project: `project/${project}`,
  };
  const response = await axios.post(
    createUrl,
    {
      type: augmentedPayload,
    },
    {
      method: "POST",
      headers: headers,
    }
  );
  return response;
};