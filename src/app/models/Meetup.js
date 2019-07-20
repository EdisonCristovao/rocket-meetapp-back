import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        date_time: Sequelize.DATE,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'file' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Meetup;
