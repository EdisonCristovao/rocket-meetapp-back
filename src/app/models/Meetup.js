import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';
import * as _ from 'lodash';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        date_time: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date_time, new Date());
          },
        },
      },
      { sequelize }
    );

    return this;
  }

  isOwner(userId) {
    return _.isEqual(this.user_id, userId);
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'file' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Meetup;
