import Sequelize from 'sequelize';
import * as _ from 'lodash';

import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import Subscription from '../app/models/Subscription';

import databaseConfig from '../config/database';

const models = [User, File, Meetup, Subscription];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    _.map(models, model => model.init(this.connection));

    _.map(
      models,
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
