import { parseISO, isBefore } from 'date-fns';

import db from '../../database';
import File from '../models/File';
import Meetup from '../models/Meetup';

class MeetupController {
  store = async (req, res) => {
    const { originalname: name, filename: path } = req.file;
    const { date_time } = req.body;

    if (isBefore(parseISO(date_time), new Date()))
      return res.status(400).json({ error: 'Past dates are not permitted' });

    const transaction = await db.connection.transaction();

    try {
      const file = await File.create({ name, path }, { transaction });

      const meetup = await Meetup.create(
        { ...req.body, file_id: file.id, user_id: req.userId },
        { transaction }
      );

      await transaction.commit();

      return res.status(200).json(meetup);
    } catch (err) {
      return res.status(500).json({ error: 'erro na transação' });
    }
  };
}

export default new MeetupController();
