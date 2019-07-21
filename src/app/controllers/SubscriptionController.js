import * as _ from 'lodash';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

class SubscriptionController {
  store = async (req, res) => {
    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

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
      return res.status(400).json({ error: 'You already subscribe' });

    const checkSameDate = await Subscription.findOne({
      where: { user_id: req.userId },
      include: [{ model: Meetup, as: 'meetup' }],
    });

    console.log(checkSameDate);

    const subscription = await Subscription.create({
      meetup_id,
      user_id: req.userId,
    });

    return res.status(200).json(subscription);
  };
}

export default new SubscriptionController();
