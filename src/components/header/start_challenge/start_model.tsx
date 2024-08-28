// start_model.tsx
'use client';
import { useState } from 'react';
import { useContextSafely } from '../../../../../../8by8-challenge2/src/hooks/use-context-safely';
import { HeaderContext } from '../../../../../../8by8-challenge2/src/components/header/header-context';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { Modal } from '../../../../../../8by8-challenge2/src/components/utils/modal';
import styles from './styles.module.scss';

export function StartChallengeModal() {
  const { isStartChallengeModalShown, setIsStartChallengeModalShown, closeStartChallengeModal } = useContextSafely(
    HeaderContext,
    'StartChallengeModal',
  );
  const { restartChallenge} = useContextSafely(UserContext, 'StartChallengeModal');
  const { showAlert } = useContextSafely(AlertsContext, 'StartChallengeModal');
  const [isStartingChallenge, setIsStartingChallenge] = useState(false);

  return (
    <Modal
      ariaLabel="Are you sure you want to start the challenge?"
      theme="dark"
      isOpen={isStartChallengeModalShown}
      closeModal={() => {
        if (!isStartingChallenge) {
          closeStartChallengeModal();
        }
      }}
    >
      {isStartingChallenge ? 
        <p className="b2">Starting challenge...</p>
      : <>
          <p className="b1">Are you sure you want to start the challenge?</p>
          <button
            className={styles.btn_top}
            onClick={async () => {
              setIsStartingChallenge(true);

              try {
                await restartChallenge
                ();
              } catch (e) {
                showAlert('There was a problem starting the challenge.', 'error');
              }

              closeStartChallengeModal();
              setIsStartingChallenge(false);
            }}
          >
            <span>Yes, let's do it!</span>
          </button>
          <button className={styles.btn_bottom} onClick={closeStartChallengeModal}>
            <span>No, maybe later</span>
          </button>
        </>
      }
    </Modal>
  );
}