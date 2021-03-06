import { Op } from 'sequelize';
import { parseISO, isBefore, endOfDay, startOfDay } from 'date-fns';
import User from '../models/User';
import * as _ from 'lodash';

import Meetup from '../models/Meetup';

class MeetupController {
  index = async (req, res) => {
    const { page = 1 } = req.query;
    const where = {};
    const limit = 1;

    if (!_.isEmpty(req.query.date)) {
      const searchDate = parseISO(req.query.date);
      where.date_time = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: { model: User, as: 'user' },
      offset: (page - 1) * limit,
      limit,
    });

    return res.status(200).json(meetups);
  };

  store = async (req, res) => {
    const { date_time } = req.body;

    /**
     * date_time event can not be past dates
     */
    if (isBefore(parseISO(date_time), new Date()))
      return res.status(400).json({ error: 'Past dates are not permitted' });

    const { titulo, descricao, localizacao, past, date } = await Meetup.create({
      ...req.body,
      user_id: req.userId,
    });

    return res.status(200).json({ titulo, descricao, localizacao, past, date });
  };

  update = async (req, res) => {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    /**
     * can not change past dates
     */
    if (meetup.past)
      return res.status(400).json({ error: 'Past events can not be changed' });

    /**
     * can not change not own events
     */
    if (!meetup.isOwner(req.userId))
      return res.status(400).json({ error: 'You have to be event owner' });

    const { titulo, descricao, localizacao, date_time } = await meetup.update(
      req.body
    );

    return res.status(200).json({ titulo, descricao, localizacao, date_time });
  };

  delete = async (req, res) => {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id);

    /**
     * can not delete past dates
     */
    if (meetup.past)
      return res.status(400).json({ error: 'Past events can not be deleted' });

    /**
     * can not delete not own events
     */
    if (!meetup.isOwner(req.userId))
      return res.status(400).json({ error: 'You have to be event owner' });

    await meetup.destroy();

    return res.status(200).json(meetup);
  };
}

export default new MeetupController();
