import Sequelize from 'sequelize';
import * as _ from 'lodash';

import User from '../app/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    _.map(models, model => model.init(this.connection));
  }
}

export default new Database();
