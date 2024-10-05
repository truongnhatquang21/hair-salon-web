import type { PayOSConfig } from 'payos-checkout';
import { usePayOS } from 'payos-checkout';
import React, { useEffect } from 'react';

import { Loading } from '../loading';

type Props = {
  url: string;
  orderCode: string;
  successTriggerFn: () => void;
};

const PayOs = ({ url, orderCode, successTriggerFn }: Props) => {
  const ELEMENT_ID = `psyOs-${orderCode}`;
  const [payStatus, setPayStatus] = React.useState<
    'success' | 'failed' | undefined
  >(undefined);
  const payOSConfig: PayOSConfig = {
    RETURN_URL:
      process.env.NEXT_PUBLIC_PAYOS_RETURN_URL || 'http://localhost:3000', // required
    ELEMENT_ID, // required
    CHECKOUT_URL: url ?? '', // required
    embedded: true, // Nếu dùng giao diện nhúng
    onSuccess: (event: any) => {
      // TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
      console.log(event);
      setPayStatus('success');
      successTriggerFn();
    },
    onCancel: (event: any) => {
      // TODO: Hành động sau khi người dùng Hủy đơn hàng
      console.log(event);
      setPayStatus('failed');
    },
  };
  const { open } = usePayOS(payOSConfig);

  useEffect(() => {
    open();
  }, []);

  if (payStatus === 'success') {
    return (
      <>
        <div className='text-green-500'>Pay success, please wait a moment</div>
        <Loading />
      </>
    );
  }
  if (payStatus === 'failed') {
    return <div className='text-red-500'>Pay failed, please refresh page</div>;
  }
  return (
    <div className='flex w-full flex-col items-center gap-4'>
      <div id={ELEMENT_ID} className='h-[350px]' />
      <div className='text-yellow-500'>
        If you have payed the order, please wait a moment.
      </div>
    </div>
  );
};

export default PayOs;
