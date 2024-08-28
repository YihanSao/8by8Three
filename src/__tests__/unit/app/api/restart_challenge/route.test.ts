import { PUT } from '@/app/api/restart_challegnge/route';
import { NextRequest } from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { Builder } from 'builder-pattern';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import type { Auth } from '@/services/server/auth/auth';
import type { UserRepository } from '@/services/server/user-repository/user-repository';
import type { User } from '@/model/types/user';
import type { Avatar } from '@/model/types/avatar';
import type { Badge } from '@/model/types/badge';
import type { ActionBadge } from '@/model/types/action-badge';
import { Actions } from '@/model/enums/actions';
import { UserType } from '@/model/enums/user-type';

describe('PUT /restart_challenge', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it(`returns a status code of 200 and the new challenge end timestamp if the user was successfully authorized and the challenge was restarted.`, async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const newTimestamp = Date.now();

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .loadSessionUser((): Promise<User> => {
              return Promise.resolve({
                uid: userId,
                email: 'user@example.com',
                name: 'John Doe',
                avatar: 'https://example.com/avatar.png' as Avatar,
                type: UserType.Challenger,
                completedActions: {
                  electionReminders: true,
                  registerToVote: true,
                  sharedChallenge: true
                },
                badges: [
                  { action: Actions.VoterRegistration } as ActionBadge,
                  { action: Actions.SharedChallenge } as ActionBadge
                ] as Badge[],
                challengeEndTimestamp: newTimestamp,
                completedChallenge: true,
                contributedTo: [
                  { name: 'Jane Doe', avatar: 'https://example.com/avatar2.png' as Avatar }
                ],
                inviteCode: 'INVITE123',
                invitedBy: {
                  inviteCode: 'INVITE456',
                  name: 'Jane Smith',
                  avatar: 'https://example.com/avatar3.png' as Avatar
                }
              });
            })
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.UserRepository.name) {
          return Builder<UserRepository>()
            .restartChallenge(() => {
              return Promise.resolve(newTimestamp);
            })
            .build();
        }

        return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/api/restart_challenge',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
        }),
      },
    );

    const response = await PUT(request);
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.challengeEndTimestamp).toBe(newTimestamp);

    containerSpy.mockRestore();
  });
});