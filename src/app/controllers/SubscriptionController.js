import * as _ from 'lodash';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

import InfoSubscriptionMail from '../jobs/InforSubscriptionMail';
import Queue from '../../lib/Queue';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

class SubscriptionController {
  store = async (req, res) => {
    const { meetup_id } = req.body;

    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(meetup_id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['name', 'email'],
      },
    });

    /**
     * subscribe not own event
     */
    if (meetup.isOwner(req.userId))
      return res
        .status(400)
        .json({ error: 'you can not subscribe in own event' });

    /**
     * subscribe not past event
     */
    if (meetup.past)
      return res
        .status(400)
        .json({ error: 'You cant not subscribe past event' });

    /**
     * verify if user alreadu subscribed
     */
    const alreadySubs = await Subscription.findOne({
      where: { user_id: req.userId, meetup_id: meetup.id },
    });

    if (!_.isEmpty(alreadySubs))
      return res.status(400).json({ error: 'You already subscribed' });

    /**
     * can not subscribe 2 event in same hour
     */
    const checkSameDate = await Subscription.findOne({
      where: { user_id: req.userId },
      include: [
        { model: Meetup, as: 'meetup', where: { date_time: meetup.date_time } },
      ],
    });

    if (!_.isEmpty(checkSameDate))
      return res
        .status(400)
        .json({ error: 'There is other event subscribed in same time' });

    const subscription = await Subscription.create({
      meetup_id,
      user_id: req.userId,
    });

    console.log(await Queue.add(InfoSubscriptionMail.key, { meetup, user }));

    return res.status(200).json(subscription);
  };
}

export default new SubscriptionController();
