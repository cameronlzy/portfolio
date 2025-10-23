import qs from "qs";
import { MONGO_REGEX, EXCLUDED_QUERIES } from "../constants/queryConstants.js";
import { filterObject } from "./filterObject.js";
import { operatorReplace } from "./operatorReplace.js";

class APIFeatures {
  constructor(query, queryString, aliasOptions, originalUrl) {
    this.query = query;
    this.queryString = queryString;
    this.aliasOptions = aliasOptions;
    this.originalUrl = originalUrl;
  }

  filter() {
    const rawQuery = this.originalUrl.split("?")[1] || "";
    const parsedQuery = qs.parse(rawQuery);
    const queryObj = filterObject(parsedQuery, EXCLUDED_QUERIES);
    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(MONGO_REGEX, operatorReplace);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sortRaw = this.aliasOptions?.sort || this.queryString.sort;

    if (sortRaw) {
      const sortBy = sortRaw.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    const fieldsRaw = this.aliasOptions?.fields || this.queryString.fields;

    if (fieldsRaw) {
      const selectedFields = fieldsRaw.split(",").join(" ");
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const limitRaw = this.aliasOptions?.limit || this.queryString.limit;
    const page = this.queryString.page * 1 || 1;
    const normalisedLimit = limitRaw * 1 || 100;
    const skip = (page - 1) * normalisedLimit;

    this.query = this.query.skip(skip).limit(normalisedLimit);

    return this;
  }

  implementFeatures() {
    return this.filter().sort().limitFields().paginate();
  }
}

export default APIFeatures;
