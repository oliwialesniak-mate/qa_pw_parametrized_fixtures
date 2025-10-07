import { test } from '../_fixtures/fixtures';
import {
  EMPTY_EMAIL_MESSAGE,
  EMPTY_PASSWORD_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  EMAIL_ALREADY_TAKEN_MESSAGE,
} from '../../src/ui/constants/authErrorMessages';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';

test.describe('Sign up negative tests', () => {
  const testParameters = [
    {
      email: '',
      password: 'Test123!',
      message: EMPTY_EMAIL_MESSAGE,
      title: 'empty email',
    },
    {
      email: 'user@example.com',
      password: '',
      message: EMPTY_PASSWORD_MESSAGE,
      title: 'empty password',
    },
    {
      email: 'invalid-email',
      password: 'Test123!',
      message: INVALID_EMAIL_MESSAGE,
      title: 'invalid email format',
    },
    {
      precondition: true,
      message: EMAIL_ALREADY_TAKEN_MESSAGE,
      title: 'existing email',
    },
  ];

  testParameters.forEach(({ email, password, message, title, precondition }) => {
    test(`Sign up with ${title}`, async ({ page, signUpPage, logger }) => {
      let user = generateNewUserData(logger);

      // Create a valid user first to trigger duplicate error if needed
      if (precondition) {
        await signUpUser(page, user);
        email = user.email;
        password = user.password;
      }

      await signUpPage.open();
      await signUpPage.fillEmailField(email);
      await signUpPage.fillPasswordField(password);
      await signUpPage.clickSignUpButton();
      await signUpPage.assertErrorMessageContainsText(message);
    });
  });
});
