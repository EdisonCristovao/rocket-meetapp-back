import Sequelize from 'sequelize';
import * as _ from 'lodash';

import User from '../app/models/User';
import File from '../app/models/File';
import databaseConfig from '../config/database';

const models = [User, File];

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
