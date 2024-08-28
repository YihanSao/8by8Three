import {
    render,
    screen,
    cleanup,
    waitFor,
    fireEvent,
  } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import { createRef } from 'react';
  import { StartChallengeModal } from 'src/components/header/start_challenge/index';
  import { HeaderContext, type HeaderContextType } from '@/components/header/header-context';
  import { UserContext, type UserContextType } from '@/contexts/user-context';
  import { AlertsContext } from '@/contexts/alerts-context';
  import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
  import { HeaderContextProvider } from '@/components/header/header-context';
  import userEvent, { type UserEvent } from '@testing-library/user-event';
  // Mock the HTMLDialogElement
  class CustomHTMLDialogElement extends HTMLElement {
    open: boolean;
    returnValue: string;
  
    constructor() {
      super();
      this.open = false;
      this.returnValue = '';
    }
  
    showModal() {
      this.open = true;
      this.setAttribute('open', 'true');
    }
  
    close(returnValue = '') {
      this.open = false;
      this.returnValue = returnValue;
      this.removeAttribute('open');
    }
  }
  
  //window.HTMLDialogElement = CustomHTMLDialogElement as any;
  //mocking the window.HTMLDialogElement
  describe('StartChallengeModal', () => {
    let user: UserEvent;
    beforeEach(() => {
      user=userEvent.setup();
      mockDialogMethods();
      //check 

    });
    const mockHeaderContext: HeaderContextType = {
      hamburgerMenuState: 3, // Assuming HamburgerMenuState.closed
      isSignoutModalShown: false,
      openHamburgerMenu: jest.fn(),
      closeHamburgerMenu: jest.fn(),
      openSignoutModal: jest.fn(),
      closeSignoutModal: jest.fn(),
      hamburgerMenuRef: createRef<HTMLElement>(),
      openHamburgerMenuBtnRef: createRef<HTMLButtonElement>(),
      closeHamburgerMenuBtnRef: createRef<HTMLButtonElement>(),
      isStartChallengeModalShown: true,
      setIsStartChallengeModalShown: jest.fn(),
      closeStartChallengeModal: jest.fn(),
    };
  
    const mockUserContext: UserContextType = {
      user: null,
      emailForSignIn: '',
      signUpWithEmail: jest.fn(),
      sendOTPToEmail: jest.fn(),
      resendOTP: jest.fn(),
      signInWithOTP: jest.fn(),
      signOut: jest.fn(),
      restartChallenge: jest.fn().mockResolvedValueOnce(undefined),
    };
  
    const mockAlertsContext = {
      showAlert: jest.fn(),
    };
  
    afterEach(cleanup);
  /*
    it('renders correctly', () => {
      render(
        <HeaderContext.Provider value={mockHeaderContext}>
          <UserContext.Provider value={mockUserContext}>
            <AlertsContext.Provider value={mockAlertsContext}>
              <StartChallengeModal />
            </AlertsContext.Provider>
          </UserContext.Provider>
        </HeaderContext.Provider>
      );
      
      expect(screen.getByText("Are you sure you want to start the challenge?")).toBeInTheDocument();
    });
  
    it('calls restartChallenge and closes modal when "Yes, let\'s do it!" is clicked', async () => {
      render(
        <HeaderContext.Provider value={mockHeaderContext}>
          <UserContext.Provider value={mockUserContext}>
            <AlertsContext.Provider value={mockAlertsContext}>
              <StartChallengeModal />
            </AlertsContext.Provider>
          </UserContext.Provider>
        </HeaderContext.Provider>
      );
      const yesButton = screen.getByText("Yes, let's do it!");
      fireEvent.click(yesButton);
      await waitFor(() => {
        expect(mockUserContext.restartChallenge).toHaveBeenCalled();
        expect(mockHeaderContext.closeStartChallengeModal).toHaveBeenCalled();
      });
      await waitFor(() => {
        expect(screen.getByText("Starting challenge...")).toBeInTheDocument();
      }); await user.click(screen.getByText("Starting challenge..."));

      await waitFor(()=>
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled());
    });
    */
    //challenge in this way, go more one thing at a time. perfect.
    it('closes modal when "No, maybe later" is clicked', async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <AlertsContext.Provider value={mockAlertsContext}>
              <HeaderContextProvider >


                <StartChallengeModal />


              </HeaderContextProvider >
        </AlertsContext.Provider>
        </UserContext.Provider>
      );

      //too old testdetails 
      await user.click(screen.getByText("No, maybe later"));

      await waitFor(()=>
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled());
      
      
    });
    
  });