import { useRouter } from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      console.log('ticket detail - order: ', order);
      router.push('/orders/[orderId]', `/orders/${order.id}`)
    }
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>price: {ticket.price}</h4>
      {errors}
      <button onClick={()=> doRequest()} className="btn btn-primary">
        purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`); //file is called tickets/src/routes/show.ts
  return { ticket: data };
};

export default TicketShow;
