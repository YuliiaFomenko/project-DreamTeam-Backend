import createHttpError from "http-errors";
import { ENV_VARS } from "../constants/envVars.js";
import { getEnvVar } from "./getEnvVar.js";
import { saveFileToCloudinary } from "./saveFileToCloudinary.js";
import { saveFileToLocal } from "./saveFileToLocal.js";

export const saveFile = async (file) => {
  if (getEnvVar(ENV_VARS.FILE_SAVING_STRATEGY) === 'cloudinary'){
    return await saveFileToCloudinary(file);
  } else if (getEnvVar(ENV_VARS.FILE_SAVING_STRATEGY) === 'local'){
    return await saveFileToLocal(file);
  }

  throw createHttpError('Unknown file storage policy');
};