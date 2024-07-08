'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import AccountDeleteForm from '@/components/AccountDeleteForm';
import Modal from '@/components/Modal';
import { getProfile } from '@/supabase/models/getProfile';
import deleteProfile from '@/supabase/models/deleteProfile';
import newClient from '@/supabase/utils/newClient';

export default function DeleteAccount() {
  const [loggedUser, setLoggedUser] = useState('');
  const [userId, setUserId] = useState<undefined | string>(undefined);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      const supabase = newClient();
      try {
        const { data: userData } = await supabase.auth.getSession();
        setUserId(userData.session?.user.id);
      } catch (error) {
        console.error(`Error getting session: ${error}`);
      }

      if (userId) {
        const userName = await getProfile(userId as string);
        setLoggedUser(userName.data.username);
      }
    };

    getUserId();
  }, [setLoggedUser, setUserId, userId]);

  const formSubmitHandler = () => {
    setIsConfirmed(true);
  };

  const accountDeleteHandler = () => {
    const deleteUser = async () => {
      if (userId !== undefined) {
        try {
          await deleteProfile(userId);
          router.push('/');
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    };

    deleteUser();
  };

  return (
    <div className='flex flex-col  items-center  px-8'>
      <AccountDeleteForm
        currentUserName={loggedUser}
        submitHandler={formSubmitHandler}
      />

      <Modal
        name='Delete Profile'
        message='Confirming will delete your profile permanently. Are you sure you want to continue?'
        targetId={userId as string}
        onDeleteSuccess={accountDeleteHandler}
        isDisabled={!isConfirmed}
      />
    </div>
  );
}
