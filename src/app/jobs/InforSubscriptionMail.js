import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'InforSubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    console.log(meetup.date_time, '<-------_<<<<<');

    await Mail.sendEmail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: `Nova inscrição em ${meetup.titulo}`,
      template: 'InforSubscriptionMail',
      context: {
        provider: meetup.user.name,
        event: meetup.titulo,
        subscriber: user.name,
        date: format(
          parseISO(meetup.date_time),
          "'dia' dd 'de' MMMM', às' H:mm'h",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
